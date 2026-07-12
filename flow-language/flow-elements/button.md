# button

## Introduction

`button` is a **Flow Element** that tells Flowstride to search specifically for button-like controls on the page.

Rather than searching every visible element, `button` narrows the search to interactive controls that behave as buttons. This makes your Scenarios easier to read, reduces ambiguity, and improves locator accuracy.

Flowstride doesn't limit this element to HTML `<button>` tags. Instead, it intelligently searches common button implementations used across modern web frameworks.

---

## Why Use the button Element?

Many modern applications implement buttons in different ways.

A "Login" button might be rendered as:

- A native `<button>`
- A `<div>` with `role="button"`
- An `<input type="submit">`
- An `<input type="button">`

Without an element type, Flowstride searches across multiple heuristics.

By specifying `button`, you tell Flowstride exactly what kind of control you're trying to interact with, allowing it to build a much more precise locator.

---

## How Flowstride Finds Buttons

When you specify the `button` element, Flowstride automatically searches for common button implementations, including:

- HTML `<button>` elements
- Elements with `role="button"`
- `<input type="submit">`
- `<input type="button">`

This allows the same Scenario to work across applications built with different UI frameworks while remaining readable.

---

## Syntax

### Click a button

```flow
flow.click button "Login";
```

### Hover over a button

```flow
flow.hover button "Products";
```

### Verify a button is visible

```flow
flow.expect visible button "Continue";
```

---

## Examples

### Click a Login button

Use the `button` element when interacting with a standard button.

```flow
Feature: User Authentication

Scenario: User logs in

When "Click the Login button"
    flow.click button "Login";

Then "The dashboard loads"
    flow.expect visible "Dashboard";
```

---

### Use a Spatial Selector

Flow Elements work seamlessly with Flowstride's spatial selectors.

```flow
Feature: Theme Settings

Scenario: Enable Light Theme

When "Enable the light theme"
    flow.click button "Switch to light theme" near "Appearance";

Then "The theme changes"
    flow.expect visible "Light Mode";
```

---

### Remove Ambiguity

If multiple elements share the same text, specifying the element type makes your intent clearer.

Instead of:

```flow
flow.click "Continue";
```

use:

```flow
flow.click button "Continue";
```

---

## When to Use the button Element

Use `button` whenever you are interacting with a clickable button or button-like control.

Typical examples include:

- Login buttons
- Save buttons
- Submit buttons
- Continue buttons
- Navigation buttons
- Dialog actions
- Toolbar buttons

---

## Important Notes

::: info Button is a search hint

The `button` element is not limited to HTML `<button>` elements.

Flowstride automatically searches common button implementations, including accessibility roles and button input types.

:::

::: info Accessibility support

Flowstride automatically recognises controls implemented with `role="button"`.

This allows your Scenarios to work naturally with applications built using modern accessibility standards.

:::

::: info Spatial selectors are supported

The `button` element works with all supported spatial selectors.

For example:

```flow
flow.click button "Save" under "Profile";

flow.click button "Continue" near "Sign Up";

flow.click button "Delete" rightOf "User Name";
```

:::

::: info Reduces ambiguity

Specifying `button` narrows the search space.

When multiple elements contain the same text, using an element type helps Flowstride identify the intended control more accurately.

:::

---

## Common Mistakes

::: warning Don't use button for links

If the control is actually a hyperlink, prefer the `link` element instead.

Correct:

```flow
flow.click link "Privacy Policy";
```

Instead of:

```flow
flow.click button "Privacy Policy";
```

:::

::: warning Don't over-specify when unnecessary

Flowstride can often locate controls without an element type.

However, when multiple elements share the same text, specifying `button` improves readability and reduces ambiguity.

:::

::: warning Combine with spatial selectors when needed

If multiple buttons share the same label, use a spatial selector or index to identify the correct one.

For example:

```flow
flow.click button "Continue" near "Shipping";

flow.click button "Continue [1]";
```

:::

---
