# link

## Introduction

`link` is a **Flow Element** that tells Flowstride to search specifically for hyperlinks and other navigation controls that behave as links.

Rather than searching every visible element on the page, `link` narrows the search to controls intended for navigation. This makes your Scenarios easier to read, reduces ambiguity, and improves locator accuracy.

Flowstride doesn't limit this element to HTML `<a>` tags. Instead, it intelligently searches common link implementations used across modern web frameworks.

---

## Why Use the link Element?

Modern applications don't always implement navigation using traditional anchor tags.

A "View Profile" link might be rendered as:

- A native `<a>` element
- An element with `role="link"`
- A framework-generated navigation component

Without an element type, Flowstride searches across multiple heuristics.

By specifying `link`, you tell Flowstride exactly what kind of element you're trying to interact with, allowing it to build a more precise locator.

---

## How Flowstride Finds Links

When you specify the `link` element, Flowstride automatically searches for common hyperlink implementations, including:

- HTML `<a>` elements
- Elements with `role="link"`

This allows the same Scenario to work across applications built with different UI frameworks while remaining readable.

---

## Syntax

### Click a link

```flow
flow.click link "Forgot Password";
```

### Hover over a link

```flow
flow.hover link "Products";
```

### Verify a link is visible

```flow
flow.expect visible link "Privacy Policy";
```

---

## Examples

### Click a navigation link

Use the `link` element when navigating between pages.

```flow
Feature: User Navigation

Scenario: Open the forgot password page

When "Click the Forgot Password link"
    flow.click link "Forgot Password";

Then "The reset password page opens"
    flow.expect visible "Reset Password";
```

---

### Use a Spatial Selector

The `link` element works seamlessly with Flowstride's spatial selectors.

```flow
Feature: Footer Navigation

Scenario: Open the Privacy Policy

When "Open the privacy policy"
    flow.click link "Privacy Policy" under "Legal";

Then "The privacy policy page loads"
    flow.expect visible "Privacy Policy";
```

---

### Remove Ambiguity

If multiple elements contain the same text, specifying the `link` element makes your intent much clearer.

Instead of:

```flow
flow.click "Learn More";
```

use:

```flow
flow.click link "Learn More";
```

---

## When to Use the link Element

Use `link` whenever you're interacting with controls that navigate users to another page, section, or route.

Typical examples include:

- Navigation menus
- Footer links
- Breadcrumbs
- Help links
- Documentation links
- Account links
- "Forgot Password" links

---

## Important Notes

::: info Accessibility support

Flowstride automatically recognises controls implemented with `role="link"`.

This allows your Scenarios to work naturally with applications that follow modern accessibility standards.

:::

::: info Spatial selectors are supported

The `link` element works with all supported spatial selectors.

For example:

```flow
flow.click link "Terms of Service" under "Legal";

flow.click link "Profile" near "Welcome, Samuel";

flow.click link "Settings" leftOf "Dashboard";
```

:::

::: info Reduces ambiguity

Specifying `link` narrows the search space.

When multiple elements contain the same text, using an element type helps Flowstride identify the intended navigation control more accurately.

:::

---

## Common Mistakes

::: warning Don't use link for buttons

If the control performs an action rather than navigation, use the `button` element instead.

Correct:

```flow
flow.click button "Save";
```

Instead of:

```flow
flow.click link "Save";
```

:::

::: warning Don't over-specify when unnecessary

Flowstride can often locate hyperlinks without specifying `link`.

However, when multiple elements share the same text, using `link` makes your Scenario clearer and reduces ambiguity.

:::

::: warning Combine with spatial selectors when needed

If multiple links share the same label, combine the `link` element with a spatial selector or index.

For example:

```flow
flow.click link "Read More" under "Latest News";

flow.click link "View Details [1]";
```

:::

---
