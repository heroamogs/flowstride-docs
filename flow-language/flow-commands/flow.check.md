# flow.check

## Introduction

`flow.check` is a **Flow Command** that ensures a checkbox, radio button, or toggle control is in its checked state.

Unlike traditional automation frameworks that only support native HTML checkboxes, `flow.check` automatically adapts to both standard HTML controls and modern framework-driven components built with React, Vue, Angular, and similar UI libraries.

Its state-aware implementation guarantees that the target control is checked without accidentally toggling controls that are already selected.

---

## The Problem It Solves

Interacting with checkboxes and radio buttons in modern web applications is surprisingly difficult.

Traditional automation engines are extremely strict. They expect the target element to literally be an HTML:

- `<input type="checkbox">`
- `<input type="radio">`

If the application instead uses a custom component built from `<div>`, `<span>`, or another element, the automation fails with errors such as **"Not a checkbox or radio button."**

Modern frontend frameworks frequently replace native controls with visually styled switches, cards, and toggle components that no longer behave like traditional form elements.

`flow.check` removes this limitation by automatically adapting to the implementation used by the application.

---

## How flow.check Works

`flow.check` is designed to be framework-agnostic.

Rather than assuming every selectable control is a native checkbox, Flowstride intelligently adapts its strategy based on the element it discovers during execution.

### Native Attempt

Flowstride first attempts to use Playwright's native checkbox handling.

If the target is a standard HTML checkbox or radio button, the control is checked using the browser's native implementation.

---

### Custom Component Intercept

If the native operation reports that the target is **not** a checkbox or radio button, Flowstride safely intercepts the failure instead of terminating the Scenario.

This allows the framework to continue working with custom UI components that visually behave like checkboxes but are implemented using ordinary HTML elements.

---

### State Evaluation

Before interacting with a custom control, Flowstride evaluates its current state.

The framework checks common accessibility and UI state indicators, including:

- `aria-checked="true"`
- `checked`
- `active`
- `selected`

These markers allow Flowstride to determine whether the control is already selected.

---

### Smart Toggle (Safe Connection)

If the control is not currently checked, Flowstride performs a forced click to turn it on.

If the control is already checked, Flowstride does not perform another click. Instead, it fails the Scenario, reporting that the target control is already checked.

This behavior is intentional. Rather than silently continuing, Flowstride treats the unexpected state as a test failure, helping detect incorrect assumptions about the application's current state.

## Syntax

```flow
flow.check "<locator>";
```

```flow
flow.check < element > "<locator>";
```

---

## Parameters

| Parameter | Required | Description                                               |
| --------- | :------: | --------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element.            |
| Locator   |    ✅    | Identifies the checkbox, radio button, or toggle control. |

---

## Examples

### Check a standard checkbox

```flow
Feature: User Registration

Scenario: Agree to the terms

Given "Open the registration page"
  flow.open "/signup";

When "Enter an email address"
  flow.type input "Email" "$randomEmail";

When "Accept the terms and conditions"
  flow.check "I agree to the Terms of Service";

When "Create the account"
  flow.click button "Create Account";

Then "The registration succeeds"
  flow.expect visible "Account created successfully";
```

---

### Enable a custom toggle switch

```flow
Feature: Notification Settings

Scenario: Enable email notifications

Given "Open notification settings"
  flow.open "/settings/notifications";

When "Enable marketing emails"
  flow.check div "Marketing Emails";

When "Save the changes"
  flow.click button "Save Changes";

Then "The preferences are updated"
  flow.expect visible "Preferences saved";
```

---

### Check using a Spatial Locator

When multiple checkboxes or toggle switches appear on a page, Spatial Locators help Flowstride identify the correct control by describing where it is located.

```flow
Feature: Appearance Settings

Scenario: Enable light theme

Given "User opens the appearance settings"
  flow.open "/settings/appearance";

When "User checks the toggle switch"
  flow.check "Switch to light theme" near "Appearance";

Then "The light theme is enabled"
  flow.expect visible "Light theme enabled";
```

## When to Use flow.check

Use `flow.check` whenever a control must be in its **checked** or **enabled** state.

Typical examples include:

- Checkboxes
- Radio buttons
- Toggle switches
- Preference settings
- Feature flags
- Consent checkboxes

---

## Important Notes

::: info State-aware execution

For custom controls, Flowstride evaluates the current state before interacting with the element.

If the control is already checked, Flowstride does not perform another click. Instead, the command fails, indicating that the requested state transition could not be performed because the control was already checked.

This behavior helps detect unexpected application states rather than silently continuing execution.

:::

::: info Framework agnostic

`flow.check` automatically adapts between native HTML controls and custom framework components without requiring changes to your Flow script.

:::

---

## Common Mistakes

::: warning Do not click checkboxes manually

Avoid manually clicking selectable controls when your intention is simply to ensure they are checked.

Instead of:

```flow
flow.click "I agree to the Terms of Service";
```

use:

```flow
flow.check "I agree to the Terms of Service";
```

This guarantees the control finishes in the correct state.

:::

::: warning Use flow.check only when the desired final state is checked

If your intention is to clear or disable a control, use `flow.uncheck` instead.

:::

---
