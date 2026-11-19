# JavaScript and TypeScript helpers

Flowstride (FS) scenarios go in `.flow` files. Put custom logic such as calculations, loops, and branching in JavaScript (JS) or TypeScript (TS) helpers and call them from a scenario. Keep the user actions and expected outcomes visible in the FS steps.

For a complete browser and API scenario, start with [Test a 50-car catalog with JS and TS](/guide/complex-tests). It includes both helper files, their imports and a failing-price exercise. The example below introduces the calling syntax independently of a particular application.

## Generate an email

In an npm project using CommonJS, save this JS helper as `helpers/email.js`.

```js
const { randomUUID } = require('node:crypto')

function generateEmail(domain = 'example.test') {
  return 'qa-' + randomUUID() + '@' + domain
}

module.exports = { generateEmail }
```

In an ES module project, use `import { randomUUID } from 'node:crypto'` and `export function generateEmail`. Named TS exports use the same approach in `email.ts`. Put the named import under `Feature` and call the helper inside a scenario.

```flow
Feature: Generate new signup addresses
import { generateEmail } from "email.js";

Scenario: Generate addresses for two test environments
  Given "Generate an address for the test user"
    flow.call generateEmail() as "signupEmail";
  When "Generate an address for the support team"
    flow.call generateEmail("team.example.test") as global "teamEmail";
  Then "Each address uses its intended domain"
    flow.assert.value {
      "actual": "@signupEmail",
      "operator": "contains",
      "expected": "@example.test"
    };
    flow.assert.value {
      "actual": "@global[teamEmail]",
      "operator": "contains",
      "expected": "@team.example.test"
    };
```

Save the scenario as `flows/application/generate-email.flow` and run `npx flowstride run flows/application/generate-email.flow`. In a signup test, you can enter the same captured value with `flow.type input "Email" "@signupEmail";`.

## Imports and arguments

- A name such as `"email.js"` loads from the project's `helpers` directory. Set `helpersDir` in `flowstride.config.json` to change that directory. A path starting with `./` or `../` is relative to the importing `.flow` file. The resolved file must stay inside the project.
- Import named functions with their exported names. In VS Code, use **Go to Definition** on a helper name in an import or call. It opens the source of a statically named export in a trusted project.
- Arguments are JSON values. Use empty parentheses for zero arguments. Double-quote a value reference such as `"@signupEmail"`. Calls support asynchronous helpers and wait for the returned result.
- Use `flow.call checkPrices(page, "@cars")` when the first argument should be the active Playwright page. Start the browser or select the intended profile before making the call. The remaining arguments still use JSON.
- Use `flow.call "steps/customer.flowpart";` to reuse FS commands from a fragment. Use the parenthesized form to call a JS or TS helper. [Plugins and SDK](/flow-language/getting-started/plugins)

## Capture and reuse values

| Capture | Read | Lifetime |
| --- | --- | --- |
| `as "signupEmail"` | `@signupEmail` | The current file, including its later scenarios |
| `as global "teamEmail"` | `@global[teamEmail]` | The worker process |

For a pure helper, pass just the data it needs. If an operation needs cookies or locators from the selected browser profile, pass the unquoted `page` as its first argument. FS owns the browser and closes it after the run. Return a JSON value when you capture it. Arrays, objects, numbers and booleans keep their types when passed back to another helper. Without an `as` clause, the return value is unused. Run setup inside a scenario. Imports belong under `Feature`, and a helper call runs when its step executes.

A thrown error fails the helper step. Include the record ID and expected/actual result in the message. FS reports the helper name and source location when available. Each call appears as one step, so keep interactions you want to inspect separately in the `.flow` file. JS and TS helpers run with the permissions of the local Node.js process. Review them before granting access to CI secrets.

Use a runner-managed fixture for setup that needs cleanup on failure or retry. Use a handoff when another file must wait for that setup, including files scheduled in a different worker. [Fixtures and handoffs](/flow-language/getting-started/fixtures-and-handoffs)
