# API testing and reusable response data

Use HTTP and GraphQL commands to prepare data, test a contract, extract values and continue through the UI. OS and Cloud share these base commands. The direct API adapter and the browser are separate clients.

## Methods, headers and a JSON body

This example assumes your application implements an authorized test customer API:

```flow
Feature: Customer API contract

  Scenario: Create and read a customer
    Given "A customer is created"
      flow.post "/api/customers" with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}" with reqBody
      """
      {
        "email": "$randomEmail@example.test",
        "name": "Documentation Reader"
      }
      """
      flow.expect status "201";
      flow.expect resBody "id" not.empty;
      flow.extract resBody "id" as "customerId";

    When "The same customer is requested"
      flow.get "/api/customers/@customerId" with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}";

    Then "The response matches the prepared record"
      flow.expect status "200";
      flow.expect resBody "email" equals "@randomEmail@example.test";
      flow.expect resBody "name" to.not.be "A different customer";
      flow.expect resHeader "content-type" matches "application/json";
```

Set `BASE_URL` and `API_TOKEN` in `.env` or CI secrets. `flow.put` replaces/updates, `flow.patch` partially updates, and `flow.delete` removes according to your API's contract. A 4xx/5xx response can be a valid transport result; assert the expected HTTP status and body.

Each direct request replaces the adapter's current response. Assert and extract the data you need before issuing another request. Browser-captured traffic has its own logs and does not replace this state.

## Assert a response precisely

```flow
flow.expect resBody "user" type.of "object" has.key "id";
flow.expect resBody "user.email" format "email";
flow.expect resBody "user.active" equals "true";
flow.expect resBody "roles" type.of "array" includes "reader";
flow.expect resBody "roles" does.not.include "administrator";
flow.expect resBody "roles" length.greaterthan "0";
flow.expect resBody "balance" greaterthan "0";
flow.expect resBody "errors" is.empty;
flow.expect responseTime lessthan "1000";
```

Use these against an endpoint that actually returns the shown schema. `resBody` paths support dotted properties and numeric indexes, such as `items[0].id`; they are not a complete JSONPath language.

| Operator family | Meaning |
| --- | --- |
| `equals` | Compare the string representation with the expected string |
| `to.be` / `is` | For a reserved type name, check type; otherwise compare a literal |
| `to.not.be` / `is.not` | Negate that type or literal comparison |
| `type.of` / `format` | Check a supported type or format, including email/UUID/URL/date/hex |
| `matches` | Regular expression over the value's string representation |
| `greaterthan` / `lessthan` | Strict numeric comparison for body/header values |
| `length`, `length.greaterthan`, `length.lessthan` | String/array length |
| `includes` / `does.not.include` | String or array membership; expected DSL arguments are strings |
| `has.key` / `does.not.have.key` | Object key presence/absence |
| `is.empty` / `not.empty` | Empty/missing versus populated value |

Reserved type names include `string`, `number`, `boolean`, `array`, `object`, `null` and `undefined`. Prefer explicit `equals` when a literal happens to be a type name. For a string substring or pattern, use `matches`; legacy API `contains` syntax is not interchangeable with the UI modifier.

`responseTime` measures the adapter request in milliseconds. Its threshold accepts equality at the boundary despite the `lessthan` spelling. It is not a concurrent load test. Unsupported expectation types and conditions fail explicitly.

Try an intentional mismatch such as `flow.expect resBody "name" to.not.be "Documentation Reader";` against the example's actual reader. It must fail; restore the passing expectation afterward.

## GraphQL variables and application errors

A GraphQL request can use raw query text or a JSON request body. A JSON envelope carries variables and an operation name:

```flow
flow.graphql "/graphql" with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}" with reqBody
"""
{
  "query": "mutation RenameCustomer($id: ID!, $name: String!) { renameCustomer(id: $id, name: $name) { id name } }",
  "operationName": "RenameCustomer",
  "variables": {
    "id": "@customerId",
    "name": "Updated Reader"
  }
}
"""
flow.expect status "200";
flow.expect resBody "errors" is.empty;
flow.expect resBody "data.renameCustomer.name" equals "Updated Reader";
```

Adapt the schema, mutation and authorization. HTTP 200 alone does not establish GraphQL success; assert `errors` and the expected `data` path.

## Cookie API login followed by a browser session

For an application that authenticates with a compatible `Set-Cookie` response, make the session transfer explicit:

```flow
Feature: API cookie login and browser verification

  Scenario: Reuse an authenticated cookie snapshot
    Given "The application origin is open"
      flow.open "/login";

    When "The test account authenticates through the API"
      flow.post "/api/login" with reqBody
      """
      {
        "email": "{{env.TEST_EMAIL}}",
        "password": "{{env.TEST_PASSWORD}}"
      }
      """
      flow.expect status "200";
      flow.expect cookie "session" not.empty;
      flow.save session "api-reader";
      flow.use session "api-reader";
      flow.open "/account";

    Then "The browser is authenticated"
      flow.expect visible "My account";
```

The worker incorporates compatible cookies from the latest direct API response when saving. The application origin, cookie name/domain/path and Secure rules must match the target. This is not automatic bearer-token conversion or a universal browser/API cookie-jar sync. Saved sessions include sensitive values; see [session storage and origin rules](/flow-language/getting-started/sessions).

Use [the included local API + UI example](/guide/working-examples) for a runnable contract, or [signup and OTP](/guide/api-and-ui) for a fuller application journey.
