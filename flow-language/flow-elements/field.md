# field

## Introduction

`field` is a **Flow Element** that tells Flowstride to search specifically for form fields using its heuristic locator engine.

Rather than searching every visible element on the page, `field` narrows the search to field controls recognised by Flowstride, making your Scenarios easier to read and reducing locator ambiguity.

---

## Why Use the field Element?

Forms often contain many different types of elements, including labels, buttons, links, and editable controls.

Using the `field` element makes your intent explicit by telling Flowstride that you're interacting with a form field.

For example:

```flow
flow.type field "Email" "john@example.com";
```

This clearly communicates that the target is expected to be a form field.

---

## How Flowstride Finds Fields

When you specify the `field` element, Flowstride uses its heuristic locator engine to search specifically for field controls.

Like every Flow Element, `field` participates in:

- Heuristic element matching
- Ambiguity resolution
- Spatial selector resolution

This allows the same Scenario to remain readable while working across different UI implementations.

---

## Syntax

### Type into a field

```flow
flow.type field "Email" "john@example.com";
```

### Click a field

```flow
flow.click field "Search";
```

### Verify a field is visible

```flow
flow.expect visible field "Password";
```

---

## Examples

### Enter login credentials

```flow
Feature: User Authentication

Scenario: Sign in

When "Enter the email address"
    flow.type field "Email" "john@example.com";

When "Enter the password"
    flow.type field "Password" "Password123";

Then "Submit the form"
    flow.click button "Login";
```

---

### Use a Spatial Selector

The `field` element works seamlessly with Flowstride's spatial selectors.

```flow
When "Enter the first name"
    flow.type field "First Name" near "Personal Information" "John";
```

---

### Reduce Ambiguity

Instead of:

```flow
flow.type "Email" "john@example.com";
```

use:

```flow
flow.type field "Email" "john@example.com";
```

to clearly indicate that the target is a form field.

---

## When to Use the field Element

Use `field` whenever you're interacting with editable fields within a form.

Typical examples include:

- Login forms
- Registration forms
- Search forms
- Contact forms
- Profile forms
- Checkout forms

---

## Important Notes

::: info Field is a search hint

The `field` element narrows Flowstride's search to field controls recognised by the locator engine.

:::

::: info Spatial selectors are supported

The `field` element works with all supported spatial selectors.

For example:

```flow
flow.click field "Search" near "Products";
```

:::

::: info Reduces ambiguity

Specifying `field` narrows the search space.

When multiple elements contain similar text, using the `field` element helps Flowstride identify the intended control more accurately.

:::

---

## Common Mistakes

::: warning Don't over-specify when unnecessary

Flowstride can often locate fields without specifying an element type.

However, when multiple elements share the same visible text, using `field` improves readability and reduces ambiguity.

:::

::: warning Combine with spatial selectors when needed

If multiple fields match the same description, combine `field` with a spatial selector or an index.

For example:

```flow
flow.type field "City" under "Billing Address" "London";

flow.type field "Email [1]" "john@example.com";
```

:::

---
