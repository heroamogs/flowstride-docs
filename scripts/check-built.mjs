import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '../.vitepress/dist');
function pages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? pages(file) : file.endsWith('.html') ? [file] : [];
  });
}
const html = new Map(pages(root).map(file => [file, fs.readFileSync(file, 'utf8')]));
let checked = 0;
for (const [file, source] of html) {
  for (const match of source.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replace(/&amp;/g, '&');
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    const url = new URL(href, 'https://docs.local/' + path.relative(root, file));
    const route = decodeURIComponent(url.pathname);
    const target = path.join(root, route === '/' ? 'index.html' : route);
    const resolved = [target, target + '.html', path.join(target, 'index.html')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    assert(resolved, `${path.relative(root, file)}: missing rendered destination ${href}`);
    if (url.hash && html.has(resolved)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert(html.get(resolved).includes(`id="${id}"`), `${path.relative(root, file)}: missing rendered heading ${href}`);
    }
    checked++;
  }
}
console.log(`Rendered documentation checks passed: ${html.size} HTML pages and ${checked} internal links/anchors, including navigation and homepage cards.`);
