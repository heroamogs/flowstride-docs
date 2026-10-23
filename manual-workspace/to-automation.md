# From manual case to automation

A reviewed manual case is a useful specification for an automated scenario. Flowstride does not automatically convert a canvas into executable DSL.

## Choose a stable case

Automate a repeatable behavior with observable results and controllable data. Keep exploratory work, subjective visual judgment and behaviors without a reliable oracle as manual coverage until their expectations are clearer.

| Manual material | Automation counterpart |
| --- | --- |
| Flow name and objective | `Feature` and `Scenario` |
| Preconditions/data setup | `Given`, often using API setup |
| Human action instructions | `When` with browser/API commands |
| Expected results | Explicit `flow.expect` or retrying `flow.assert.that` checks |
| Environment and fixtures | Configuration and environment variables |
| Defect evidence | Captured run artifacts and clear failure output |

## Example: verify an order

```flow
Feature: Order history

Scenario: A created order is visible to its customer

Given "The customer order is prepared"
  flow.post "/api/test/orders" with reqBody
  """
  { "fixture": "registered-customer-one-item" }
  """

And "The setup succeeds"
  flow.expect status "201";

When "The customer opens order history"
  flow.open "/orders";

Then "The order is visible"
  flow.expect visible "DOCS-ORDER-001";
```

The setup endpoint and order identifier are illustrative. Your application must implement its own fixture/authentication; Flowstride does not create that endpoint. A real case should assert the identifier returned by setup and confirm the required totals/quantity, not only the existence of a generic success banner.

A single scenario can also combine API preparation, approval and browser login; see [API and UI in one flow](/guide/api-and-ui). Use [separate browser profiles](/guide/native-browser-workflows#separate-users-in-one-test) when customer/admin users must remain independently signed in.

## Keep the behavior reviewable

Use one assertion for each meaningful expected result. Run the case with intentionally wrong data to prove the checks can fail. Do not use optional actions to hide required failures.

Keep the manual case as a reference for the behavior and use [native CI](/guide/native-ci-games) once the automated version is accepted. Browser-game cases can use the same process with [native state and input APIs](/games/getting-started).
