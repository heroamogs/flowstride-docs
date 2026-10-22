# Core concepts

## A flow file describes behavior

A `.flow` file contains a `Feature`, one or more `Scenario` blocks, and commands grouped under `Given`, `When`, and `Then`.

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

`Given` establishes context. `When` performs the journey. `Then` contains final checks. All three blocks are required. A scenario cannot introduce another block after `Then`; put all final checks under the same `Then`.

`And` is an intermediate assertion block, not a synonym for another action block. Use another `When` for more actions. Multiple commands can share one description.

## The project is the execution boundary

Run commands from your project folder. Configuration, fixtures, plugins, flow targets, and output paths must stay inside it, including symlink targets. Keep reusable assets in `fixtures/` rather than reaching outside the project.

## Variables have different jobs

| Form | Purpose |
| --- | --- |
| `{{env.BASE_URL}}` | Read an environment value |
| `$randomEmail` | Generate a value and remember it |
| `@randomEmail` | Reuse the generated value |
| `@userId` | Reuse an extracted scenario value |
| `@global[userId]` | Reuse an explicitly global extracted value in the same process |
| `let game = "flowstride:game"` | Register a command alias, not a general variable assignment |

See [variables](/flow-language/getting-started/variables) and [sessions](/flow-language/getting-started/sessions). Process memory is not a shared store between parallel Cloud workers.

## A manual design and a manual run are different records

A design records what should be tested. A run records what a tester actually did and the outcome. Saving a design does not establish a passing result. [Manual testing](/manual-workspace/manual-testing) explains this lifecycle in detail.
