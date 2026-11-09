# Capabilities and limits

Flowstride provides native browser, API, manual-testing and CI workflows. OS runs without an account. Cloud includes free accounts and adds workspace services within your plan limits. Keep your installations current through [installation and updates](/guide/releases).

| Area | Native behavior | Boundary |
| --- | --- | --- |
| Browser engines | Chromium, Firefox and WebKit; explicit installation and selection | WebKit is an engine, not the installed Safari application; see [browser compatibility](/guide/browser-compatibility) |
| Browser actions | Readable and spatial targets, configurable typing, keyboard and pointer actions, scrolling, history, named tabs, frame scopes and dialogs | Use distinguishable controls. [Interaction reference](/reference/interaction-commands) |
| Tables and cells | Search through application controls, indexed table/row/cell targeting, row-scoped actions, cell extraction and assertions | Use record identifiers when rows move; virtualized or paginated records must first be rendered. [Examples](/guide/table-testing) |
| Audio-to-text testing | Audio-file microphone input, duration-based waiting and rendered transcript assertions in OS and Cloud | Injection requires Chromium; your application performs transcription. [Examples and limits](/guide/audio-to-text) |
| API and UI together | HTTP/GraphQL setup, extraction and browser actions in the same scenario | Browser and direct API clients do not automatically share every credential |
| Structured API | Multipart, form, JSON, text and binary requests, named clients, schema checks and polling | Named clients stay on their configured origin. [API reference](/reference/structured-api) |
| Retrying assertions | Element state, text/value, attributes, CSS/properties, accessible names, URL/title and storage | Polls the condition; does not repeat the preceding action or API call |
| Independent users | Named browser profiles with separate cookies, storage, pages and permissions | Profiles are local to a flow file; shared backend state remains application-defined |
| Saved sessions | Save/use cookies, localStorage and sessionStorage with origin-aware restoration | A saved session is a snapshot, not a second live user or a complete application-memory capture |
| Network control | Match a request body, delay or route a browser response, and capture, extract or assert browser traffic | Applies to browser traffic in the current profile. [Network controls](/reference/structured-api#browser-network) |
| Files | Select project-local files or folders, save browser downloads and verify their contents | Existing download destinations are rejected and file-size limits apply. [File selection](/reference/data-and-run-control#select-files-and-folders) |
| Data and suite control | JSON, CSV and text fixtures, data rows, seeds, fragments, cleanup, conditional skips and tags | Scenario rows restore runner state. Application writes need their own cleanup. [Data and run control](/reference/data-and-run-control) |
| Time and functions | Browser clock control, function spies, return/throw stubs and call assertions | Backend time and module-private functions are outside this surface |
| Evidence | Video, screenshots, visual baselines with diffs, traces, HAR and DOM snapshots | Treat captured application content as sensitive. [Visual checks](/reference/application-evidence#visual-comparison) |
| Application events | Console output, WebSocket text frames and EventSource messages | Arm observers before the trigger. [Event checks](/reference/application-evidence) |
| Accessibility | axe scans, ARIA capture, exact tree comparisons and reviewed baseline updates | Automated scans are partial coverage; ARIA comparison is not a partial-tree matcher |
| Components | Mount, interact, update and unmount vanilla, React and Vue components | Project framework packages and application providers remain required |
| Retries | Whole-scenario retries, flaky results, strict flaky policy and retained attempt evidence | External side effects are not rolled back |
| CI | Native lifecycle, cancellation, summary/JUnit, matrices, file sharding and complete result merging | Normal CI runners; no shared in-memory state across machines |
| Games | Canvas input, pixel comparisons, state/fixtures, checkpoints and Three.js object selection | Game rules and observable state remain application-defined; qualification is explicit |
| Devices | Desktop, phone and landscape emulation | Emulation is not physical-device certification; some touch/audio paths require Chromium |
| Manual | Canvas design, step details, human execution, defects and local history | No automatic browser execution or canvas-to-DSL converter |
| Cloud | Eligible parallel execution, FlowMail and authenticated workspace services | Credentials, plan limits and service permissions apply |

## Playwright and Flowstride's native commands

Flowstride has native commands for trace/HAR workflows, route mocking, network event waits, independent browser contexts, downloaded-file assertions, accessibility/ARIA snapshots and validated browser settings. These workflows do not require a project plugin or a custom runner.

Start with [native browser workflows](/guide/native-browser-workflows), then use the [structured command index](/reference/structured-commands) for arguments and examples. [Waiting and retries](/guide/waiting-and-retries) explains browser action waiting, polling and scenario retries.

A plugin can still access `sdk.browser.page()` for a focused application extension. A Playwright `Page` does not supply the Playwright Test runner's fixture/project system or make every Playwright option a native Flowstride command. Use supported commands and the [plugin SDK](/flow-language/getting-started/plugins); keep runner ownership in Flowstride.

## Test data and determinism

When a readable label matches several controls, qualify it by container or position. Generation is random by default. Use [a fixed seed](/reference/data-and-run-control#seed-generated-values) for reproducible generated values. Use [registered cleanup](/reference/data-and-run-control#register-cleanup) for disposable server records. Pair visual checks with state assertions for game rules.

## Manual product boundaries

Cloud synchronization is not simultaneous canvas co-editing. An assignee text field is not a notification or issue-tracker integration. A saved local run is not a cryptographically immutable audit record. See the [manual capability guide](/manual-workspace/capabilities) before designing a team workflow around those assumptions.
