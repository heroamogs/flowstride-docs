# Advanced workflows

Use these guides when a basic browser/API scenario is working:

| Task | Guide |
| --- | --- |
| Reuse browser authentication | [Sessions](/flow-language/getting-started/sessions) |
| Combine API preparation and a browser journey | [API and UI in one flow](/guide/api-and-ui) |
| Keep customer/admin logged in independently | [Browser profiles](/guide/native-browser-workflows#separate-users-in-one-test) |
| Wait for results or retry a failed scenario | [Waiting and retries](/guide/waiting-and-retries) |
| Mock requests, wait for events or assert downloads | [Native command reference](/reference/native-browser-commands) |
| Capture traces/HAR, check accessibility or mount components | [Native browser workflows](/guide/native-browser-workflows) |
| Extend one action in TypeScript | [Plugins](/flow-language/getting-started/plugins) |
| Run in GitHub Actions | [Native CI](/guide/native-ci-games) |
| Drive a canvas or Three.js game | [Games](/games/getting-started) |
| Debug a captured request | [Dashboard and Replay](/reporting/dashboard) |
| Retrieve an OTP with Cloud | [FlowMail](/flow-language/flow-commands/flow.mail.getotp) |
| Search tables and act on specific cells or rows | [Table and cell testing](/guide/table-testing) |
| Feed microphone audio and verify its transcript | [Audio-to-text testing](/guide/audio-to-text) |

## Application concerns remain explicit

Keep fixture preparation, teardown and business-specific assertions in your project. Native orchestration removes the need for a custom CI runner; it cannot invent your application's data model or decide what makes a game action correct.

## Avoid relying on implementation details

Use supported aliases and SDK methods instead of importing workers, adapters, orchestrators or internal globals into a custom `.cjs` harness. A plugin can access the current Playwright page where a native action is not yet provided. Check [capability boundaries](/reference/capabilities) before assuming parity with Playwright Test.

## Workflow guides

[Targeting](/guide/targeting) · [Forms and dates](/guide/forms-and-dates) · [Tabs and iframes](/guide/tabs-and-iframes) · [Email OTP](/guide/email-otp) · [Assertions and diagnostics](/guide/assertions-and-diagnostics) · [Included runnable examples](/guide/working-examples)
