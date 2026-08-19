# above, below, under

## Introduction

`above` and `below` (including its alias `under`) are **Spatial Modifiers** that allow Flowstride to locate a target element based on its strict vertical placement relative to an anchor element on the screen.

While the `near` modifier searches in all directions simultaneously, vertical modifiers mathematically force the locator engine to look strictly up or down, making them perfect for top down lists and stacked forms.

---

## The Problem It Solves

Web pages frequently align related data vertically. For example:

- A stacked registration form where the "Password" input sits under the "Email" input.
- A vertical list of downloadable reports where the "Download" button sits beneath the report title.
- A summary card where the total price sits directly under the subtotal.

If you use `near` in a tightly packed grid, the engine might accidentally grab a button from an adjacent column if it happens to be geometrically closer in total pixel distance.

By using `above` or `below`, you mathematically eliminate any elements that do not sit in the correct vertical path, guaranteeing absolute precision.

Compare:

```flow
flow.click button "Download";
```

with:

```flow
flow.click button "Download" below "Annual Financial Report";
```

The second version mathematically filters out all "Download" buttons on the page except the ones strictly below the "Annual Financial Report" heading, and then clicks the closest one.

---

## How It Works

When you use vertical spatial modifiers, Flowstride bypasses standard Document Object Model nesting rules and looks at the rendered pixels on the screen.

1.  **Anchor Resolution:** Flowstride first finds the anchor element (e.g., "Annual Financial Report").
2.  **Target Resolution:** It finds all elements matching your target (e.g., all "Download" buttons).
3.  **Directional Filtering:**
    - For `above`, it immediately discards any target whose bottom boundary sits below the anchor's top boundary.
    - For `below` (or `under`), it immediately discards any target whose top boundary sits above the anchor's bottom boundary.
4.  **Geometric Calculation:** It draws physical bounding boxes around the remaining valid matches and calculates the shortest mathematical distance to the anchor.
5.  **Execution:** It selects the target that is vertically closest.

---

## Syntax

### Click a button below a heading

```flow
flow.click button "Submit" below "Terms and Conditions";
```

### Type into a field under a label

_(Note: `under` is an exact mathematical alias for `below`)_

```flow
flow.type input "Password" under "Email Address" "SecurePass123";
```

### Verify an element above a footer

```flow
flow.expect visible "Pagination" above "Website Footer";
```

---

## Examples

### Resolving ambiguity in a vertical list

When a list contains multiple identical action buttons stacked on top of each other, use the specific item name as the vertical anchor.

```flow
Feature: Document Management

Scenario: Download a specific document

Given "The user is on the document repository"
    flow.open "/documents";

When "The user clicks the download button for the Q3 Report"
    flow.click button "Download" below "Q3 Performance Report";

Then "The download initiates successfully"
    flow.expect visible "Download started";
```

---

### Targeting stacked form fields

When dealing with vertically aligned inputs, you can anchor them to the labels sitting directly above them.

```flow
Feature: Account Login

Scenario: Complete a stacked login form

Given "The user is on the login page"
    flow.open "/login";

When "The user enters their email address"
    flow.type input "Email" under "Sign In To Your Account" "admin@example.com";

And "The user enters their password"
    flow.type input "Password" under "Email" "SuperSecret123";
```

---

## When to Use "above" and "below"

Use vertical spatial modifiers whenever you need to resolve visual ambiguity across a vertical axis. They are highly effective for:

- Stacked form layouts (which are extremely common on mobile interfaces)
- Action buttons aligned beneath card titles or list items
- Data summaries where totals sit below subtotals
- Navigation menus that expand vertically

---

## Important Notes

::: info Mobile Layout Advantage
Unlike horizontal modifiers (`leftOf`, `rightOf`) which often break when responsive designs collapse into vertical stacks on mobile screens, `above` and `below` are typically highly resilient. Stacked elements usually remain stacked regardless of the screen size.
:::

::: info Visible Elements Only
Because directional calculations rely on rendered pixels, both your target element and your anchor element must be fully visible on the screen for the calculation to work.
:::

---

## Common Mistakes

::: warning Using a vague anchor
If your anchor text appears multiple times on the page, Flowstride will throw an ambiguity error for the anchor itself. Always choose a highly unique anchor (like a specific report name or distinct heading) to guide the engine.
:::

::: warning Horizontal alignment drift
If an element sits diagonally (below and far to the right), `below` will still find it as long as its physical pixels are located strictly beneath the anchor's horizontal plane. However, if you strictly want a nearby element regardless of exact vertical path, you should use `near`.
:::
