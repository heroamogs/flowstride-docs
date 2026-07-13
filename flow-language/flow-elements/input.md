# input

## Introduction

`input` is a **Flow Element** that tells Flowstride to search specifically for input controls on the page.

Rather than searching every visible element, `input` narrows the search to input elements handled by Flowstride's locator engine. This makes your Scenarios easier to read, reduces ambiguity, and improves locator accuracy.

---

## Why Use the input Element?

Many pages contain a mixture of labels, buttons, links, and input controls.

By specifying `input`, you tell Flowstride that you're looking for a field intended to receive user input, allowing the locator engine to build a more precise search.

Compare:

```flow
flow.type "Email" "john@example.com";
```

with:

```flow
flow.type input "Email" "john@example.com";
```

The second version makes your intent much clearer and helps reduce ambiguity when multiple elements share the same visible text.

---

## How Flowstride Finds Input Controls

When you specify the `input` element, Flowstride uses its heuristic locator engine to search specifically for input controls.

Like every Flow Element, `input` also participates in:

- Heuristic element matching
- Ambiguity resolution
- Spatial selector resolution

This allows the same Scenario to remain readable while working across different UI implementations.

---

## Syntax

### Type into an input

```flow
flow.type input "Email" "john@example.com";
```

### Click an input

```flow
flow.click input "Search";
```

### Verify an input is visible

```flow
flow.expect visible input "Password";
```

---

## Examples

### Enter an email address

```flow
Feature: User Authentication

Scenario: Sign in

When "Enter the email address"
    flow.type input "Email" "john@example.com";

When "Enter the password"
    flow.type input "Password" "Password123";

Then "Continue with authentication"
    flow.click button "Login";
```

---

### Use a Spatial Selector

Flow Elements work seamlessly with Flowstride's spatial selectors.

```flow
Feature: User Registration

Scenario: Complete the registration form

When "Enter the first name"
    flow.type input "Name" under "First Name" "John";
```

---

### Reduce Ambiguity

Instead of:

```flow
flow.type "Email" "john@example.com";
```

use:

```flow
flow.type input "Email" "john@example.com";
```

to make it clear that the target is an input control.

---

## When to Use the input Element

Use `input` whenever you're interacting with a field that accepts user input.

Typical examples include:

- Login forms
- Registration forms
- Search boxes
- Contact forms
- Profile forms
- Authentication screens

---

## Important Notes

::: info Input is a search hint

The `input` element narrows Flowstride's search to input controls handled by the locator engine.

:::

::: info Spatial selectors are supported

The `input` element works with all supported spatial selectors.

For example:

```flow
flow.type input "Email" under "Enter Email" "john@example.com";

flow.click input "Search" near "Products";
```

:::

::: info Reduces ambiguity

Specifying `input` narrows the search space.

When multiple elements contain the same text, using an element type helps Flowstride identify the intended control more accurately.

:::

---

## Common Mistakes

::: warning Don't over-specify when unnecessary

Flowstride can often locate input controls without specifying an element type.

However, when multiple elements share the same visible text, using `input` makes your Scenario clearer and reduces ambiguity.

:::

::: warning Combine with spatial selectors when needed

If multiple input controls match the same description, combine `input` with a spatial selector or an index.

For example:

```flow
flow.type input "Email" under "Billing Address" "London";

flow.type input "Email [1]" "john@example.com";
```

:::

---
