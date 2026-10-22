# Advanced workflows

Use these guides when a basic browser/API scenario is working:

| Task | Guide |
| --- | --- |
| Reuse browser authentication | [Sessions](/flow-language/getting-started/sessions) |
| Extend one action in TypeScript | [Plugins](/flow-language/getting-started/plugins) |
| Run in GitHub Actions | [Native CI](/guide/native-ci-games) |
| Drive a canvas or Three.js game | [Games](/games/getting-started) |
| Debug a captured request | [Dashboard and Replay](/reporting/dashboard) |
| Retrieve an OTP with Cloud | [FlowMail](/flow-language/flow-commands/flow.mail.getotp) |
| Configure media input | [Audio injection](/flow-language/flow-commands/flow.injectAudio) |

## Application concerns remain explicit

Keep fixture preparation, teardown and business-specific assertions in your project. Native orchestration removes the need for a custom CI runner; it cannot invent your application's data model or decide what makes a game action correct.

## Avoid relying on implementation details

Use supported aliases and SDK methods instead of importing workers, adapters, orchestrators or internal globals into a custom `.cjs` harness. A plugin can access the current Playwright page where a native action is not yet provided. Check [capability boundaries](/reference/capabilities) before assuming parity with Playwright Test.
