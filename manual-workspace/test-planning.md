# Plan a useful manual test

Start with the behavior and the risk, then draw the canvas. A clear plan makes the case repeatable and prevents a polished diagram from becoming an ambiguous checklist.

## Define the case before drawing

Record the following in your test plan and flow description/reference material:

| Question | Example for checkout |
| --- | --- |
| What behavior matters? | A signed-in customer can place one order |
| What failure is expensive? | Duplicate order after a retry |
| What is in scope? | Cart, address, submission, confirmation |
| What is excluded? | Payment settlement and bank integration |
| What must already exist? | Test customer, stocked item, known delivery address |
| Which build/environment? | Staging build identifier, browser and test date |
| What proves success? | One confirmation, one matching order ID and correct total |
| What cleanup is needed? | Cancel the test order and restore stock if required |

The workspace has a **Test Plan** field, an **Environment** field, a version, and per-step references/priority. Use them for concise identifiers and links. It does not provide a dedicated typed field for every item in this table.

## Choose coverage deliberately

Create separate flows for different outcomes rather than making one canvas branch indefinitely:

| Case | Data variation | Expected result |
| --- | --- | --- |
| Successful checkout | Valid customer and stocked item | Exactly one order is created |
| Validation failure | Missing required address field | Clear error; no order created |
| Duplicate submission | Retry after a slow response | No duplicate order |
| Permission failure | Account without checkout access | Access denied without data change |
| Recovery | Refresh/reconnect after confirmation | Existing order remains identifiable |

Add boundary values, roles, device/browser differences and accessibility checks based on the product risk. Flowstride records your case; it does not derive this coverage automatically.

## Exploratory testing

Use a short charter such as: “Explore cart recovery after network interruptions for 30 minutes.” Record observations in step descriptions or linked notes, create a defect for an actionable finding, then turn a repeatable discovery into a structured flow.

Do not count an exploratory session as a passing regression case unless its expected outcomes were actually verified.

## Ready-for-execution checklist

- The tester knows the starting state and has access to the environment.
- Test data is disposable and can be recreated.
- Every step has an observable expected result.
- Connections define a single executable path.
- A reviewer can distinguish a product defect from blocked test setup.
- Cleanup and evidence requirements are written down.

Continue with [your first manual flow](/manual-workspace/first-flow).
