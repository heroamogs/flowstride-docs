# API command index

Flowstride's API adapter uses Undici. Relative endpoints use `BASE_URL` from `.env` or configured `baseUrl`. API and browser commands can share the same `.flow` file and extracted/generated data; see [API and UI in one flow](/guide/api-and-ui).

| Task | Reference |
| --- | --- |
| Read | [flow.get](/flow-language/flow-commands/flow.get) |
| Create | [flow.post](/flow-language/flow-commands/flow.post) |
| Replace/update | [flow.put](/flow-language/flow-commands/flow.put), [flow.patch](/flow-language/flow-commands/flow.patch) |
| Delete | [flow.delete](/flow-language/flow-commands/flow.delete) |
| GraphQL | [flow.graphql](/flow-language/flow-commands/flow.graphql) |
| Retain response data | [flow.extract](/flow-language/flow-commands/flow.extract) |
| Check results | [flow.expect](/flow-language/flow-commands/flow.expect) |

```flow
flow.post "/api/orders" with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}" with reqBody
"""
{
  "sku": "DOCS-001",
  "quantity": 1
}
"""
flow.expect status "201";
flow.expect resBody "id" not.empty;
flow.extract resBody "id" as "orderId";
```

Use strict camelCase for `reqBody`, `reqHeader`, `resBody`, `resHeader`, and `responseTime`. Triple-quoted [docstrings](/flow-language/getting-started/docstrings) keep JSON readable. Assert a response before relying on data extracted from it.

[Browser network routes](/guide/native-browser-workflows#mock-requests-and-wait-for-network-events) affect browser traffic, not these direct API calls. API calls and a browser page are separate clients. Do not assume every cookie/token from one is automatically active in the other; use an explicit session workflow and verify the resulting application behavior.
