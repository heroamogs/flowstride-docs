# Requirements and coverage

Traceability answers: which requirement was tested, by which case, on which build, and with what evidence? Flowstride has useful fields for those links; a complete requirement-management workflow remains a team practice.

## Use stable identifiers

Put a plan ID in **Test Plan**, requirement/design links in each step's **References**, and a clear version on the design. Include the product build and data identifiers in the test notes or defect report.

A practical mapping might look like this:

| Requirement | Manual case | Critical check | Evidence |
| --- | --- | --- | --- |
| REQ-CART-01 | Checkout registered customer v1.0 | Item, quantity and total match | Cart reference + submitted run |
| REQ-ORDER-04 | Checkout registered customer v1.0 | Exactly one order is created | Confirmation and history evidence |
| REQ-ORDER-05 | Retry after slow response v1.0 | Retry does not duplicate order | Separate failure/recovery run |

Maintain this matrix in your existing issue tracker, test plan or repository document. The table is an example team artifact, not an automatically generated Flowstride report.

## Keep coverage honest

A requirement link proves intent, not successful verification. A case with Blocked, Skipped, Current or Pending steps has not fully established the behavior. Preserve failures and retests rather than replacing history with only the last green result.

## Review impact when requirements change

Locate the linked cases, review expected results and fixtures, update the design version, and rerun affected coverage. Record why an expectation changed. An assertion weakened merely to get a pass is not evidence that the product is correct.

## Current product boundary

The Requirement palette entry does not establish a full requirement catalog, bidirectional traceability, coverage calculation or approval workflow. Use the fields and file records described here, and keep the authoritative requirement decision in your team's existing system.
