import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { before, after, test } from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const docs = JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).name === 'docs';
const tools = process.env.FLOWSTRIDE_BROWSER_TOOLS;
assert(tools, 'Set FLOWSTRIDE_BROWSER_TOOLS to the isolated Playwright package directory.');
const { chromium, firefox, webkit } = createRequire(path.join(path.resolve(tools), 'package.json'))('playwright');
let origin, server, child, output = '';

before(async () => {
  if (docs) {
    const dist = path.join(root, '.vitepress/dist');
    assert(fs.existsSync(dist), 'Build the documentation before browser regression.');
    const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2' };
    server = createServer((req, res) => {
      try {
        const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '');
        const target = path.resolve(dist, relative);
        if (path.relative(dist, target).startsWith('..')) { res.writeHead(403); res.end(); return; }
        const file = [target, target + '.html', path.join(target, 'index.html')]
          .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        if (!file) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
        res.end(fs.readFileSync(file));
      } catch { res.writeHead(400); res.end(); }
    });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    origin = `http://127.0.0.1:${server.address().port}`;
  } else {
    const reserve = createServer(); reserve.listen(0, '127.0.0.1'); await once(reserve, 'listening');
    const port = reserve.address().port; await new Promise(resolve => reserve.close(resolve));
    origin = `http://127.0.0.1:${port}`;
    child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
      { cwd:root, env:{...process.env, NEXT_TELEMETRY_DISABLED:'1'}, stdio:['ignore','pipe','pipe'] });
    child.stdout.on('data', data => output += data); child.stderr.on('data', data => output += data);
    let ready = false;
    for (let attempt = 0; attempt < 120 && !ready; attempt++) {
      assert(child.exitCode === null, `Website server exited: ${output}`);
      try { ready = (await fetch(origin, { signal:AbortSignal.timeout(1000) })).ok; } catch {}
      if (!ready) await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert(ready, `Website server did not become ready: ${output}`);
  }
}, { timeout:45000 });

after(async () => {
  if (child && child.exitCode === null) { child.kill('SIGTERM'); await once(child, 'close'); }
  if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

for (const [name, engine] of Object.entries({chromium, firefox, webkit})) {
  test(`${docs ? 'Documentation' : 'Website'} production regression in ${name}`, { timeout:90000 }, async () => {
    const browser = await engine.launch({ headless:true });
    try {
      const context = await browser.newContext({ viewport:{width:1440,height:1000} });
      // Keep acceptance local: never call Cloud, payment providers, analytics or CDNs.
      await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => { window.__copied = ''; Object.defineProperty(navigator, 'clipboard', {value:{writeText:async value => {window.__copied = value;}}}); });
      assert((await page.goto(origin)).ok());
      await page.locator('h1').first().waitFor();
      if (docs) {
        assert.match(await page.locator('h1').innerText(), /Test the journey/);
        await page.locator('.VPNavBarSearch button').click();
        await page.locator('#localsearch-input').fill('session');
        await page.locator('#localsearch-list a.result').first().waitFor();
        await page.locator('#localsearch-list a.result').first().click();
        await page.waitForURL(url => url.pathname !== '/');
        assert.match(await page.locator('main').innerText(), /session/i);
        for (const route of ['/guide/api-and-ui', '/guide/table-testing', '/guide/audio-to-text', '/manual-workspace/manual-testing', '/guide/native-browser-workflows']) {
          assert((await page.goto(origin + route)).ok());
          await page.locator('main h1').waitFor();
          assert((await page.locator('main').innerText()).length > 300);
        }
        await page.getByRole('switch').first().click();
        await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
      } else {
        assert.match(await page.title(), /Flowstride/);
        await page.getByRole('button', {name:'Copy', exact:true}).click();
        await page.waitForFunction(() => window.__copied === 'npm install -g flowstride');
        assert.equal(await page.locator('a[href="https://github.com/heroamogs/flowstride-os"]').count() > 0, true);
        // Image optimization still serves the existing local image after Next/sharp updates.
        const image = await context.request.get(origin + '/_next/image?url=%2Flogo.png&w=64&q=75');
        assert.equal(image.status(), 200); assert.match(image.headers()['content-type'], /^image\//);
        const denied = await context.request.get(origin + '/_next/image?url=http%3A%2F%2F127.0.0.1%3A1%2Fprivate&w=64&q=75');
        assert.equal(denied.status(), 400);
        assert((await page.goto(origin + '/pricing')).ok());
        await page.getByText('Personal', {exact:true}).waitFor();
        assert.equal((await context.request.get(origin + '/not-a-real-route')).status(), 404);
      }
      await page.setViewportSize({width:390,height:844});
      assert((await page.goto(origin)).ok()); await page.locator('h1').first().waitFor();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile layout overflows horizontally');
      const evidence = path.join(root, 'test-results'); fs.mkdirSync(evidence, {recursive:true});
      await page.screenshot({path:path.join(evidence, `${name}-mobile.png`), fullPage:true});
      assert.deepEqual(errors, [], 'Client rendering or hydration errors');
    } finally { await browser.close(); }
  });
}
