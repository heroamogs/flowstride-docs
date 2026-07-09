# flow.try

## Introduction

`flow.try` is a **Flow Command Modifier** that marks the next Flow Command as optional.

Unlike traditional programming languages, `flow.try` does not introduce a `try/catch` block or create an alternate execution path. Instead, it instructs Flowstride to execute the following command normally, but continue the Scenario if that command fails.

This makes `flow.try` ideal for handling optional UI elements that may or may not appear during a test run.

---

## The Problem It Solves

Web applications are rarely perfectly static. QA engineers constantly battle unpredictable UI elements such as intermittent promotional popups, cookie consent banners, feature announcements, survey dialogs, or A/B testing variations that only appear for certain users.

In traditional automation, attempting to interact with one of these optional elements causes the test to wait until the timeout expires before failing the entire Scenario.

`flow.try` removes this fragility by allowing optional interactions to fail gracefully without terminating the Scenario.

---

## How flow.try Works

`flow.try` is **not a standalone action**. It is a **Command Modifier** that changes how the following Flow Command behaves during execution.

### 1. Parser Interception

When the parser encounters:

```flow
flow.try click button "Close";
```

it immediately consumes the next Flow Command.

Rather than creating a separate `try` step, the parser marks the following command as **optional** by injecting an internal `optional` flag into its payload.

---

### 2. Normal Execution

During execution, Flowstride performs the modified command exactly as it normally would.

The framework still:

- Resolves the target using the Smart Locator engine.
- Applies any Spatial Locators.
- Waits using the configured timeout.
- Executes the requested interaction.

No shortcuts or reduced validation are applied.

---

### 3. Graceful Handling

If the command succeeds, execution continues normally.

If the command fails—for example because the target element never appeared—Flowstride detects that the command was marked as optional.

Instead of terminating the Scenario, the framework:

- Marks the step as **Skipped**
- Continues executing the remaining steps

This allows optional UI interactions to fail safely without interrupting the overall Scenario.

---

## Syntax

```flow
flow.try <flow-command>;
```

For example:

```flow
flow.try click button "Close";
```

```flow
flow.try close "Cookie Banner";
```

```flow
flow.try passcode input " " under "Code from SMS" "$env.TEST_OTP";
```

---

## Parameters

| Parameter    | Required | Description                                                      |
| ------------ | :------: | ---------------------------------------------------------------- |
| Flow Command |    ✅    | The single Flow Command that should execute as an optional step. |

---

## Examples

### Handle an optional OTP challenge

Some users may be prompted for an SMS verification code while others are not.

```flow
Feature: Authentication

Scenario: Login with optional OTP

Given "Open the login page"
  flow.open "/login";

When "Enter the email address"
  flow.type input "" "{{env.TEST_EMAIL}}";

When "Continue to the next step"
  flow.click button "Continue";

When "Handle OTP if it appears"
  flow.try type input "Enter OTP" under "Code from SMS" "{{env.TEST_OTP}}";

Then "Enter the account passcode"
  flow.passcode input "" under "Enter your passcode" "{{env.TEST_PASSCODE}}";
```

---

### Dismiss an optional cookie banner

Cookie banners often appear only on first visits or after clearing browser data.

```flow
Feature: Homepage

Scenario: Continue past the cookie banner

Given "Open the homepage"
  flow.open "/";

When "Dismiss the cookie banner if it appears"
  flow.try close "We use cookies";

Then "Verify the homepage loads"
  flow.expect visible "Featured Products";
```

---

### Close an optional announcement

Feature announcements and onboarding dialogs often appear only once.

```flow
Feature: Dashboard

Scenario: Open the dashboard

Given "Navigate to the dashboard"
  flow.open "/dashboard";

When "Dismiss the announcement if it appears"
  flow.try close "What's New";

Then "Verify the dashboard is displayed"
  flow.expect visible "Dashboard";
```

---

## When to Use flow.try

Use `flow.try` whenever a single interaction should be treated as optional rather than mandatory.

Typical examples include:

- Promotional popups
- Cookie consent banners
- Survey dialogs
- Feature announcements
- Optional onboarding tours
- SMS or email OTP challenges
- Seasonal marketing overlays

---

## Important Notes

::: info Single-command modifier

`flow.try` only applies to the **single Flow Command immediately following it**.

For example:

```flow
flow.try click button "Close";

flow.click button "Continue";
```

Only the first command is optional.

The second command executes normally.

:::

::: info Normal command execution

`flow.try` does not change how the wrapped command behaves.

The command still performs its normal locator resolution, waits, and interaction logic.

The only difference is how Flowstride responds if the command does not appear.

:::

---

## Common Mistakes

::: warning Don't expect try/catch behaviour

`flow.try` is **not** a traditional `try/catch` implementation.

It does not introduce a recovery block or alternate execution path.

Its sole purpose is to allow one command to fail gracefully without terminating the Scenario.

:::

::: warning One flow.try protects only one command

The following protects only the first command:

```flow
flow.try close "Cookie Banner";

flow.click button "Continue";
```

If multiple interactions are optional, prefix each command individually.

```flow
flow.try close "Cookie Banner";

flow.try close "What's New";

flow.click button "Continue";
```

:::

::: warning Don't hide genuine failures

Reserve `flow.try` for interactions that are genuinely optional which is what it's ONLY meant for.

Avoid wrapping critical business actions with `flow.try`.

:::

---
