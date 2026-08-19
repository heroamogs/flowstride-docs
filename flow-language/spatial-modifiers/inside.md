# inside, in

## Introduction

`inside` (and its exact alias `in`) is a **Spatial Modifier** that allows Flowstride to locate a target element by strictly limiting the search to the boundaries of a specific parent container.

While modifiers like `near` or `below` look at adjacent elements on the screen, `inside` forces the locator engine to look hierarchically _within_ another element, making it the perfect tool for data tables, product cards, and distinct page sections.

---

## The Problem It Solves

Modern web applications frequently reuse components. For example:

- An ecommerce page displays twenty product cards, and every single card has its own "Add to Cart" button.
- A data table displays fifty rows, and every row contains an "Edit" button.
- A page has a "Search" input field in the top navigation bar and another "Search" input field in the footer.

If you simply instruct Flowstride to click "Add to Cart", it will find twenty identical buttons and throw an ambiguity error.

By using the `inside` modifier, you mathematically restrict the framework's vision to a specific visual container, filtering out all other identical buttons on the page.

Compare:

```flow
flow.click button "Add to Cart";
```

with:

```flow
flow.click button "Add to Cart" inside "Premium Laptop";
```

The second version tells the engine to find the visual container for "Premium Laptop" first, and then strictly search for the button _only_ within those boundaries.

---

## How It Works

When you use `inside`, Flowstride leverages both Document Object Model hierarchy and advanced visual rendering to narrow the search space.

1.  **Anchor Resolution:** Flowstride first finds the container element (e.g., the product card containing the text "Premium Laptop", or a specific coordinate like `table[0] tr[1]`).
2.  **Boundary Restriction:** It mathematically locks its search scope to the physical and structural boundaries of that container.
3.  **Target Resolution:** It searches for your target element (e.g., the "Add to Cart" button) strictly within that locked scope.
4.  **Execution:** Because all outside elements are ignored, it perfectly selects the correct target without ambiguity.

---

## Syntax

### Click a button inside a specific section

```flow
flow.click button "Update" inside "Account Settings";
```

### Type into a field inside a container

_(Note: `in` is an exact mathematical alias for `inside`)_

```flow
flow.type input "Search" in "Navigation Bar" "Wireless Mouse";
```

### Click an element inside a table coordinate

```flow
flow.click button "Delete" inside "table[0] tr[2] td[4]";
```

---

## Examples

### Resolving ambiguity in product cards

When a page contains multiple repeating cards, use a unique detail on the specific card as your anchor.

```flow
Feature: Ecommerce Checkout

Scenario: Add a specific product to the cart

Given "The user is viewing the product catalogue"
    flow.open "/products";

When "The user clicks buy on the mechanical keyboard"
    flow.click button "Buy Now" inside "Mechanical Keyboard Pro";

Then "The cart updates successfully"
    flow.expect visible "Item Added";
```

---

### Isolating a specific page region

When identical forms or inputs exist in different areas of the layout (like a header and a sidebar).

```flow
Feature: Site Navigation

Scenario: Use the sidebar search feature

Given "The user is on the blog"
    flow.open "/blog";

When "The user searches using the sidebar widget"
    flow.type input "Search articles" inside "Sidebar Widget" "Automation";

And "The user submits the search"
    flow.click button "Go" inside "Sidebar Widget";
```

---

## When to Use "inside"

Use the `inside` spatial modifier whenever you need to isolate a specific component that contains repeating elements. It is highly effective for:

- Data table rows and exact cell coordinates (`table[0] tr[1] td[2]`)
- Repeating components like product cards or user profile cards
- Differentiating between identical header, footer, and sidebar links
- Targeting elements within distinct modal dialogs or popups

---

## Important Notes

::: info The Most Accurate Modifier
Because `inside` relies on strict structural containment rather than calculating directional distances, it is mathematically the fastest and most precise spatial modifier in the Flowstride framework.
:::

::: info Works Perfectly with Tables
`inside` is the required modifier when using Flowstride's table coordinate system. It allows you to perfectly anchor your actions to an exact mathematical grid intersection.
:::

---

## Common Mistakes

::: warning Container must fully wrap the target
The `inside` modifier only works if the target element is physically or structurally contained within the anchor. If you try to look `inside` a label that sits completely separate from an input field, it will fail. For adjacent elements, use `near`, `rightOf`, or `below` instead.
:::

::: warning Vague Containers
If the text you use for your container exists in multiple places on the screen, Flowstride will not know which container to look inside. Always choose a highly unique piece of text or a specific coordinate to act as your anchor.
:::
