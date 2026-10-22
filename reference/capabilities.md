# Capabilities and limits

Use this guide to understand native capabilities and their limits. See [installation and updates](/guide/releases) to keep your project current.

| Area | Native Flowstride behavior | Boundary |
| --- | --- | --- |
| Browser | Navigation, smart targets, input, selects, checks, drag, hover, tabs, dialogs and file upload | Chromium is the qualified engine |
| API | GET, POST, PUT, PATCH, DELETE, GraphQL, extraction and assertions | Not a full API schema/security scanner |
| Assertions | Visibility/text/value, attributes, API fields/status/timing | No complete native mirror of Playwright Test assertions |
| Sessions | Cookies, localStorage and sessionStorage save/use; optional persistence | Active-origin snapshot, not IndexedDB or arbitrary JS state |
| CI | Discovery, lifecycle, cancellation, summary/JUnit, media and workflow generation | Generated workflow needs review for a monorepo or private installation |
| Games | Canvas input, screenshots/pixel differences, state/fixtures and stable IDs | Game rules and observable state remain application-defined |
| Devices | Chromium desktop, phone and landscape profiles | Emulation, not a physical-device farm |
| Manual | Canvas design, step details, human execution, defects and local history | No automatic browser execution or canvas-to-DSL converter |
| Cloud | Parallelism, FlowMail and eligible workspace services, including free-account access within plan limits | Workspace credentials and entitlements apply |

## Playwright underneath does not imply every native command

A plugin can access `sdk.browser.page()` for a Playwright extension, but that is project code. Native DSL coverage does not currently include a general trace/HAR workflow, route-mocking DSL, network event-wait DSL, full multi-context management, downloaded-file assertions, a full accessibility/ARIA snapshot suite, or every browser-context option.

Use [plugins](/flow-language/getting-started/plugins) for a focused extension. A Playwright Test runner feature is not automatically available from a Playwright `Page`. Do not import or replace Flowstride's private runner classes to add a simple action.

## Test data and determinism

Readable targets help maintainability but cannot guarantee an application has unique accessible controls. Generated values are random; they are not a seeded replay system. Pixel changes show that a screen changed, not that a game rule is correct.

## Manual product boundaries

Cloud synchronization is not simultaneous canvas co-editing. An assignee text field is not a notification or issue-tracker integration. A saved local run is not a cryptographically immutable audit record. See the [manual capability guide](/manual-workspace/capabilities) before designing a team workflow around those assumptions.
