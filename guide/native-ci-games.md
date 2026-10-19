# Native CI and browser games

The local combined candidates are OSS `1.0.20-rc.3` and Pro `1.0.15-rc.2`.
They are prepared for acceptance and have not been published. Use Node.js 22.12
or newer. Existing npm users continue receiving the previously published tags
until a separate release is approved.

## Run in CI

Install the candidate archive into a disposable npm project, install its matching
Chromium, and run your existing `.flow` files:

```sh
npm install --save-dev /absolute/path/flowstride-1.0.20-rc.3.tgz
npx --no-install flowstride install
npx --no-install flowstride run flows --ci
```

Native CI needs no `.cjs` wrapper. It exits after execution and writes
`flowstride-artifacts/summary.json`, `junit.xml`, and a separate media directory
for each run. A failed, incomplete or crashed run returns nonzero. Cancellation
records an interrupted result. Headless mode is forced in CI.

Run `npx --no-install flowstride ci init github` when you want a small GitHub
workflow. It creates the file explicitly and refuses to overwrite an existing
workflow. Commit your npm lockfile. Set credentials through CI secrets; do not
place them in workflow source. Keep install, browser setup, execution and
artifact retention steps in the generated order.

Cloud reporting is optional in native CI: set `cloudSync: true` in
`flowstride.config.json` and supply your normal execution token. Execution
status is separate from reporting/video status. Check the summary's `cloudSync`
field or `.flowstride/cloud-sync.json` for upload failures. Failed Cloud
reporting leaves local reports and evidence available. Managed Droplet execution
and `push --cloud` remain retired.

```json
{
  "testDir": "flows",
  "timeout": 30000,
  "device": "desktop",
  "recordVideo": true,
  "cloudSync": false,
  "webServer": {
    "command": "npm run dev",
    "url": "http://127.0.0.1:3000"
  }
}
```

The optional local server belongs to the run and is stopped afterward. Flowstride
refuses a readiness URL that was already serving before it started. A hosted
application needs no `webServer` entry; configure `baseUrl` instead.

## Discovery and failures

Flow discovery includes nested directories. `.first.flow` setup files run
before ordinary flows. Reports retain paths relative to the selected flow
root so `a/login.flow` and `b/login.flow` remain distinct.

A failed scenario skips its remaining steps, then proceeds to later scenarios.
`--bail` stops later work; Pro runs bail suites sequentially. `only.Scenario:`
focuses one scenario within its file. Remove focus markers before broad release
acceptance. Configuration, plugins, fixtures, upload files and artifacts must
remain inside the project, including symlink targets.

## Native game testing

Use the built-in game alias with no plugin file:

```flow
Feature: Browser game
let game = "flowstride:game"
Scenario: Player scores
Given "The game is open"
  flow.open "/"
When "The player taps the board"
  game.tap {"canvas":"#game","x":0.5,"y":0.5}
Then "The score changes"
  game.expectState {"path":"score","equals":1}
```

Available actions include `tap`, `drag`, `swipe`, `key`, `checkpoint`, `snapshot`,
`expectVisual`, `state`, `expectState`, `snapshotState`, `expectPreserved`,
`fixture`, and `select`. Coordinates are relative by default. Visual comparisons
check pixel differences; use state or UI assertions for gameplay correctness.

Applications expose state with `registerGame` from
`flowstride/dist/game/bridge.js`. Three.js applications can use
`registerThreeGame` from `flowstride/dist/game/three-bridge.js` with the existing
scene, camera, canvas, Vector3 and Raycaster. Stable object IDs allow selection
through actual pointer input. Hidden, covered, off-screen and occluded targets
fail explicitly. Application-specific rules and fixtures remain in the game.
Enable fixtures only in dedicated test builds with explicit `testMode: true`.

The qualified profiles use Chromium desktop and device emulation, including
real Three.js fixtures. Phone/landscape profiles are emulation. Physical phones,
other browser engines and other game engines require separate qualification.

## OSS and Pro

OSS stays on npm; private Pro stays behind the authenticated Cloud download.
Install project dependencies before a Pro archive installed with `--no-save`;
subsequent `npm ci` can remove that archive. Compatible Pro is selected after
successful authentication. Missing, broken or incompatible Pro falls back to
OSS. Installing these candidates does not replace the hosted archive.
