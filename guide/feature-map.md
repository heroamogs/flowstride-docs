# What you can build with Flowstride

Flowstride brings browser actions, APIs, reusable data, assertions and evidence into readable `.flow` scenarios. Use the same suite interactively and in CI. Use the separate Manual Workspace for cases that need a person's observation and judgment.

OS runs locally without an account. A free Cloud account connects workspace services; access and usage depend on your workspace plan. Cloud is an account-connected engine and service layer, not a requirement to host the application or surrender control of your CI runner.

## Choose the outcome you need

| What you want to verify | Native Flowstride workflow | Learn it |
| --- | --- | --- |
| A complete customer journey | Browser actions, HTTP/GraphQL preparation, extraction and shared data in one scenario | [API + UI](/guide/api-and-ui) |
| Signup and email verification | Generate an address, retrieve a delivered FlowMail OTP, enter it and assert successful login | [Email OTP](/guide/email-otp) |
| A control with repeated text | Element qualifiers, spatial anchors, indexes and explicit selectors | [Targeting](/guide/targeting) |
| Forms and dependent choices | Text input, native/custom selects, date setting, checkboxes, uploads and dialogs | [Forms and dates](/guide/forms-and-dates) |
| A record in a large table | Search, identify a row, act inside a cell, extract a value and reuse it elsewhere | [Tables and cells](/guide/table-testing) |
| An embedded page or popup | Readable iframe actions, frame-scoped assertions and tab switching | [Tabs and iframes](/guide/tabs-and-iframes) |
| A recording and its transcript | Feed a WAV microphone fixture, drive recording controls and check the application's transcript | [Audio-to-text](/guide/audio-to-text) |
| Two independently logged-in users | Named browser profiles with separate cookies, storage, tabs and permissions | [Independent users](/guide/native-browser-workflows#separate-users-in-one-test) |
| Repeatable login across runs | Save and restore cookies, localStorage and sessionStorage | [Saved sessions](/flow-language/getting-started/sessions) |
| Reliable, precise checks | Retrying conditions with individual target/condition results and expected/actual diagnostics | [Assertions and failures](/guide/assertions-and-diagnostics) |
| API contracts | Methods, headers, JSON bodies, GraphQL variables, extraction and chained response assertions | [API testing](/guide/api-testing) |
| Slow, failed or controlled services | Browser route fulfill/patch/continue/abort and armed request/response waits | [Network control](/guide/native-browser-workflows#mock-requests-and-wait-for-network-events) |
| A generated report or export | Arm a download, save it and check filename, size, content, JSON or hash | [Downloads](/guide/native-browser-workflows#downloads) |
| Time-dependent behavior | Page clocks, controlled timers, function spies and return/throw stubs | [Time and functions](/guide/native-browser-workflows#control-time-and-observe-functions) |
| Location, connectivity or browser settings | Runtime permissions, geolocation and offline recovery; profile-specific settings | [Browser environments](/guide/browser-environments) |
| A reusable UI component | Mount, interact, update and unmount vanilla, React or Vue components | [Component testing](/guide/component-testing) |
| Accessibility regressions | axe scans, ARIA trees and reviewed local baselines | [Accessibility](/guide/native-browser-workflows#accessibility-and-aria-baselines) |
| Rendering and game rules | Canvas input, state fixtures, screenshots, pixel comparisons and Three.js selection | [Browser games](/games/getting-started) |
| A failure in a previous attempt | Per-file screen history, attempts, network logs, Replay, traces and HAR | [Dashboard](/reporting/dashboard) · [Evidence](/reporting/artifacts) |
| Repeatable pipeline execution | Native CI, cancellation, retries, GitHub workflow generation, browser matrices, sharding and merging | [Native CI](/guide/native-ci-games) |
| A human-executed test | Canvas design, grouped steps, expected outcomes, statuses, defects, media and retained runs | [Manual testing](/manual-workspace/manual-testing) |

## Start with a real example

[Run the examples included in your npm installation](/guide/working-examples). They provide a local application and known passing/failing checks for API + UI, iframes, tables, variables and saved sessions. There is also a microphone fixture and a manual design. Service templates explain what your application must supply for real OTP delivery or speech recognition.

The guides distinguish a runnable example from an application contract you must adapt. A passing recording fixture demonstrates microphone capture and assertions; a real speech service must still recognize the words. A successful click establishes the action; your assertion establishes the business outcome.

## Extend a focused action

A [TypeScript plugin](/flow-language/getting-started/plugins) can use the current browser page, HTTP helpers, state and attachments. Keep suite orchestration, CI status, browser cleanup and evidence ownership in Flowstride. [Capabilities and boundaries](/reference/capabilities) records the supported limits.
