# flow.extract

Save part of the current API response or a browser element into a flow-file variable. Later scenarios in that file can reuse local extracted values; the next file starts fresh.

```flow
flow.extract resBody "user.id" as "userId";
flow.extract resHeader "x-request-id" as "requestId";
flow.extract cookie "session" as "sessionCookie";
flow.extract text "#order-title" as "orderTitle";
flow.extract value input "Email" as "enteredEmail";
flow.extract attribute "#order" "data-order-id" as "orderId";
```

Use `@userId` to refer to local extracted data. `as global "userId"` stores an explicitly global value retrieved as `@global[userId]` in the same process.

API body paths support dotted keys and numeric array indices, not every possible JSONPath query. Supported API extraction targets are `resBody`, `resHeader` and `cookie`; `reqBody`/`reqHeader` are not accepted extraction targets in the current parser.

Extraction is not an assertion. Check response status and the extracted result before relying on it. [Variables and scope](/flow-language/getting-started/variables) explains lifetime and parallel-worker boundaries.
