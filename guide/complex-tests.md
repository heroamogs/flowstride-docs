# Test a 50-car catalog with JavaScript and TypeScript

A pricing API can return the wrong discount and the browser can faithfully display it. The browser can also show the price of the car in the next row while the API is correct. This Flowstride (FS) 2.0 test catches both errors. It reads the local practice catalog once, calculates the expected price for every SKU, and compares each visible price with its own expected value.

You will use two ordinary named functions. The JavaScript helper knows the pricing rules. The TypeScript helper knows how a car is displayed. The `.flow` file ties them together and reports which check failed. You can use both helpers without registering a plugin.

## Run the included version first

In a fresh npm project with Node.js 22.12 or newer, run:

```sh
npm install --save-dev flowstride@2.0.0
npx flowstride init
npx flowstride run flows/examples/advanced/check-catalog-prices.flow
```

FS starts its practice app on localhost and opens the live dashboard. A passing run checks **50 cars and four delivery options**. Select the helper step to see which part of the scenario ran. To inspect the full implementation, open `helpers/practice/catalog.ts` and `flows/examples/advanced/check-catalog-prices.flow` in the initialized project. The shorter walkthrough below tests the catalog prices. Delivery quotes are covered in the bundled version.

If you already have a Flowstride project, use `npx flowstride init --practice` and change into `.flowstride/practice` before running the example or adding the files below.

## 1. Calculate the expected prices in JavaScript

Save this file as `helpers/catalog-rules.js`. The practice catalog numbers its cars from `CAR-001` to `CAR-050`. Numbers 1, 6, 11 and so on get 10% off. Other electric cars get 5%. All others pay the base price. For a car that qualifies for both discounts, the 10% rule wins.

```js
function expectedPrices(cars) {
  if (!Array.isArray(cars) || cars.length !== 50) {
    throw new Error('Expected 50 cars from the practice API')
  }

  const seen = new Set()
  return cars.map(car => {
    const { sku, category, priceCents } = car
    if (typeof sku !== 'string') throw new Error('A catalog record is missing its SKU')
    const sequence = Number(sku.slice(4))
    if (!/^CAR-\d{3}$/.test(sku) || sequence < 1 || sequence > 50 || seen.has(sku)) {
      throw new Error('Invalid or repeated catalog SKU: ' + sku)
    }
    seen.add(sku)
    if (!Number.isSafeInteger(priceCents) || priceCents <= 0) {
      throw new Error('Invalid base price for ' + sku)
    }

    let discount = 0
    if ((sequence - 1) % 5 === 0) discount = 10
    else if (category === 'Electric') discount = 5

    const cents = Math.round(priceCents * (100 - discount) / 100)
    if (car.discountPercent !== discount || car.finalPriceCents !== cents) {
      throw new Error(sku + ': expected ' + discount + '% off and ' + cents +
        ' cents, API returned ' + car.discountPercent + '% and ' + car.finalPriceCents)
    }
    return { sku, cents }
  })
}

module.exports = { expectedPrices }
```

This file uses CommonJS, the default in a fresh `npm init -y` project. If your nearest `package.json` declares `"type": "module"`, replace the last line with `export { expectedPrices }`. Keeping money in integer cents lets the test specify exactly where rounding happens. The returned array can also be used directly in a unit test.

## 2. Match each visible card in TypeScript

Save this file as `helpers/catalog-ui.ts`. FS supplies the active Playwright `Page` when you request it. Here the list has already rendered when the practice page opens. For an asynchronously loaded catalog, wait for your application's completion signal before reading the list.

```ts
import type { Page } from 'playwright'

type ExpectedPrice = { sku: string, cents: number }

export async function checkPriceLabels(page: Page, prices: ExpectedPrice[]) {
  const remaining = new Map(prices.map(({ sku, cents }) => [sku, cents] as const))
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const cards = page.getByRole('list', { name: 'Cars' }).getByRole('listitem')
  const displayed = await cards.evaluateAll(items => items.map(item => ({
    sku: item.getAttribute('data-sku'),
    label: item.querySelector('.price span')?.textContent?.trim()
  })))

  for (const { sku, label } of displayed) {
    if (!sku || !remaining.has(sku)) throw new Error('Unexpected or repeated card: ' + sku)
    const expected = currency.format(remaining.get(sku)! / 100)
    if (label !== expected) throw new Error(sku + ': expected ' + expected + ', saw ' + label)
    remaining.delete(sku)
  }
  if (remaining.size) throw new Error('Missing cards: ' + [...remaining.keys()].join(', '))
  return displayed.length
}
```

Matching by SKU makes sorting harmless. Removing each SKU as it is checked catches both a duplicate card and a missing one, even if the total number of cards is still 50.

## 3. Call both helpers from one flow

Save this as `flows/examples/catalog-discounts.flow` in the initialized practice project. This location lets FS supply the practice app's URL. Bare import paths start at `helpers/`. A path beginning with `./` starts beside the importing `.flow` file.

```flow
Feature: Customers see the correct discount on every car
import { expectedPrices } from "catalog-rules.js";
import { checkPriceLabels } from "catalog-ui.ts";

Scenario: The catalog displays the independently calculated prices
  Given "Load the practice catalog and check the request succeeded"
    flow.get "/api/cars";
    flow.expect status "200";
    flow.extract resBody "cars" as "cars";
  When "Calculate each price and compare it with the matching browser card"
    flow.call expectedPrices("@cars") as "expected";
    flow.open "/";
    flow.call checkPriceLabels(page, "@expected") as "checked";
  Then "All fifty cars have the correct displayed price"
    flow.assert.value {
      "actual": "@checked",
      "operator": "equals",
      "expected": 50
    };
```

```sh
npx flowstride run flows/examples/catalog-discounts.flow
```

FS passes the array behind `"@cars"` as data, waits for the asynchronous browser helper and binds its numeric result to `@checked`. A thrown error fails that helper step. To see a browser-side failure on purpose, change the expected currency in `catalog-ui.ts` to `EUR` and rerun. The error names the SKU and shows both prices. Restore `USD` afterward. Add `--ci` to the run command to run it headlessly.

## When the complexity is in timing or shared state

| Requirement | How to handle it in FS |
| --- | --- |
| Retry a temporary failure while reading a delivery quote | Open the installed `helpers/practice/catalog.ts`. Its `requestQuote` retries a GET after 50 ms and 100 ms on HTTP 429, 502, 503 or 504. A single five-second deadline covers requests and backoff. Other unsuccessful statuses fail immediately. The example checks pickup, local, regional and freight outcomes. |
| Two tests need the same new account | Run `npx flowstride run flows/examples/advanced/new-user-signs-in.flow`. FS includes the admin test and holds the user test until the role is saved and the producer passes. The fixture registers account cleanup across attempts. [Follow the handoff](/flow-language/getting-started/fixtures-and-handoffs) |
| Make a reusable action that attaches a diagnostic file to the run | Use a project plugin with the FS SDK and `sdk.run.attach`. For calculations or access to the active page, an imported helper is sufficient. [Plugin API](/flow-language/getting-started/plugins) |
| Keep an existing Playwright Test suite and its fixtures | Import your business helper directly in the spec and add the FS reporter if you want those results in Saved Runs. [Playwright Test reporting](/reporting/playwright) |

For a no-argument function, local and worker-global bindings, and helper import rules, see [JavaScript and TypeScript helpers](/flow-language/getting-started/helpers).
