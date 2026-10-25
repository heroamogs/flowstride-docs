import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['node_modules', '.git', 'dist', 'cache'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}
const cloudEngineRoot = process.env.FLOWSTRIDE_CLOUD_ROOT;
const engines = [['OS', process.env.FLOWSTRIDE_OS_ROOT], ['Cloud', cloudEngineRoot]]
  .filter(([, location]) => location).map(([name, location]) => {
    const require = createRequire(path.join(path.resolve(location), 'package.json'));
    return { name, require, Lexer: require('./dist/parser/lexer').Lexer, Parser: require('./dist/parser/parser').Parser };
  });
if (process.env.CI) assert(engines.some(engine => engine.name === 'OS'), 'CI requires the public OS engine for documentation syntax checks.');
function parseFlow(source, label) {
  for (const { name, Lexer, Parser } of engines) {
    try {
      const features = new Parser(new Lexer(source).tokenise()).parse();
      assert(features.flatMap(f => f.scenarios).flatMap(s => s.steps).length > 0);
    } catch (error) { throw Error(`${label}: ${name} flow example failed: ${error.message}`); }
  }
}
// Independent language contracts prevent examples from redefining the language.
const validScenario = 'Scenario: A\nGiven "Context"\n flow.open "/";\nWhen "Action"\n flow.click "Save";\nThen "Result"\n flow.expect visible "Saved";\n';
for (const { name, Lexer, Parser } of engines) {
  const parse = source => new Parser(new Lexer(source).tokenise()).parse();
  const valid = 'Feature: Contract\n' + validScenario;
  assert.doesNotThrow(() => parse(valid), `${name}: ordinary scenario`);
  assert.doesNotThrow(() => parse(valid + validScenario.replace('Scenario: A', 'Scenario: B')), `${name}: next Scenario after Then`);
  assert.doesNotThrow(() => parse(valid + ' flow.expect visible "Done";\n flow.click "Logout";'), `${name}: commands inside final Then`);
  assert.doesNotThrow(() => parse(valid.replace('Then "Result"', 'And "Intermediate check"\n flow.assert.that {"role":"button","name":"Save","condition":"enabled"};\nThen "Result"')), `${name}: intermediate assertion And`);
  for (const tail of ['And "Late check"\n flow.expect visible "Done";', 'When "Late action"\n flow.click "Save";', 'Given "Late setup"\n flow.open "/";', 'Then "Second final"\n flow.expect visible "Done";', 'let helper = "helper"', 'Feature: Another']) {
    assert.throws(() => parse(valid + tail), `${name}: Then must be terminal: ${tail.split('\n')[0]}`);
  }
  assert.throws(() => parse(validScenario), `${name}: Feature required`);
  assert.throws(() => parse('Feature: First\nFeature: Second\n' + validScenario), `${name}: exactly one Feature`);
  assert.throws(() => parse(valid.replace('Then "Result"', 'And "Not an action block"\n flow.click "Save";\nThen "Result"')), `${name}: And is assertion-only`);
}
function checkJsonLayout(source, label) {
  for (const [index, line] of source.split('\n').entries()) {
    const candidate = line.trim().replace(/^[\w.]+\s+(?=\{)/, '').replace(/;$/, '');
    if (!candidate.startsWith('{') || !candidate.endsWith('}')) continue;
    let value; try { value = JSON.parse(candidate); } catch { continue; }
    assert(Object.keys(value).length <= 1 && !Object.values(value).some(v => v && typeof v === 'object' && !Array.isArray(v)), `${label}:${index + 1}: expand multi-property or nested JSON across lines`);
  }
}
function completeSnippet(fragment) {
  if (/^\s*Feature\s*:/m.test(fragment)) return fragment;
  if (/^\s*(?:only\.)?Scenario\s*:/m.test(fragment)) return `Feature: Documentation\n${fragment}`;
  const has = name => new RegExp(`^\\s*(?:stop\\.)?${name}\\s+"`, 'mi').test(fragment);
  let prefix = 'Feature: Documentation\nScenario: Syntax example\n';
  if (!has('Given')) prefix += 'Given "Context"\n';
  if (!has('Given') && !has('When')) prefix += 'When "Example"\n';
  let suffix = '';
  if (!has('Then')) {
    if (has('Given') && !has('When')) suffix += '\nWhen "Example"\n';
    suffix += '\nThen "Completion"\n flow.expect visible "Documentation fixture";\n';
  }
  return prefix + fragment + suffix;
}
const sourceFiles = files(root);
const publicContent = sourceFiles.filter(file => file.endsWith('.md') ||
  (file.startsWith(path.join(root, '.vitepress') + path.sep) && /\.(?:ts|vue|css)$/.test(file)) ||
  (file.startsWith(path.join(root, 'public') + path.sep) && /\.(?:txt|json|mjs|flow)$/.test(file)));
const internalReleaseDetails = [
  /flowstride\s*@\s*(?:next|\d[^\s`"']*-(?:rc|alpha|beta))/i,
  /\b(?:rc[ .-]?\d+|\d+\.\d+\.\d+-(?:rc|alpha|beta)[.\d-]*)\b/i,
  /\bCloud\s+(?:version\s+|v)?\d+\.\d+/i,
  /\bPro\b/i,
  /flowstride(?:-pro)?-[\d][^\s`"']*\.tgz/i,
  /\b(?:local|release|acceptance)\s+candidates?\b|candidate documentation|documentation preview|preview channel/i,
  /\bdist-tags\b|@flowstride\/pro\b|\bOSS\b/,
  /\b(?:FLOWSTRIDE_PRO_[A-Z_]+|CRON_SECRET)\b/,
  /https?:\/\/[^\s/"'<>]*(?:spaces|s3|storage)[^\s/"'<>]*\//i,
  /\/Users\/[^/\s]+\//
];
for (const file of publicContent) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of internalReleaseDetails) {
    assert(!pattern.test(text), `${path.relative(root, file)}: internal release or distribution detail in public content`);
  }
}
const pages = sourceFiles.filter(file => file.endsWith('.md'));
let links = 0, snippets = 0, jsonSnippets = 0;
for (const file of pages) {
  const text = fs.readFileSync(file, 'utf8');
  if (path.relative(root, file) !== 'guide/native-ci-games.md') assert(!text.includes('--no-install'), `${path.relative(root, file)}: reserve --no-install for the CI guide`);
  const prose = text.replace(/```[\s\S]*?```/g, '');
  for (const match of prose.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|#)/.test(href)) continue;
    const local = decodeURIComponent(href.split('#')[0]);
    const target = local.startsWith('/') ? path.join(root, local) : path.resolve(path.dirname(file), local);
    const publicTarget = local.startsWith('/') ? path.join(root, 'public', local) : '';
    assert([target, target + '.md', path.join(target, 'index.md'), publicTarget].some(p => p && fs.existsSync(p)), `${path.relative(root, file)}: missing ${href}`);
    links++;
  }
  for (const match of text.matchAll(/```json\s*\n([\s\S]*?)```/g)) {
    try { JSON.parse(match[1]); } catch (error) { throw Error(`${path.relative(root, file)}: invalid JSON example: ${error.message}`); }
    checkJsonLayout(match[1], path.relative(root, file));
    jsonSnippets++;
  }
  for (const match of text.matchAll(/```flow\s*\n([\s\S]*?)```/g)) {
    snippets++;
    const fragment = match[1];
    const source = completeSnippet(fragment);
    checkJsonLayout(fragment, path.relative(root, file));
    parseFlow(source, path.relative(root, file));
  }
}
let flowFiles = 0, homepageExamples = 0;
for (const file of sourceFiles.filter(file => file.endsWith('.flow'))) {
  parseFlow(fs.readFileSync(file, 'utf8'), path.relative(root, file)); flowFiles++;
}
const homepage = fs.readFileSync(path.join(root, '.vitepress/theme/DocsHome.vue'), 'utf8');
for (const match of homepage.matchAll(/<pre\b[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)) {
  const source = match[1].replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  parseFlow(source, 'Homepage Flow preview'); homepageExamples++;
}
const assets = path.join(root, 'public/examples');
const manifest = JSON.parse(fs.readFileSync(path.join(assets, 'examples-manifest.json')));
for (const [file, expected] of Object.entries({ ...manifest.sourceFiles, ...manifest.archives })) {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(assets, file))).digest('hex'), expected, `${file}: repackage examples after edits`);
}
const design = JSON.parse(fs.readFileSync(path.join(assets, 'manual-checkout.json')));
const ids = design.nodes.map(n => n.id);
assert.equal(new Set(ids).size, ids.length);
assert(design.nodes.every(n => n.title && n.steps && n.expected_result));
assert(design.connections.every(c => ids.includes(c.start_node_id) && ids.includes(c.end_node_id)));
assert(design.connections.every(c => design.connections.filter(x => x.start_node_id === c.start_node_id).length === 1));
for (const { require } of engines) {
  require('./dist/manual/security').manualCanvasSchema.parse(design);
}
console.log(`Documentation checks passed: ${publicContent.length} public source files checked for internal release details, ${pages.length} Markdown pages, ${links} local links, ${snippets} Flow snippets, ${jsonSnippets} JSON snippets, ${flowFiles} Flow files, ${homepageExamples} homepage example, language contracts, example archive hashes and manual design structure.`);
console.log(process.env.FLOWSTRIDE_OS_ROOT && cloudEngineRoot ? 'All Flow snippets parsed by both current engines; manual template validated by both schemas.' : 'Optional: set FLOWSTRIDE_OS_ROOT and FLOWSTRIDE_CLOUD_ROOT to built package folders for cross-engine syntax/schema checks.');
