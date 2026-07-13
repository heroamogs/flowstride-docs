# span

## Introduction

`span` is a **Flow Element** that tells Flowstride to search specifically for `<span>` elements.

Unlike semantic controls such as `button`, `link`, or `input`, the `span` element is intended for locating inline content rendered using HTML `<span>` elements.

---

## Why Use the span Element?

Modern web applications frequently use `<span>` elements to display inline text, labels, badges, counters, tags, and status indicators.

When you know the target is implemented as a `<span>`, specifying the `span` element narrows Flowstride's search and makes your Scenario easier to understand.

---

## How Flowstride Finds span Elements

When you specify the `span` element, Flowstride uses its heuristic locator engine to search specifically for HTML `<span>` elements.

Like every Flow Element, `span` participates in:

- Heuristic element matching
- Ambiguity resolution
- Spatial selector resolution

This allows the same Scenario to work across different UI implementations while remaining readable.

---

## Syntax

### Click a span

```flow
flow.click span "Premium";
```

---

## Examples

### Click an inline badge

```flow
...

When "Click the Premium badge"
    flow.click span "Premium";

Then "The premium page opens"
    flow.expect visible "Premium Features";
```

---

### Hover over a status label

```flow
...

When "Hover over the Active status"
    flow.hover span "Active";

Then "The status tooltip is displayed"
    flow.expect visible "Account is active";
```

---

### Use a Spatial Selector

The `span` element works with Flowstride's spatial selectors.

```flow
...

When "Select the status label"
    flow.click span "Pending" near "Order Status";

Then "The order details are displayed"
    flow.expect visible "Order Information";
```

---

## Important Notes

::: info span is a search hint

The `span` element narrows Flowstride's search to HTML `<span>` elements handled by the locator engine.

:::

::: info Reduces ambiguity

Specifying `span` narrows the search space.

When multiple elements contain the same text, using the `span` element helps Flowstride identify the intended inline element more accurately.

:::

---

## Common Mistakes

::: warning Prefer semantic elements when available

If the target is actually a button, link, or input control, prefer using the corresponding Flow Element.

For example:

```flow
flow.click button "Continue";
```

instead of:

```flow
flow.click span "Continue";
```

Semantic elements make your Scenarios clearer and provide more precise locators.

:::

::: warning Combine with spatial selectors when necessary

If multiple `<span>` elements contain the same text, combine `span` with a spatial selector or an index.

For example:

```flow
flow.click span "Pending" near "Order Status";

flow.click span "Pending [1]";
```

:::

---
