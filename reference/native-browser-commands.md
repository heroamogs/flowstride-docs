# Native browser command reference

OS and Cloud share the commands below. Put them inside a complete [Feature/Scenario](/guide/core-concepts), using `flow.<area>.<action>` followed by a JSON object and an optional semicolon. Empty arguments are written `{}`. Unknown actions and fields fail explicitly.

The examples in [native browser workflows](/guide/native-browser-workflows) explain ordering and application setup. This page lists the supported argument surface; it does not make arbitrary Playwright APIs valid DSL commands.

## Names, paths and values

Names are 1–80 characters, start with a letter or number, and use only letters, numbers, `_`, `.` and `-`. Use distinct names within their scope. Fixture, baseline, certificate, storage-state and download paths must resolve inside the project, including symlink targets. A command's returned value is not automatically assigned to a DSL variable.

Timeouts are positive integer milliseconds. JSON booleans and numbers retain their types: use `true` for a boolean property check and `"true"` for an attribute that literally contains that string.

## Profiles and runtime settings

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.browser.create` | `name` | `options`; creates and selects an isolated profile |
| `flow.browser.use` | `name` | Select an existing profile and its remembered page |
| `flow.browser.close` | `name` | Close a named profile; `default` cannot be closed this way |
| `flow.browser.list` | None: `{}` | Return available profile names; no automatic DSL assignment |
| `flow.browser.offline` | `value`: boolean | Applies to the current profile |
| `flow.browser.permissions` | `permissions`: string array | Optional `origin` |
| `flow.browser.clearPermissions` | None: `{}` | Remove granted permissions from the current profile |
| `flow.browser.geolocation` | `latitude`, `longitude` | Nonnegative `accuracy`; grant the application's geolocation permission separately |

Profiles reset between files. `flow.switchTo` selects tabs within the selected profile; saved sessions are snapshots applied to that profile.

### Browser settings

Use these keys in configuration `browserOptions` or a new profile's `options`. New profiles inherit context settings, but do not automatically inherit the default profile's configured authentication storage.

| Settings | Accepted values |
| --- | --- |
| `viewport` | Positive integer `width`/`height`, or `null` |
| `screen` | Positive integer `width`/`height` |
| `deviceScaleFactor` | Positive number |
| `hasTouch`, `isMobile` | Boolean; Firefox rejects explicit `isMobile: true` |
| `locale`, `timezoneId`, `userAgent` | Strings; see [compatibility limits](/guide/browser-compatibility) |
| `colorScheme` | `light`, `dark`, `no-preference`, or `null` |
| `contrast` | `no-preference`, `more`, or `null` |
| `forcedColors` | `active`, `none`, or `null` |
| `reducedMotion` | `reduce`, `no-preference`, or `null` |
| `javaScriptEnabled`, `bypassCSP`, `ignoreHTTPSErrors`, `offline` | Boolean |
| `acceptDownloads`, `strictSelectors` | Boolean |
| `serviceWorkers` | `allow` or `block` |
| `permissions` | Array of permission names; engine support varies |
| `geolocation` | `latitude` from −90 to 90; `longitude` from −180 to 180; optional nonnegative `accuracy` |
| `extraHTTPHeaders` | Object of string header names and string values |
| `httpCredentials` | `username`, `password`; optional `origin` and `send` (`always` or `unauthorized`) |
| `proxy` | `server`; optional `bypass`, `username`, `password` |
| `storageState` | Project-local file or a storage-state object containing `cookies` and `origins`; this differs from a named saved session |
| `clientCertificates` | Array of `origin` plus project-local `certPath`/`keyPath` or `pfxPath`; optional `passphrase` |
| `baseURL` | Context URL setting; Flowstride browser/API relative commands use the run's `BASE_URL` / `baseUrl` |

Recording paths use Flowstride's evidence configuration. Callbacks, arbitrary browser launch arguments and other unlisted context keys are not supported JSON settings. Engine/platform-specific options still require qualification.

## Retrying assertions

`flow.assert.that` requires `condition`. Element conditions require exactly one `selector` or `role`; `role` can include an exact accessible `name`. Optional `frame` is an iframe selector. Page/storage conditions do not need an element selector.

| Conditions | Additional input |
| --- | --- |
| `visible`, `hidden`, `attached`, `enabled`, `disabled`, `editable`, `checked`, `empty`, `focused`, `inViewport` | None |
| `text`, `containsText`, `value`, `id`, `accessibleName`, `accessibleDescription`, `url`, `title` | Expected `value`, or regex `matches` with optional `flags` (`i`, `m`, `s`, `u`) |
| `values` | Ordered array of selected-option values in `value` |
| `count` | Nonnegative integer `value` |
| `attribute` | `attribute`; optional `value`/`matches`; omit the expectation to check presence |
| `css` | CSS `property` and expected `value`/`matches` |
| `property` | JavaScript `property` and expected JSON `value` |
| `localStorage`, `sessionStorage` | `key` and expected string `value`, or `null` for absence |

Every condition accepts `not` and `timeout`. Text reads normalize whitespace. `inViewport` checks a positive-size element intersecting the viewport, not a configurable intersection ratio. `attached` checks that at least one match exists; use `count` to require an exact number. Most element-value checks require exactly one match.

Assertions poll observations, not preceding commands. A stored value or captured event that cannot change is not made correct by polling. See [waiting and retries](/guide/waiting-and-retries).

## Network routes and events

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.network.route` | `name`, `url` | `mode`, `method`, `times`; response/request options below |
| `flow.network.unroute` | `name` | Remove a still-registered route |
| `flow.network.arm` | `name`, `url` | `kind`: `response` (default) or `request`; optional `method`, `timeout`, response `status` filter |
| `flow.network.wait` | `name` | Consume the armed event and retain its captured data |
| `flow.network.expect` | `name` plus an expectation | `status`, `method`, `header`, dotted body `path`, exact JSON `equals`, string `contains` |

Arm before the triggering action; wait before asserting the captured result. The timeout starts at arming. A request event has no response status. Rules, waiters and captured data belong to the current profile. Native waits capture one matching event, not a permanent request history.

Route modes:

- `fulfill` (default): optional `status`, `headers`, `contentType`, and one of `json`, text `body`, or project-local `fixture`.
- `patch`: fetch the real response, then shallow-merge a JSON object or replace the body; optional response status/headers. Nested objects are not deep-merged.
- `continue`: forward the request; optional `request` object can change `url`, `method`, string `headers` or text `body`.
- `abort`: block the request; response and request-rewrite fields are invalid.

`times` is a positive maximum match count; an exhausted route removes itself. Browser event URL matching supports `*` within a segment and `**` across segments; use simple patterns such as `**/api/customer`. Response/fixture captures have a 20 MiB content limit. Browser routes do not intercept direct API commands. Block service workers when they would otherwise handle requests outside the routing path.

## Downloads

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.download.arm` | `name` | `timeout`; observe the current page's next download |
| `flow.download.save` | `name`, `file` | Wait for the armed event and save to a new project-local destination |
| `flow.download.expect` | `name` plus an expectation | Suggested `filename`, exact byte `size`, `minSize`, text `contains`, complete `json`, lowercase 64-character `sha256` |

Arm before the click. A saved destination must not already exist; use a fresh name such as `downloads/report-$uuid.json` for repeatable runs. `filename` checks the browser's suggested filename, not your chosen destination name. Text/JSON checks have a 20 MiB limit; hash checks stream the file. Downloads are scoped to the profile; switch back before saving/asserting its event.

## Browser clock

| Command | Fields | Behavior |
| --- | --- | --- |
| `flow.clock.install` | Optional `time` | Install page clock control; optional date string or numeric time |
| `flow.clock.pauseAt` | `time` | Advance/pause at the specified date/time |
| `flow.clock.resume` | `{}` | Resume time |
| `flow.clock.runFor` | `milliseconds` | Advance time while running scheduled timers |
| `flow.clock.fastForward` | `milliseconds` | Jump time; repeating timers behave differently from `runFor` |
| `flow.clock.setFixedTime` | `time` | Fix the reported current time without the same timer behavior as pausing |
| `flow.clock.setSystemTime` | `time` | Change the clock's system time |

Advances are integer milliseconds from 0 through 86,400,000. Install before the application creates timers; pause explicitly when an exact tick count matters. These commands do not control backend or operating-system time.

## Function spies and stubs

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.stub.install` | `name`, dotted `target` | `mode`: `spy` (default), `return`, `throw`; optional `value`, `error`, `async`, `beforeLoad` |
| `flow.stub.expect` | `name` plus an expectation | Exact `count`, `minCount`, one matching argument array `args`, `timeout` |
| `flow.stub.restore` | `name` | Restore the original function on the current page |

The target must be a replaceable function reachable from `window`. A spy observes calls and invokes the original. A stub replaces its result or throws; `async: true` produces a promise result/rejection. `beforeLoad` installs an initializer, but cannot discover a function that application code has not defined yet. Module-private functions need a suitable application seam.

Doubles belong to the page; a same-name double on another profile/page is separate. Call arguments are compared with JSON-compatible captured values. Restore before replacing an existing name.

## Traces and HAR

| Command | Fields | Behavior |
| --- | --- | --- |
| `flow.trace.start` | Optional `name` | Start tracing the current profile; rejects an already-active trace |
| `flow.trace.stop` | `{}` | Finalize the current profile's trace ZIP |
| `flow.har.replay` | `file`; optional `url`, `notFound` | Read an existing local HAR; unmatched requests `abort` by default, or explicitly `fallback` |

Set configuration `trace: true` for automatic tracing or use explicit start/stop for a bounded trace. HAR **recording** is configured with `har: true` before context creation; there is no `flow.har.record` action. Replay reads a project-local HAR within 100 MiB and does not update it. See [evidence workflows](/guide/native-browser-workflows#traces-har-and-dom-evidence) and [browser limits](/guide/browser-compatibility).

## Accessibility and ARIA

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.a11y.scan` | None: `{}` | `name` (default `accessibility`), selector arrays `include`/`exclude`, `tags`, `rules`, `disableRules`, `impacts`, `maxViolations` (default 0) |
| `flow.a11y.snapshot` | `name` | `selector` (default `body`), `baseline`, `timeout`, `update` |
| `flow.a11y.match` | Nonempty `yaml` | `selector` (default `body`), `timeout`; retries a complete-tree comparison |

Impacts are `minor`, `moderate`, `serious`, `critical`. The scan threshold counts violation entries after selected impact filtering, not the number of affected DOM nodes. A structured axe report is retained even when the scan fails.

A snapshot without `baseline` captures evidence. With `baseline`, it compares a complete YAML tree. Deliberate writes require local `--update-baselines`; `update: true` does not bypass that CLI requirement. CI refuses baseline writes. `snapshot` compares its capture once; use `match` for a retrying inline tree comparison. These are exact comparisons, not a partial snapshot matcher or visual screenshot baseline.

## Components

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.component.mount` | `framework`: `vanilla`, `react`, or `vue`; project-local `module` | `export` (default `default`), JSON `props`, project-local `css` array |
| `flow.component.update` | `props` object | Apply the next props; framework behavior applies |
| `flow.component.unmount` | `{}` | Unmount the current page's mounted component |

Install the project's React/React DOM or Vue packages as appropriate. Flowstride manages a local Vite harness; it does not automatically load your app's Vite configuration, providers, router or backend. React updates follow React rendering; Vue replaces supplied prop keys; vanilla update remounts the factory. Mounting another component disposes the previous harness.

## Interpret a failed command

Native assertions preserve successful lookup checks and failed conditions separately. The terminal, interactive views and CI JSON/JUnit retain the target, expected/actual condition, timeout and source location. Dependent checks remain not evaluated when a prerequisite is missing. See [assertions and diagnostics](/guide/assertions-and-diagnostics).

For complete workflows beyond individual command arguments, use [browser environments](/guide/browser-environments), [component testing](/guide/component-testing), [tabs and iframes](/guide/tabs-and-iframes), and [the feature map](/guide/feature-map).
