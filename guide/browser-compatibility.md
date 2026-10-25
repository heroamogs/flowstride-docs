# Browser compatibility

OS and Cloud use the same browser-selection commands. Chromium is the default; Firefox and WebKit are explicit choices. Install the matching binaries after installing or updating Flowstride:

```sh
npx flowstride install chromium firefox webkit
npx flowstride run flows --browser firefox --headed
```

Installing several browsers does not select all of them for a run. Run once per browser, or generate a [CI browser matrix](/guide/native-ci-games#browser-matrices-and-shards).

## Confirm which browser is running

The terminal prints the launched test engine, version and headed/headless state. The dashboard's **Test browser** label and CI's per-file browser metadata identify the test browser too.

For interactive Firefox/WebKit runs, Flowstride opens the dashboard in a separate window of the selected engine. Chromium runs open the dashboard in the system default browser. The dashboard window is separate from the tested application. Use `--headed` to see the application window; CI forces headless mode and opens no dashboard.

WebKit is the browser engine used by Safari. Selecting it does not automate your installed Safari application. Firefox and WebKit use their native user-agent unless you override it explicitly.

## Feature and platform boundaries

| Area | Current behavior |
| --- | --- |
| Ordinary browser workflows | Local checks cover Chromium, Firefox and WebKit in OS and Cloud, including profiles, routes, downloads, assertions, components and accessibility |
| Desktop/phone/landscape | Device emulation; physical phones and every operating-system combination need separate acceptance |
| Firefox mobile settings | Explicit `isMobile: true` is rejected; built-in phone profiles omit that flag. A small viewport is not a claim of identical mobile-browser behavior |
| Touch dragging/swiping | Uses Chromium CDP; choose Chromium and a touch-capable profile |
| Tables and cells | Search, coordinate targeting, row actions and assertions in all three engines; [runnable examples](/guide/table-testing) |
| Audio-file microphone injection | Requires Chromium in OS and Cloud; [audio-to-text testing](/guide/audio-to-text) checks your application's transcription |
| Three.js integration | Real scene fixtures are qualified on Chromium; qualify other engines against your actual game |
| Custom locale in Chromium | Chromium's current stealth behavior can expose `en-US` despite a requested locale. Use Firefox/WebKit for locale-sensitive checks and verify the observed language |
| HAR playback with forced offline mode | Firefox/WebKit can reject navigation when `flow.browser.offline` is true, before HAR fulfillment. Keep that flag unset for HAR playback and stop the real server to verify the recording |

HAR replay with the fixture server stopped works across all three browsers. `notFound: "abort"` rejects unmatched requests, so missing recordings do not silently reach the real service. [HAR workflow](/guide/native-browser-workflows#traces-har-and-dom-evidence).

## Browser settings are validated

Use `browserOptions` for the default profile or `options` in `flow.browser.create`. Supported keys are listed in the [native command reference](/reference/native-browser-commands#browser-settings). Unknown keys fail; JavaScript callbacks and arbitrary launch arguments are not JSON browser settings.

Some permissions and options depend on the selected engine and operating system. A setting being accepted by the schema is not proof that every engine implements it identically. Keep engine-specific checks in the appropriate browser matrix.

## Missing browser binaries

Install the engine you actually selected:

```sh
npx flowstride install firefox
npx flowstride install webkit
```

On supported Linux CI runners, include operating-system dependencies:

```sh
npx flowstride install chromium firefox webkit --with-deps
```

Use Flowstride's matching installer rather than an unrelated global Playwright installation. [Troubleshooting](/guide/troubleshooting) covers engine selection, fallback and retained results.
