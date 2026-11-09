# flow.extract

Save part of the current API response or a browser element into a flow-file variable. Later scenarios in that file can reuse local extracted values; the next file starts fresh.

```flow
flow.extract resBody "user.id" as "userId";
flow.extract resHeader "x-request-id" as "requestId";
flow.extract cookie "session" as "sessionCookie";
flow.extract text "Order title" as "orderTitle";
flow.extract value input "Email" as "enteredEmail";
flow.extract attribute "#order" "data-order-id" as "orderId";
```

Use `@userId` to refer to local extracted data. `as global "userId"` stores an explicitly global value retrieved as `@global[userId]` in the same process.

API body paths support dotted keys and numeric array indices, not every possible JSONPath query. Supported API extraction targets are `resBody`, `resHeader` and `cookie`; `reqBody`/`reqHeader` are not accepted extraction targets in the current parser.

Extraction is not an assertion. Check response status and the extracted result before relying on it. [Variables and scope](/flow-language/getting-started/variables) explains lifetime and parallel-worker boundaries.

## Browser properties

Read a browser property into a variable. For example, type a malformed address into an HTML email input labelled Email inside Checkout. The browser stores its validity flag as a boolean. You can save that flag and assert it later.

```flow
flow.type input "Email" "samuel.me";
flow.extract property input "Email" inside "Checkout" "validity.typeMismatch" as "emailMismatch";
flow.assert.value {
  "actual": "@emailMismatch",
  "operator": "equals",
  "expected": true
};
```

Use a readable label and an element or spatial qualifier when needed. Use an explicit selector if the element has no reliable readable target. A property path can use nested fields and numeric indices. It cannot execute functions or access browser globals.

## Captured network data

Extract a field from a named browser event after `flow.network.wait`. Here Place order makes a POST that returns an `orderId`, and the test reuses that ID in a visible-text check.

```flow
flow.network.arm {
  "name": "orderResponse",
  "url": "**/api/orders",
  "method": "POST"
};
flow.click button "Place order";
flow.network.wait { "name": "orderResponse" };
flow.extract network "orderResponse" "body.orderId" as "orderId";
flow.expect visible "Order @orderId placed";
```

The extraction reads captured data. It neither sends another request nor checks whether the ID is correct. Use [`flow.network.expect`](/reference/assertions#flow-network-expect) to verify the captured response and [`flow.assert.value`](/reference/assertions#flow-assert-value) to check the stored value with its JSON type.
