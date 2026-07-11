# flow.graphql

## Introduction

`flow.graphql` is a **Flow Command** that executes GraphQL operations directly from your Flowstride Scenario.

Whether you're querying data, testing GraphQL APIs, validating schemas, or preparing backend state before UI automation, `flow.graphql` allows you to communicate with GraphQL services without writing JavaScript or importing GraphQL client libraries.

Like every API command, the response is automatically stored in Flowstride's API memory, making it immediately available to commands such as `flow.expect` and `flow.extract`.

---

## The Problem It Solves

Many modern applications expose GraphQL APIs instead of traditional REST endpoints.

Testing these APIs traditionally requires engineers to:

- Install GraphQL client libraries
- Construct HTTP requests manually
- Wrap GraphQL queries inside JSON payloads
- Configure request headers
- Parse JSON responses before using them

`flow.graphql` removes that complexity by allowing GraphQL queries to be written directly inside your Flowstride Scenario.

---

## How flow.graphql Works

Flowstride provides a native GraphQL execution engine built on top of its API adapter.

## Smart URL Resolution

Flowstride first determines whether the supplied endpoint is absolute or relative.

If the endpoint begins with `http`, it is used exactly as provided.

```flow
flow.graphql "https://example.com/graphql";
```

If a relative endpoint is supplied, Flowstride automatically prefixes it with the configured `baseUrl`.

```flow
flow.graphql "/graphql";
```

---

## Native GraphQL Request Parsing

The parser understands GraphQL requests directly from your Flow script.

The GraphQL operation is supplied using the `with reqBody` modifier.

```flow
flow.graphql "/graphql"
    with reqBody
    """
    query {
        countries {
            code
            name
        }
    }
    """
```

No JavaScript objects or GraphQL client libraries are required.

---

## Automatic JSON Handling

If a `Content-Type` header has not been supplied, Flowstride automatically applies:

```text
Content-Type: application/json
```

before sending the request.

---

## Automatic Authentication Recovery

If an authenticated request receives a **401** or **403** response and an authentication handler has been configured, Flowstride automatically refreshes the authentication state and retries the request.

This recovery happens transparently without requiring additional commands in your Scenario.

---

## Automatic API Telemetry

Every GraphQL request automatically generates execution telemetry.

Flowstride records:

- Endpoint URL
- Request headers
- GraphQL query
- Response headers
- Response body
- Response status
- Response time
- Generated cURL command

This information powers Flowstride's API reporting and debugging experience.

---

## Automatic Response Memory

After the request completes, Flowstride stores the response in its API state.

Commands such as:

- `flow.expect`
- `flow.extract`

operate directly on this cached response without issuing another network request.

---

## Syntax

Execute a GraphQL query.

```flow
flow.graphql "/graphql"
    with reqBody
    """
    query {
        countries {
            code
            name
        }
    }
    """
```

GraphQL request with custom headers.

```flow
flow.graphql "/graphql"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}"
    }
    """
    with reqBody
    """
    query {
        countries {
            code
            name
        }
    }
    """
```

---

## Parameters

| Parameter        | Required | Description                                        |
| ---------------- | :------: | -------------------------------------------------- |
| Endpoint         |    ✅    | The GraphQL endpoint. Can be relative or absolute. |
| `with reqHeader` | Optional | Adds one or more request headers.                  |
| `with reqBody`   |    ✅    | The GraphQL query or GraphQL JSON payload.         |

---

## Examples

## Execute a GraphQL query

```flow
Feature: Countries API

Scenario: Query country information

Given "Query the countries API"
    flow.graphql "{{env.GQL_URL}}"
    with reqBody
    """
    query {
        countries {
            code
            name
            capital
            currency
        }
    }
    """

When "Confirm the status code is 200"
    flow.expect status "200";

When "Verify the country code exists"
    flow.expect resBody "data.countries[0].code" not.empty;

Then "Verify the capital is returned"
    flow.expect resBody "data.countries[0].capital" to.be "string";
```

---

## Extract GraphQL data

```flow
Feature: Country Lookup

Scenario: Store the country code

When "Execute the query"
    flow.graphql "/graphql"
    with reqBody
    """
    query {
        countries {
            code
            name
        }
    }
    """

When "Store the first country code"
    flow.extract resBody "data.countries[0].code" as "countryCode";

Then "The query succeeds"
    flow.expect status "200";
```

---

### Query a secured GraphQL endpoint

```flow
Feature: Secure GraphQL

Scenario: Retrieve protected data

When "Execute the secured query"
    flow.graphql "/graphql"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}"
    }
    """
    with reqBody
    """
    query {
        currentUser {
            id
            email
        }
    }
    """

Then "The request succeeds"
    flow.expect status "200";
```

---

## When to Use flow.graphql

Use `flow.graphql` whenever your application exposes a GraphQL API.

Typical use cases include:

- Querying GraphQL services
- Validating GraphQL schemas
- Preparing backend data
- Verifying GraphQL responses
- Extracting GraphQL data for later use
- Combining GraphQL and UI automation within the same Scenario

---

## Important Notes

::: info Automatic JSON support

Flowstride automatically sends GraphQL requests using `Content-Type: application/json` unless you explicitly provide another content type.

:::

::: info Automatic response storage

Every GraphQL response is automatically cached, allowing immediate use with:

- `flow.expect`
- `flow.extract`

without issuing another network request.

:::

::: info Built-in API telemetry

Every GraphQL request and response is automatically recorded for reporting, debugging, and replay.

:::

---

## Common Mistakes

::: warning Always provide a request body

A GraphQL operation requires a query or mutation.

For example:

```flow
flow.graphql "/graphql"
    with reqBody
    """
    query {
        countries {
            code
        }
    }
    """
```

:::

::: warning Extract from the latest response

`flow.extract` always operates on the most recent API response stored in memory.

If multiple API requests are executed, extraction uses the latest response.

:::

---
