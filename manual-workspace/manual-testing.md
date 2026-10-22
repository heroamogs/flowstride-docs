# Manual testing with Flowstride

Use the Manual Workspace to turn a test idea into a repeatable case: map the journey, write the steps and expected results, execute it yourself, and preserve the run with its defects and evidence.

You do not need to write `.flow` automation to use the canvas. A person still performs the actions in the application under test and decides whether the observed result matches the expectation.

## The working lifecycle

| Stage | What you produce | Next guide |
| --- | --- | --- |
| Plan | Scope, risks, data, environment and coverage | [Plan a test](/manual-workspace/test-planning) |
| Design | Named steps, groups, connections and expected results | [First manual flow](/manual-workspace/first-flow) |
| Review | A case another tester can execute independently | [Write better steps](/manual-workspace/step-details) |
| Execute | Passed, failed, blocked and skipped outcomes | [Execute a flow](/manual-workspace/execution) |
| Investigate | A reproducible defect with useful evidence | [Defects and evidence](/manual-workspace/defects-and-evidence) |
| Retain | A submitted run separate from its design | [Files and history](/manual-workspace/files-and-history) |
| Share | A reviewable result with clear access boundaries | [Team workflow](/manual-workspace/collaboration) |
| Automate | A stable, explicit `.flow` scenario | [From manual to automation](/manual-workspace/to-automation) |

## Open the workspace

From an installed Flowstride project:

```sh
npx flowstride open
```

Follow the localhost URL printed in the terminal. Leave the process running while you use the workspace. The public OS CLI can launch it without a login. In Cloud mode, the CLI verifies the account session before opening the local workspace.

The manual canvas and the automated runner are different workspaces. `run` executes `.flow` files; `open` launches the manual design/execution environment. A canvas arrow does not send a browser click.

## What stays local?

Design templates, saved runs and media have separate folders under `manual_flows`. Local saving and Cloud synchronization are different operations. Credentials available to the workspace can trigger remote defect/run uploads; do not assume that a localhost page means every action stays offline.

[Understand editions and limits](/manual-workspace/capabilities) before adopting Cloud evidence, audit or collaboration processes. The guides distinguish implemented controls from suggested team practices.
