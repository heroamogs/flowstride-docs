# flow.uncheck

## Introduction

`flow.uncheck` is a **Flow Command** that ensures a checkbox, radio button, or toggle control is in its unchecked state.

Unlike traditional automation frameworks that only support native HTML checkboxes, `flow.uncheck` automatically adapts to both standard HTML controls and modern framework-driven components built with React, Vue, Angular, and similar UI libraries.

Its state-aware implementation guarantees that the target control is unchecked without accidentally enabling controls that are already turned off.

---

## The Problem It Solves

Just like `flow.check`, unchecking controls in modern web applications is surprisingly difficult.

Traditional automation engines expect the target element to literally be an HTML:

- `<input type="checkbox">`
- `<input type="radio">`

If the application instead uses a custom component built from `<div>`, `<span>`, or another element, the automation fails with errors such as **"Not a checkbox or radio button."**

Many automation engineers attempt to work around this limitation by using `flow.click` instead.

Unfortunately, this introduces the **Idempotency Problem**.

If the control is already turned off, clicking it will accidentally turn it back on, causing the test to fail.

`flow.uncheck` removes this uncertainty by guaranteeing the final state is always **unchecked**.

---

## How flow.uncheck Works

`flow.uncheck` is the exact inverse of `flow.check`.

Rather than blindly clicking a control, Flowstride intelligently determines whether any interaction is actually required.

### Native Attempt

Flowstride first attempts to use Playwright's native checkbox handling.

If the target is a standard HTML checkbox or radio button, the control is unchecked using the browser's native implementation.

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

These markers allow Flowstride to determine whether the control is currently enabled.

---

### Smart Toggle (Safe Disconnect)

If the control is currently checked, Flowstride performs a forced click to turn it off.

If the control is already unchecked, Flowstride does not perform another click. Instead, it fails the Scenario, reporting that the target control is already unchecked.

This behavior is intentional. Rather than silently continuing, Flowstride treats the unexpected state as a test failure, helping detect incorrect assumptions about the application's current state.

## Syntax

```flow
flow.uncheck "<locator>";
```

```flow
flow.uncheck < element > "<locator>";
```

---

## Parameters

| Parameter | Required | Description                                               |
| --------- | :------: | --------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element.            |
| Locator   |    ✅    | Identifies the checkbox, radio button, or toggle control. |

---

## Examples

### Uncheck a standard checkbox

```flow
Feature: Email Preferences

Scenario: Unsubscribe from marketing emails

Given "Open the email settings page"
  flow.open "/settings/emails";

When "Unsubscribe from marketing emails"
  flow.uncheck "Receive weekly marketing updates";

When "Save the preferences"
  flow.click button "Save Preferences";

Then "The preferences are updated"
  flow.expect visible "Preferences updated";
```

---

### Disable a custom toggle switch

```flow
Feature: Security Settings

Scenario: Disable two-factor authentication

Given "Open the security dashboard"
  flow.open "/dashboard/security";

When "Disable two-factor authentication"
  flow.uncheck div "Enable Two-Factor Authentication";

Then "The confirmation dialog appears"
  flow.expect visible "Are you sure you want to disable two-factor authentication?";
```

---

### Uncheck using a Spatial Locator

Spatial Locators can also be used when disabling options, making it easy to target the correct checkbox or toggle without relying on fragile selectors.

```flow
Feature: Appearance Settings

Scenario: Disable dark theme

Given "User opens the appearance settings"
  flow.open "/settings/appearance";

When "User unchecks the toggle switch"
  flow.uncheck "Enable dark theme" near "Appearance";

Then "The dark theme is disabled"
  flow.expect visible "Dark theme disabled";
```

## When to Use flow.uncheck

Use `flow.uncheck` whenever a control must be in its **unchecked** or **disabled** state.

Typical examples include:

- Checkboxes
- Radio buttons
- Toggle switches
- Feature flags
- Preference settings
- Consent options

---

## Important Notes

::: info State-aware execution

For custom controls, Flowstride evaluates the current state before interacting with the element.

If the control is already unchecked, Flowstride does not perform another click. Instead, the command fails, indicating that the requested state transition could not be performed because the control was already unchecked.

This behavior helps detect unexpected application states rather than silently continuing execution.

:::

::: info Framework agnostic

`flow.uncheck` automatically adapts between native HTML controls and custom framework components without requiring changes to your Flow script.

:::

---

## Common Mistakes

::: warning Do not click toggles manually

Avoid manually clicking selectable controls when your intention is simply to ensure they are turned off.

Instead of:

```flow
flow.click "Receive weekly marketing updates";
```

use:

```flow
flow.uncheck "Receive weekly marketing updates";
```

This guarantees the control finishes in the correct state.

:::

::: warning Use flow.uncheck only when the desired final state is unchecked

If your intention is to enable a control, use `flow.check` instead.

:::

---
