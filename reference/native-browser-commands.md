# Native browser command reference

OS and Cloud share the commands below. Put them inside a complete [Feature/Scenario](/guide/core-concepts), using `flow.<area>.<action>` followed by a JSON object and an optional semicolon. Empty arguments are written `{}`. Unknown actions and fields fail explicitly.

The [structured command index](/reference/structured-commands) includes every object command and links to its examples. This page covers profiles, time control, downloads, accessibility, components and browser evidence. For setup and ordering, see [native browser workflows](/guide/native-browser-workflows).

## Names, paths and values

Names are 1–80 characters, start with a letter or number, and use only letters, numbers, `_`, `.` and `-`. Use distinct names within their scope. Fixture, baseline, certificate, storage-state and download paths must resolve inside the project, including symlink targets. A command's returned value is not automatically assigned to a DSL variable.

Timeouts are positive integer milliseconds. JSON booleans and numbers retain their types: use `true` for a boolean property check and `"true"` for an attribute that literally contains that string.

## Profiles and runtime settings

A browser profile lets you keep a separate browser session for each test user. For example, stay signed in as a customer in one profile and as an administrator in another. Switching profiles takes you back to that user’s page and keeps their cookies and storage separate.

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

For a location test, create a separate profile and grant permission for the app’s origin. This example uses the configured base URL and a page that asks for location.

```flow
flow.browser.create {
  "name": "lagos-customer",
  "options": {
    "locale": "en-NG"
  }
};
flow.browser.permissions {
  "permissions": ["geolocation"],
  "origin": "{{env.BASE_URL}}"
};
flow.browser.geolocation {
  "latitude": 6.5244,
  "longitude": 3.3792
};
flow.open "/delivery";
flow.browser.clearPermissions {};
flow.browser.list {};
flow.browser.use { "name": "default" };
flow.browser.close { "name": "lagos-customer" };
```

To test offline behavior, open a page with an offline UI, toggle the current profile’s network and exercise a control that checks connectivity.

```flow
flow.browser.offline { "value": true };
flow.click button "Check connection";
flow.expect visible "You are offline";
flow.browser.offline { "value": false };
```

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

`flow.assert.that` retries a browser condition using readable text or label, a scoped readable target, a role and name, or a selector. See [every condition and example](/reference/assertions#flow-assert-that). To check already-extracted data, use [`flow.assert.value`](/reference/assertions#flow-assert-value).

## Network routes and events

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.network.route` | `name`, `url` | `mode`, `method`, `times`, `delay`, `requestBody` and the response or request options below |
| `flow.network.unroute` | `name` | Remove a registered route, including one that exhausted its match count |
| `flow.network.arm` | `name`, `url` | `kind`: `response` (default) or `request`; optional `method`, `timeout`, response `status` filter |
| `flow.network.wait` | `name` | Consume the armed event and retain its captured data |
| `flow.network.expect` | `name` plus an expectation | `status`, `method`, `header`, dotted body `path`, exact JSON `equals`, string `contains` |

Arm before the triggering action; wait before asserting the captured result. The timeout starts at arming. A request event has no response status. Rules, waiters and captured data belong to the current profile. Native waits capture one matching event, not a permanent request history.

Route modes:

- `fulfill` (default): optional `status`, `headers`, `contentType`, and one of `json`, text `body`, or project-local `fixture`.
- `patch`: fetch the real response, then shallow-merge a JSON object or replace the body; optional response status/headers. Nested objects are not deep-merged.
- `continue`: forward the request; optional `request` object can change `url`, `method`, string `headers` or text `body`.
- `abort`: block the request; response and request-rewrite fields are invalid.

`times` is a positive maximum match count. After it is reached, subsequent requests fall through. `delay` adds latency and `requestBody` matches a typed JSON field before applying the route. See [body-aware route and capture examples](/reference/structured-api#browser-network).

## Downloads

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.download.arm` | `name` | `timeout`; observe the current page's next download |
| `flow.download.save` | `name`, `file` | Wait for the armed event and save to a new project-local destination |
| `flow.download.expect` | `name` plus an expectation | Suggested `filename`, exact byte `size`, `minSize`, text `contains`, complete `json`, lowercase 64-character `sha256` |

Arm before the click. A saved destination must not already exist; use a fresh name such as `downloads/report-$uuid.json` for repeatable runs. `filename` checks the browser's suggested filename, not your chosen destination name. Text/JSON checks have a 20 MiB limit; hash checks stream the file. Downloads are scoped to the profile; switch back before saving/asserting its event.

See the [export, save and verify example](/reference/assertions#flow-download-expect).

## Browser clock

If your app enables **Resend code** after a 60-second countdown, you can advance the browser clock and check that the button becomes available. This lets you exercise the countdown in seconds of real time.

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

For a page with a countdown, install the clock, pause it at a known time and advance the page through five seconds of scheduled ticks. Resume when the page can proceed in real time.

```flow
flow.clock.install { "time": "2026-03-01T10:00:00Z" };
flow.clock.pauseAt { "time": "2026-03-01T10:01:00Z" };
flow.open "/countdown";
flow.clock.runFor { "milliseconds": 5000 };
flow.clock.resume {};
```

Use `fastForward` to model a jump such as the browser returning from sleep. A timer fires at most once during that jump. `setSystemTime` moves the system-time value without firing timers. For a fixed date label while timers continue, use `setFixedTime`.

```flow
flow.clock.fastForward { "milliseconds": 60000 };
flow.clock.setSystemTime { "time": "2026-03-01T10:10:00Z" };
flow.clock.setFixedTime { "time": "2026-03-01T10:30:00Z" };
```

## Function spies and stubs

If clicking **Place order** should send one analytics event, a spy can count the call while the original function runs. A stub controls what the function returns or what error it throws. For example, make the quote function throw so you can check that the page shows **Try again later**.

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.stub.install` | `name`, dotted `target` | `mode`: `spy` (default), `return`, `throw`; optional `value`, `error`, `async`, `beforeLoad` |
| `flow.stub.expect` | `name` plus an expectation | Exact `count`, `minCount`, one matching argument array `args`, `timeout` |
| `flow.stub.restore` | `name` | Restore the original function on the current page |

The target must be a replaceable function reachable from `window`. Use `async: true` for a promise result or rejection. Use `beforeLoad` to install an initializer for functions available at that point in the page’s lifecycle. For module-private functions, expose a replaceable entry point in the test build.

Doubles belong to the page; a same-name double on another profile/page is separate. Call arguments are compared with JSON-compatible captured values. Restore before replacing an existing name.

The [spy, call assertion and restore example](/reference/assertions#flow-stub-expect) observes a real function. The example below installs the quote stub and restores the original function after checking the fallback.

```flow
flow.stub.install {
  "name": "quote-outage",
  "target": "shopQuotes.calculate",
  "mode": "throw",
  "error": "Quote service unavailable"
};
flow.click button "Get quote";
flow.expect visible "Try again later";
flow.stub.restore { "name": "quote-outage" };
```

## Traces and HAR

A **trace** helps you retrace what happened during a test. If checkout fails after **Review order**, you can inspect the click and what the page looked like at that point.

A **HAR** (HTTP Archive) records the requests the browser made and the responses it got. For example, record the order list while the service is available, then replay that response in a later test of the order page.

| Command | Fields | Behavior |
| --- | --- | --- |
| `flow.trace.start` | Optional `name` | Start tracing the current profile; rejects an already-active trace |
| `flow.trace.stop` | `{}` | Finalize the current profile's trace ZIP |
| `flow.har.replay` | `file`; optional `url`, `notFound` | Read an existing local HAR; unmatched requests `abort` by default, or explicitly `fallback` |

Set configuration `trace: true` for automatic tracing or use explicit start/stop for a bounded trace. HAR **recording** is configured with `har: true` before context creation; there is no `flow.har.record` action. Replay reads a project-local HAR within 100 MiB and does not update it. See [evidence workflows](/guide/native-browser-workflows#traces-har-and-dom-evidence) and [browser limits](/guide/browser-compatibility).

```flow
flow.trace.start { "name": "checkout" };
flow.open "/checkout";
flow.click button "Review order";
flow.trace.stop {};
```

In a separate run, use a HAR recorded for the same app origin to replay a specific GET endpoint before opening the page.

```flow
flow.har.replay {
  "file": "fixtures/orders.har",
  "url": "**/api/orders",
  "notFound": "abort"
};
flow.open "/orders";
```

## Accessibility and ARIA

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.a11y.scan` | None: `{}` | `name` (default `accessibility`), selector arrays `include`/`exclude`, `tags`, `rules`, `disableRules`, `impacts`, `maxViolations` (default 0) |
| `flow.a11y.snapshot` | `name` | `selector` (default `body`), `baseline`, `timeout`, `update` |
| `flow.a11y.match` | Nonempty `yaml` | `selector` (default `body`), `timeout`; retries a complete-tree comparison |

Impacts are `minor`, `moderate`, `serious`, `critical`. The scan threshold counts violation entries after selected impact filtering, not the number of affected DOM nodes. A structured axe report is retained even when the scan fails.

A snapshot without `baseline` captures evidence. With `baseline`, it compares a complete YAML tree. Deliberate writes require local `--update-baselines`; `update: true` does not bypass that CLI requirement. CI refuses baseline writes. `snapshot` compares its capture once; use `match` for a retrying inline tree comparison. These are exact comparisons, not a partial snapshot matcher or visual screenshot baseline.

See [scan, inline YAML and file-baseline examples](/reference/assertions#accessibility-and-visuals).

## Components

A component test loads one piece of the interface on its own. For example, you can give an order badge the status **Pending**, change it to **Approved**, and check that the displayed label updates.

| Command | Required fields | Optional fields / behavior |
| --- | --- | --- |
| `flow.component.mount` | `framework`: `vanilla`, `react`, or `vue`; project-local `module` | `export` (default `default`), JSON `props`, project-local `css` array |
| `flow.component.update` | `props` object | Apply the next props; framework behavior applies |
| `flow.component.unmount` | `{}` | Unmount the current page's mounted component |

Install the project's React/React DOM or Vue packages as appropriate. Flowstride manages a local Vite harness; it does not automatically load your app's Vite configuration, providers, router or backend. React updates follow React rendering; Vue replaces supplied prop keys; vanilla update remounts the factory. Mounting another component disposes the previous harness.

This example uses a React component at `components/OrderBadge.tsx` that displays its `status` prop. See [component setup and complete examples](/guide/component-testing).

```flow
flow.component.mount {
  "framework": "react",
  "module": "components/OrderBadge.tsx",
  "props": {
    "status": "Pending"
  }
};
flow.expect visible "Pending";
flow.component.update {
  "props": {
    "status": "Approved"
  }
};
flow.expect visible "Approved";
flow.component.unmount {};
```

## Interpret a failed command

Native assertions preserve successful lookup checks and failed conditions separately. The terminal, interactive views and CI JSON/JUnit retain the target, expected/actual condition, timeout and source location. Dependent checks remain not evaluated when a prerequisite is missing. See [assertions and diagnostics](/guide/assertions-and-diagnostics).

For complete workflows beyond individual command arguments, use [browser environments](/guide/browser-environments), [component testing](/guide/component-testing), [tabs and iframes](/guide/tabs-and-iframes), and [the feature map](/guide/feature-map).
