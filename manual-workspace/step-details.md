# Write steps another tester can repeat

A good step describes one meaningful action and a result someone can observe. The title makes the canvas scannable; the properties carry the precise instructions.

## Use each field intentionally

| Field | Put here | Avoid |
| --- | --- | --- |
| Name/title | A short action, such as “Submit valid address” | “Step 3” |
| Description | Purpose, assumptions or a relevant risk | Repeating the title without context |
| Steps | Exact actions, controls and test data references | “Test checkout” |
| Expected Result | The visible/data outcome that establishes success | “It works” |
| References | Requirement, design, fixture or issue links | Credentials or access tokens |
| Priority | The team's agreed execution priority | Treating priority as defect severity |

Rich-text fields support ordinary emphasis, lists and links. Imported/pasted content is sanitized; scripts, unsafe links and arbitrary formatting should not be expected to survive. Keep a document link rather than embedding a large report into a field.

## Example: an observable case

**Title:** Submit a valid delivery address  
**Description:** Verify address acceptance without placing a second order. Preconditions: cart C-01, customer U-01, staging build B-123.  
**Steps:** Open Delivery; enter address fixture A-01; select Continue once.  
**Expected Result:** Review displays the address from A-01, preserves the cart total, and shows no validation error.  
**References:** REQ-CHECKOUT-07 and fixture A-01.  
**Priority:** High.

The fixture identifier refers to test data your team controls. The workspace does not create that customer or address automatically.

## Separate expected and observed behavior

Write expected behavior during design. During execution, mark the status and use the defect report for the actual mismatch, reproduction details and impact. Do not rewrite the expected result to make a failed test look passed.

If the requirement is unclear, record the uncertainty, obtain a decision, update the versioned template, and run the revised case. A guess is not a reliable oracle.

## Review before execution

Ask another person to execute the case without verbal instructions. They should identify the starting state, action, expected result, and cleanup. Split steps whose outcome cannot be attributed to one logical action, while keeping tiny mechanical clicks together when they represent one action.
