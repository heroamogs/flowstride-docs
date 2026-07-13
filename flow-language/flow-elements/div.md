# div

## Introduction

`div` is a **Flow Element** that tells Flowstride to search specifically for `<div>` elements.

Unlike specialized elements such as `button`, `link`, or `input`, the `div` element is intended for interacting with generic container elements that have no more descriptive semantic role.

---

## Why Use the div Element?

Many modern web applications build their interfaces using `<div>` elements.

Frameworks such as React, Vue, Angular, and Svelte frequently render interactive components as `<div>` elements instead of traditional HTML controls.

When you know the target is implemented as a `<div>`, specifying the `div` element narrows Flowstride's search and makes your Scenario easier to understand.

---

## How Flowstride Finds div Elements

When you specify the `div` element, Flowstride uses its heuristic locator engine to search specifically for HTML `<div>` elements.

Like every Flow Element, `div` participates in:

- Heuristic element matching
- Ambiguity resolution
- Spatial selector resolution

This allows the same Scenario to work across different UI implementations while remaining readable.

---

## Syntax

### Click a div

```flow
flow.click div "Continue";
```

---

## Examples

### Click a card

Many applications implement cards and tiles using `<div>` elements.

```flow
...

When "Click the Savings Account card"
    flow.click div "Savings Account";

Then "The account details are displayed"
    flow.expect visible "Account Overview";
```

---

### Hover over a menu

```flow
...

When "Hover over the account menu"
    flow.hover div "Account";

Then "The dropdown menu is displayed"
    flow.expect visible "Profile";
```

---

### Use a Spatial Selector

The `div` element works with Flowstride's spatial selectors.

```flow
...

When "Click the account panel"
    flow.click div "Account Details" under "Accounts";

Then "The details page opens"
    flow.expect visible "Transaction History";
```

---

## Important Notes

::: info div is a search hint

The `div` element narrows Flowstride's search to HTML `<div>` elements handled by the locator engine.

:::

::: info Reduces ambiguity

Specifying `div` narrows the search space.

When multiple elements contain the same text, using the `div` element helps Flowstride identify the intended container more accurately.

:::

---

## Common Mistakes

::: warning Prefer semantic elements when available

If the target is actually a button, link, or input control, prefer using the corresponding Flow Element.

For example:

```flow
flow.click button "Save";
```

instead of:

```flow
flow.click div "Save";
```

Semantic elements make your Scenarios clearer and provide more precise locators.

:::

::: warning Combine with spatial selectors when necessary

If multiple `<div>` elements contain the same text, combine `div` with a spatial selector or an index.

For example:

```flow
flow.click div "Account" under "Banking";

flow.click div "Account [1]";
```

:::

---
