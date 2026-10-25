# Core concepts

## A flow file describes behavior

A `.flow` file has exactly one `Feature` declaration at the top, followed by one or more `Scenario` blocks. Each scenario groups commands under `Given`, `When`, optional intermediate `And` blocks, and a final `Then`.

```flow
Feature: Account access

Scenario: A member signs in

Given "The login page is open"
  flow.open "/login";

When "The member enters valid credentials"
  flow.type "Email" "{{env.TEST_EMAIL}}";
  flow.type "Password" "{{env.TEST_PASSWORD}}";
  flow.click button "Login";

Then "The account is available"
  flow.expect visible "Logout";
```

`Given` establishes context. `When` performs the journey. `Then` contains the scenario's final commands and checks. All three are required, and `Given` comes first.

**`Then` is terminal.** After its commands, the only new declaration allowed is another `Scenario`. An `And`, another `Then`, an action block, an alias declaration, or another `Feature` cannot follow it. Put multiple final assertions or a final action such as logout inside the same `Then` block.

`And` is an intermediate assertion block before `Then`. It accepts `flow.expect`, supported native assertions such as `flow.assert.that`, and custom assertion plugins. Use another `When` for further actions before the final block. Multiple commands can share one description. See [assertions and diagnostics](/guide/assertions-and-diagnostics).

| Rule | How to apply it |
| --- | --- |
| One Feature per file | Declare it before aliases or scenarios; comments and blank lines may come first |
| Required scenario structure | Use one initial `Given`, at least one `When`, and one final `Then` |
| Additional actions | Add `When` blocks before `Then` |
| Intermediate checks | Add assertion-only `And` blocks before `Then` |
| Several final checks | Put their commands together inside the single `Then` |
| Another journey | Begin a new `Scenario` after the final block |

## The project is the execution boundary

Run commands from your project folder. Configuration, fixtures, plugins, flow targets, and output paths must stay inside it, including symlink targets. Keep reusable assets in `fixtures/` rather than reaching outside the project.

## Variables have different jobs

| Form | Purpose |
| --- | --- |
| `{{env.BASE_URL}}` | Read an environment value |
| `$randomEmail` | Generate a value and remember it |
| `@randomEmail` | Reuse the generated value |
| `@userId` | Reuse an extracted value in the same flow file |
| `@global[userId]` | Reuse an explicitly global extracted value in the same process |
| `let game = "flowstride:game"` | Register a command alias, not a general variable assignment |

See [variables](/flow-language/getting-started/variables) and [sessions](/flow-language/getting-started/sessions). Process memory is not a shared store between parallel Cloud workers.

## API and UI share the journey

API setup, extraction, browser actions and assertions can live in one scenario. Share generated credentials explicitly and assert each API result before continuing. [API and UI in one flow](/guide/api-and-ui) shows signup, administrator approval, browser login and Cloud OTP verification.

## A manual design and a manual run are different records

A design records what should be tested. A run records what a tester actually did and the outcome. Saving a design does not establish a passing result. [Manual testing](/manual-workspace/manual-testing) explains this lifecycle in detail.

## Objects, punctuation and debug controls

Native object commands use JSON: quote keys and strings, use lowercase booleans and omit trailing commas. The semicolon terminates the completed command, after `}`; do not insert one after the opening brace. A JSON property is an option or input to that command, not an independent executable step.

`only.Scenario:` focuses one scenario in its file. A `stop.` block halts after its first successful command. Both are debugging controls; remove them before a complete acceptance run. [Execution and failures](/guide/execution-model) explains discovery, setup files and incomplete results.
