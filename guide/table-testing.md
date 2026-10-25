# Test tables and cells

Flowstride can search an application's table, select a row by its contents, click a cell or row action, and check or extract cell values. These commands use the same syntax in **OS and Cloud**, with Chromium, Firefox or WebKit.

Use a stable record identifier when the table can be filtered, sorted or paginated. Indexed coordinates are useful when the position itself is part of the test.

## 1. Prepare a local example

Start with the [normal npm installation](/guide/getting-started):

```sh
npm init -y
npm i flowstride
npx flowstride init
```

For a self-contained example, create `table-app.mjs` in the project root. It serves a searchable orders table with two records. Clicking a cell or a **View** button opens that order's details.

```js
import { createServer } from 'node:http';

const html = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Orders table example</title>
  </head>
  <body>
    <h1>Orders</h1>
    <label for="search">Search orders</label>
    <input id="search" type="search" placeholder="Search orders">
    <table id="orders">
      <thead>
        <tr><th>Order</th><th>Customer</th><th>Status</th><th>Action</th></tr>
      </thead>
      <tbody>
        <tr data-order="FS-101">
          <td>FS-101</td><td>Ada Obi</td><td>Pending</td>
          <td><button type="button">View</button></td>
        </tr>
        <tr data-order="FS-102">
          <td>FS-102</td><td>Bayo Ade</td><td>Approved</td>
          <td><button type="button">View</button></td>
        </tr>
      </tbody>
    </table>
    <h2 id="details" aria-live="polite">Select an order</h2>
    <script>
      const rows = [...document.querySelectorAll('#orders tbody tr')];
      document.querySelector('#search').addEventListener('input', event => {
        const query = event.target.value.toLowerCase();
        for (const row of rows) {
          row.hidden = !row.textContent.toLowerCase().includes(query);
        }
      });
      for (const row of rows) {
        row.addEventListener('click', () => {
          document.querySelector('#details').textContent =
            'Order ' + row.dataset.order;
        });
      }
    </script>
  </body>
</html>`;

createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(html);
}).listen(3000, '127.0.0.1', () => {
  console.log('Orders example: http://127.0.0.1:3000');
});
```

Run the application in a separate terminal and leave it running:

```sh
node table-app.mjs
```

Create a project-root `.env` file:

```dotenv
BASE_URL=http://127.0.0.1:3000
```

OS and Cloud both load this value automatically. If port 3000 is occupied, change the port in the application and `.env` together.

## 2. Search and act on the matching row

Save this as `flows/table.flow`:

```flow
Feature: Find an order in a table

  Scenario: Search for a record and open its details
    Given "The orders table is open"
      flow.open "/";
      flow.expect visible table "#orders";

    When "Search for order FS-102 and check the matching row"
      flow.type input "Search orders" "FS-102";
      flow.assert.that {
        "selector": "#orders tbody tr:not([hidden])",
        "condition": "count",
        "value": 1
      };
      flow.assert.that {
        "selector": "#orders tbody tr:has(td:text-is('FS-102')) td:nth-child(3)",
        "condition": "text",
        "value": "Approved"
      };

    When "Open the matching order"
      flow.extract text "#orders tbody tr:has(td:text-is('FS-102')) td:nth-child(1)" as "selectedOrder";
      flow.click "#orders tbody tr:has(td:text-is('FS-102')) button";

    Then "The details belong to the selected record"
      flow.expect text "Order @selectedOrder";
```

`flow.type` uses the application's search control. The selector `tr:has(td:text-is('FS-102'))` finds the row containing that exact cell text, so the action still identifies the same record if its row position changes. The table must provide a unique matching record.

The count selector excludes rows this example hides with the `hidden` attribute. Adapt it if your application removes filtered rows, uses CSS classes, or renders a virtualized grid. A locator count normally counts matching DOM elements, including hidden elements.

`flow.assert.that` checks the selected cell's text and retries the check until timeout. Extraction stores the cell value as `@selectedOrder`; it does not assert correctness by itself. See [assertions](/reference/native-browser-commands#retrying-assertions) and [extraction](/flow-language/flow-commands/flow.extract).

## 3. Select by row and cell position

Save this independent example as `flows/table-coordinates.flow`:

```flow
Feature: Select an order by table coordinates

  Scenario: Click a cell and then a row action
    Given "The unfiltered orders table is open"
      flow.open "/";

    When "Click the first cell in the second data row"
      flow.click "table[0] tr[2] td[0]";

    And "The second order is selected"
      flow.expect text "Order FS-102";

    When "Click View inside the first data row"
      flow.click button "View" inside "table[0] tr[1]";

    Then "The first order is selected"
      flow.expect text "Order FS-101";
```

Coordinate indexes start at **zero** and apply at each level:

| Selector | Meaning in this example |
| --- | --- |
| `table[0]` | First table |
| `table[0] tr[0]` | Header row |
| `table[0] tr[1]` | First data row, FS-101 |
| `table[0] tr[2] td[0]` | First data cell in the second data row, FS-102 |
| `table[0] tr[0] th[2]` | Third header cell, Status |

Header rows count as `tr` elements. `td` selects data cells; `th` selects header cells. Hidden rows still occupy a coordinate when they remain in the DOM. If there are nested tables, use a stable selector to avoid counting their rows too.

Coordinate indexing differs from CSS `:nth-child()`, which starts at **one**. For example, `td:nth-child(3)` means the third child when that child is a `td`. Sorting, filtering and pagination can change which record occupies an index; use the content-based example when the record's identity matters.

## 4. Run in OS or Cloud

Run the exact example files without including the unrelated sample created by `init`:

```sh
npx flowstride run flows/table.flow --browser chromium
npx flowstride run flows/table-coordinates.flow --browser chromium
```

The first test should find FS-102 with status **Approved** and open its details. The coordinate test should select FS-102, then FS-101. The example application does not require a login.

OS runs these tests without an account. To use Cloud, [connect your account](/cloud/authentication), accept the engine installation when offered, and run the same commands. Cloud includes free accounts; these table commands do not require a paid subscription.

For other browsers, install their matching binaries and select the engine explicitly:

```sh
npx flowstride install firefox webkit
npx flowstride run flows/table.flow --browser firefox
npx flowstride run flows/table.flow --browser webkit
```

For headless execution and reports, add `--ci`:

```sh
npx flowstride run flows/table.flow --browser chromium --ci
```

## Apply the examples to your application

- Replace `#orders`, the search label, columns and expected values with your application's contract.
- Prefer a unique order ID, email or another stable key over a row number. Scope repeated buttons to that row.
- Click the application's sort or pagination control, then assert the resulting cells. Flowstride does not infer the intended sort order or load rows that are not rendered.
- Use DOM selectors matching the actual markup for grids built from `div` elements or ARIA roles. Table coordinates apply to HTML `table`, `tr`, `th` and `td` elements.

Related references: [table elements](/flow-language/flow-elements/table), [click](/flow-language/flow-commands/flow.click), [inside/in](/flow-language/spatial-modifiers/inside), and [waiting and retries](/guide/waiting-and-retries).

## Extract a cell and reuse it on another page

A value can leave the table and become input for a later part of the same journey:

```flow
Feature: Reuse a table record in a booking form

  Scenario: Copy a pet name into the quote
    Given "The authorized records page is open"
      flow.open "{{env.TABLE_URL}}";
      flow.type input "Enter your email" "{{env.TABLE_EMAIL}}";
      flow.type input "Enter your password" "{{env.TABLE_PASSWORD}}";
      flow.click button "Sign in";

    When "Read a pet name from the intended table cell"
      flow.extract text "table[0] tr[6] td[0]" as "petName";

    When "Use that name on the booking page"
      flow.open "{{env.QUOTE_URL}}";
      flow.type input "First Name" "@petName";

    Then "The quote form has the extracted value"
      flow.assert.that {
        "selector": "input[name='firstName']",
        "condition": "value",
        "value": "@petName"
      };
```

Configure the URLs/credentials in `.env`, and adapt the coordinate and destination input to your application. `@petName` remains in the file's extracted state across navigation. Prefer a stable record selector if row six can change identity.

For a repeated action inside one exact cell:

```flow
flow.click button "Start SOAP" inside "table[0] tr[1] td[9]";
```

This selects the button inside that cell rather than the first matching button anywhere. Assert the resulting SOAP/record screen afterward. [Included table examples](/guide/working-examples) demonstrate search, extraction, cross-page reuse and an intentional wrong-value failure.
