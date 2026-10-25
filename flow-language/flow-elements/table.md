# table, tr, th and td

Target an HTML table, row, header cell or data cell. Table interactions are available in OS and Cloud. Start with [Test tables and cells](/guide/table-testing) for a complete, runnable local example.

## Locate a table

```flow
flow.expect visible table "#orders";
```

## Indexed coordinates

```flow
flow.click "table[0] tr[2] td[0]";
flow.click button "View" inside "table[0] tr[1]";
flow.extract text "table[0] tr[1] td[2]" as "orderStatus";
```

Indexes start at **zero** at each level. With one header row, `tr[0]` is that header and `tr[1]` is the first data row. `td` selects data cells; `th` selects header cells. Hidden rows still count when they remain in the DOM, and nested tables can contribute descendant rows. Use coordinates when the position is intentional.

## Find a row by its contents

```flow
flow.click "#orders tbody tr:has(td:text-is('FS-102')) button";
flow.assert.that {
  "selector": "#orders tbody tr:has(td:text-is('FS-102')) td:nth-child(3)",
  "condition": "text",
  "value": "Approved"
};
```

This example clicks the button in the row containing order FS-102 and checks that row's third cell. The record must be unique. CSS `:nth-child(3)` starts at **one**, unlike Flowstride's zero-based coordinate notation.

## Choose stable targets

Element qualifiers guide target resolution; they are not a complete DOM-query language. Prefer a clear label, then add a stable selector or [spatial relationship](/flow-language/spatial-modifiers/inside) if the page is ambiguous.

Use the application's search, sorting and pagination controls, then assert the resulting cells. Filtering does not automatically load records on other pages. For grids built from `div` elements or ARIA roles, use selectors matching their markup. See the [table guide](/guide/table-testing) for searching, extraction, row actions and runs across OS and Cloud.
