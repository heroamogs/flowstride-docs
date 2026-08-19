# near

## Introduction

`near` is a **Spatial Modifier** that allows Flowstride to locate a target element based on its physical proximity to an anchor element on the screen.

Instead of writing complex Document Object Model selectors to differentiate between identical buttons or fields, `near` lets you write instructions exactly as a human would visually scan the User Interface.

---

## The Problem It Solves

Web pages frequently contain multiple elements that look identical. For example:

- An e-commerce page might have ten "Add to Cart" buttons.
- A dashboard might have multiple "Edit" icons.
- A checkout form might have two "Address" input fields (one for shipping, one for billing).

If you simply instruct Flowstride to click "Edit", the framework might find multiple matches and throw an ambiguity error, or worse, click the wrong one.

By using the `near` spatial modifier, you establish a unique visual anchor to break the ambiguity.

Compare:

```flow
flow.type input "Address" "123 Main Street";
```

with:

```flow
flow.type input "Address" near "Billing Details" "123 Main Street";
```

The second version mathematically calculates the distance between all "Address" inputs and the "Billing Details" heading, strictly interacting with the one closest to it.

---

## How It Works

When you use the `near` modifier, Flowstride bypasses standard Document Object Model nesting rules and instead looks at the rendered pixels on the screen.

1.  **Anchor Resolution:** Flowstride first finds the anchor element (e.g., "Billing Details").
2.  **Target Resolution:** It then finds all elements matching your target (e.g., all inputs labelled "Address").
3.  **Geometric Calculation:** It draws physical bounding boxes around all matches and calculates the shortest mathematical distance to the anchor.
4.  **Execution:** It selects the target that is geometrically closest to the anchor.

---

## Syntax

### Click a button near a label

```flow
flow.click button "Delete" near "Project Alpha";
```

### Type into a field near a heading

```flow
flow.type input "Card Number" near "Payment Method" "424242424242";
```

### Verify an element near an image or text

```flow
flow.expect visible "Out of Stock" near "Wireless Headphones";
```

---

## Examples

### Resolving ambiguity in a product list

When a page contains multiple identical buttons, use a nearby product name as the anchor.

```flow
Feature: Shopping Cart

Scenario: Add a specific item to the cart

Given "The user is on the product catalogue"
    flow.open "/products";

When "The user adds the premium laptop to their cart"
    flow.click button "Add to Cart" near "Premium Laptop Pro";

Then "The cart counter updates successfully"
    flow.expect text "1 Item" inside "header";
```

---

### Targeting a specific form section

When a form asks for similar details in different sections, anchor your inputs to the section headings.

```flow
Feature: Checkout Process

Scenario: Enter distinct shipping and billing addresses

Given "The user is on the checkout page"
    flow.open "/checkout";

When "The user enters the shipping address"
    flow.type input "City" near "Shipping Information" "London";

And "The user enters the billing address"
    flow.type input "City" near "Billing Information" "Manchester";
```

---

## When to Use "near"

Use the `near` spatial modifier whenever you need to resolve visual ambiguity on the page. It is highly effective for:

- Product grids and lists
- Complex forms with repeated input names
- Data cards that lack distinct structural boundaries
- Scenarios where strict directional modifiers (`above`, `below`) might fail due to responsive mobile layouts shifting elements around.

---

## Important Notes

::: info Responsive Design Resiliency
Because `near` calculates the shortest absolute distance in any direction, it is often more resilient than `leftOf` or `rightOf` on responsive websites where elements might stack vertically on mobile screens.
:::

::: info Visible Elements Only
Spatial modifiers rely on physical bounding boxes. Therefore, both your target element and your anchor element must be visible on the screen for the calculation to work.
:::

---

## Common Mistakes

::: warning Using a vague anchor
If your anchor text appears multiple times on the page, Flowstride will throw an ambiguity error for the anchor itself. Always choose a highly unique anchor (like a specific product name or distinct heading) to guide the engine.
:::

::: warning Ignoring the Flow Element hint
If you are trying to click a button near a label, always specify the `button` Flow Element. Writing `flow.click "Delete" near "Item"` is slower and less precise than writing `flow.click button "Delete" near "Item"`.
:::
