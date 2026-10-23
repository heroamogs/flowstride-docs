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
const cloudEngineRoot = process.env.FLOWSTRIDE_CLOUD_ROOT || process.env.FLOWSTRIDE_PRO_ROOT;
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
    jsonSnippets++;
  }
  for (const match of text.matchAll(/```flow\s*\n([\s\S]*?)```/g)) {
    snippets++;
    const fragment = match[1];
    const source = /^Feature:/m.test(fragment) ? fragment : `Feature: Documentation\nScenario: Syntax example\nGiven "Context"\nWhen "Example"\n${fragment}\nThen "Completion"\n flow.expect visible "Documentation fixture";\n`;
    for (const [name, location] of [['OS', process.env.FLOWSTRIDE_OS_ROOT], ['Cloud', cloudEngineRoot]]) {
      if (!location) continue;
      const require = createRequire(path.join(path.resolve(location), 'package.json'));
      const { Lexer } = require('./dist/parser/lexer');
      const { Parser } = require('./dist/parser/parser');
      try {
        const parsed = new Parser(new Lexer(source).tokenise()).parse();
        assert(parsed.flatMap(f => f.scenarios).flatMap(s => s.steps).length > 0);
      } catch (error) { throw Error(`${path.relative(root, file)}: ${name} flow example failed: ${error.message}`); }
    }
  }
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
for (const location of [process.env.FLOWSTRIDE_OS_ROOT, cloudEngineRoot].filter(Boolean)) {
  const require = createRequire(path.join(path.resolve(location), 'package.json'));
  require('./dist/manual/security').manualCanvasSchema.parse(design);
}
console.log(`Documentation checks passed: ${publicContent.length} public source files checked for internal release details, ${pages.length} Markdown pages, ${links} local links, ${snippets} Flow snippets, ${jsonSnippets} JSON snippets, example archive hashes and manual design structure.`);
console.log(process.env.FLOWSTRIDE_OS_ROOT && cloudEngineRoot ? 'All Flow snippets parsed by both current engines; manual template validated by both schemas.' : 'Optional: set FLOWSTRIDE_OS_ROOT and FLOWSTRIDE_CLOUD_ROOT to built package folders for cross-engine syntax/schema checks.');
