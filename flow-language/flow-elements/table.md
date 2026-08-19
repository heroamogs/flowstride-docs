# table, tr, th, td

## Introduction

`table`, `tr`, `th`, and `td` are **Flow Elements** that allow Flowstride to mathematically navigate and interact with structured data grids.

Rather than relying purely on visible text which might be duplicated across multiple rows, these elements let you specify exact spatial coordinates to pinpoint a specific cell or the buttons inside it.

---

## Why Use the Table Elements?

Data tables often contain repetitive information. If you have ten rows of active users and each row has a "Delete" button, a standard text search will find all ten buttons, causing an ambiguity error or targeting the wrong one.

By specifying the exact table, row, and column, you eliminate ambiguity and tell Flowstride exactly where to look.

Compare:

```flow
flow.click button "View Invoice";
```

with:

```flow
flow.click button "View Invoice" inside "table[0] tr[1] td[9]";
```

The second version mathematically restricts the search to the tenth column of the second row in the first table, guaranteeing absolute precision.

---

## How Flowstride Finds Table Coordinates

Flowstride uses a zero based mathematical array system to resolve table coordinates. This means counting always starts at zero.

- `table[0]` is the first table on the page.
- `tr[1]` is the second row in that table.
- `td[9]` is the tenth column in that row.
- `th[0]` is the first header column.

When you use these elements as a spatial anchor (using the `inside` keyword), Flowstride safely translates them into high speed native selector chains before searching for your target element.

---

## Syntax

### Click a button inside a specific cell

```flow
flow.click button "Edit" inside "table[0] tr[2] td[4]";
```

### Extract text directly from a cell

```flow
flow.extract text "table[0] tr[1] td[0]" as "orderNumber";
```

### Verify text inside a specific row

```flow
flow.expect text "Completed" inside "table[0] tr[1]";
```

---

## Examples

### Extracting data from a data grid

```flow
Feature: Order Management

Scenario: Verify dynamic order assignment
...

When "Store the latest order number from the first row"
    flow.extract text "table[0] tr[0] td[0]" as "latestOrder";

Then "Search for the extracted order"
    flow.type field "Search Orders" "@latestOrder";
```

---

### Clicking an action button in a specific row

```flow
Feature: Administrator Dashboard

Scenario: Manage user accounts
...

When "Click the Edit Profile button for the second user"
    flow.click button "Edit Profile" inside "table[0] tr[1] td[9]";

Then "Verify the profile editor opened successfully"
    flow.expect visible "Account Settings";
```

---

## When to Use the Table Elements

Use table elements whenever you are interacting with a structured data grid where row and column intersections matter.

Typical examples include:

- Dashboards with data rows
- User administration lists
- Financial reports and invoices
- Any User Interface where multiple buttons or links share the exact same text across different rows

---

## Important Notes

::: info Zero based indexing
Remember that computer arrays start at zero. If you want the first table, you must use `table[0]`. If you use `table[1]`, Flowstride will look for a second table on the screen.
:::

::: info Works perfectly with the inside modifier
Table elements are designed to act as spatial anchors. Always use the `inside` preposition when targeting buttons or links housed within the cells.
:::

::: info Extracts raw text easily
When combined with `flow.extract text`, you can easily scrape dynamic data from cells without needing complex locators.
:::

---

## Common Mistakes

::: warning Human counting vs Computer counting
The most common mistake is using `table[1]` to target the first table. Flowstride uses strict zero based indexing. Always start your count at zero (`table[0]`, `tr[0]`, `td[0]`).
:::

::: warning Forgetting the table tag
Always start your coordinate chain with the `table` element. Writing `tr[1] td[2]` without specifying the table can cause Flowstride to search the entire Document Object Model, leading to slower execution or ambiguity.
:::
