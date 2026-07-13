# a

## Introduction

`a` is a **Flow Element** that tells Flowstride to search specifically for HTML anchor (`<a>`) elements.

It provides an explicit way to target anchor tags while taking advantage of Flowstride's heuristic locator engine.

---

## Why Use the a Element?

Most navigation on the web is implemented using HTML anchor elements.

Using the `a` element makes your intent explicit when you know the control you want to interact with is an anchor tag.

For example:

```flow
flow.click a "Forgot Password";
```

This clearly communicates that the target is expected to be an anchor element.

---

## How Flowstride Finds Anchor Elements

When you specify the `a` element, Flowstride searches for HTML anchor (`<a>`) elements using its heuristic locator engine.

Like every Flow Element, it also participates in Flowstride's ambiguity resolution and spatial locator system.

---

## Syntax

### Click an anchor

```flow
flow.click a "Forgot Password";
```

### Hover over an anchor

```flow
flow.hover a "Documentation";
```

### Verify an anchor is visible

```flow
flow.expect visible a "Home";
```

---

## Examples

### Open the Forgot Password page

```flow
Feature: User Authentication

Scenario: Open the password recovery page

When "Click the Forgot Password anchor"
    flow.click a "Forgot Password";

Then "The recovery page loads"
    flow.expect visible "Reset Password";
```

---

### Combine with a Spatial Selector

```flow
Feature: Footer Navigation

Scenario: Open the privacy policy

When "Click the Privacy Policy anchor"
    flow.click a "Privacy Policy" under "Legal";

Then "The Privacy Policy page loads"
    flow.expect visible "Privacy Policy";
```

---

## When to Use the a Element

Use `a` when you specifically want to target an HTML anchor element.

Typical examples include:

- Navigation links
- Footer links
- Breadcrumbs
- Documentation links
- Help links

---

## Important Notes

::: info HTML anchor targeting

The `a` element represents HTML anchor (`<a>`) elements within Flowstride's locator engine.

:::

::: info Spatial selectors are supported

The `a` element works with Flowstride's spatial selectors.

For example:

```flow
flow.click a "Privacy Policy" under "Legal";

flow.click a "Home" near "Logo";
```

:::

::: info Reduces ambiguity

Specifying `a` narrows the search and can help distinguish anchor elements from other controls with the same visible text.

:::

---

## Common Mistakes

::: warning Use the appropriate element

If the control is implemented as a button rather than an anchor, use the `button` element instead.

:::

::: warning Use spatial selectors when necessary

If multiple anchors share the same text, combine `a` with a spatial selector or an index.

For example:

```flow
flow.click a "Read More" under "Latest News";

flow.click a "View Details [1]";
```

:::

---
