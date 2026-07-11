# flow.get

## Introduction

`flow.get` is a **Flow Command** that sends an HTTP GET request to an API endpoint.

It allows you to retrieve resources directly from your backend without writing JavaScript, importing HTTP libraries, or switching to external API tools. The response is automatically stored in Flowstride's API memory, making it immediately available for commands such as `flow.expect` and `flow.extract`.

---

## The Problem It Solves

Modern end-to-end testing is not limited to browser interactions.

Many test scenarios require retrieving data directly from backend services before interacting with the UI or validating application state.

Typical examples include:

- Retrieving a user's profile.
- Fetching account information.
- Verifying backend data after a UI action.
- Preparing test data before opening the browser.

Traditionally, this requires JavaScript HTTP libraries, asynchronous code, manual JSON parsing, and additional test setup.

`flow.get` provides a native API engine that integrates directly into your Flowstride test.

---

## How flow.get Works

Flowstride routes every GET request through its native API engine.

Once executed, the response becomes part of Flowstride's internal API state and can immediately be used by other commands.

### 1. Smart URL Resolution

Flowstride determines whether the supplied URL is absolute or relative.

If the URL begins with `http`, it is used exactly as provided.

```flow
flow.get "https://api.example.com/users";
```

If a relative path is supplied, Flowstride automatically prefixes it with the configured `baseUrl`.

```flow
flow.get "/users";
```

This keeps test scripts concise while allowing environments to be switched through configuration.

---

### 2. Native Header Support

Headers can be supplied directly from your Flow script using the `reqHeader` modifier.

Flowstride converts them into a proper HTTP request without requiring JavaScript objects.

Single headers are supported.

```flow
flow.get "/users"
    with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}";
```

Multiple headers are also supported.

```flow
flow.get "/users"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}",
        "Accept": "application/json"
    }
    """;
```

---

### 3. Automatic API Telemetry

Every GET request automatically generates execution telemetry.

Flowstride records:

- Request URL
- HTTP method
- Request headers
- Response status
- Response headers
- Response body
- Response time
- Generated cURL command

This information appears in reports and execution logs to simplify debugging.

---

### 4. Automatic Response Memory

After the request completes, the response is cached in Flowstride's API state.

Subsequent commands such as:

- `flow.expect`
- `flow.extract`

operate directly on this stored response without performing another network request.

---

### 5. Automatic Authentication Retry

If a request receives an authentication failure (HTTP 401 or 403), Flowstride can automatically invoke the configured unauthorized handler before retrying the request.

This allows authenticated API workflows to continue without manually refreshing tokens.

---

## Syntax

Basic request.

```flow
flow.get "/users";
```

Request with headers.

```flow
flow.get "/users"
    with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}";
```

Multiple headers.

```flow
flow
flow.get "/users"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}",
        "Accept": "application/json"
    }
    """;
```

---

## Parameters

| Parameter        | Required | Description                                        |
| ---------------- | :------: | -------------------------------------------------- |
| URL              |    ✅    | Endpoint to retrieve. May be relative or absolute. |
| `with reqHeader` | Optional | Adds one or more request headers.                  |

---

## Examples

### Retrieve a user profile

```flow
Feature: User API

Scenario: Retrieve an existing user

Given "Retrieve the user profile"
    flow.get "/api/users/42";

When "The request succeeds"
    flow.expect status "200";

Then "The user is active"
    flow.expect resBody "status" equals "active";
```

---

### Retrieve protected data

```flow
Feature: Secure API

Scenario: Retrieve account information

Given "Request the secure endpoint"
    flow.get "/api/account"
        with reqHeader
        """
        {
            "Authorization": "Bearer {{env.API_TOKEN}}"
        }
        """;

When "Authentication succeeds"
    flow.expect status "200";

Then "The response contains an email address"
    flow.expect resBody "email" format "email";
```

---

### Extract data for later use

```flow
Feature: Customer API

Scenario: Retrieve customer information

When "Retrieve customer details"
    flow.get "/api/customer/100";

When "Store the customer ID"
    flow.extract resBody "id" as "customerId";

Then "The customer exists"
    flow.expect status "200";
```

---

## When to Use flow.get

Use `flow.get` whenever your Scenario needs to retrieve information from an API.

Typical use cases include:

- Reading user profiles.
- Fetching configuration.
- Retrieving generated test data.
- Validating backend state.
- Preparing UI tests.
- Supplying data to later API requests.

---

## Important Notes

::: info GET requests automatically cache responses

The response from every `flow.get` request is automatically stored in Flowstride's API memory.

Commands such as `flow.expect` and `flow.extract` operate directly on this cached response.

:::

::: info Relative URLs use the configured baseUrl

If the supplied URL does not begin with `http`, Flowstride automatically prefixes it with the configured `baseUrl`.

:::

::: info Request headers are optional

Headers only need to be supplied when the endpoint requires authentication or additional metadata.

:::

---

## Common Mistakes

::: warning GET requests do not send request bodies

`flow.get` is intended for retrieving resources.

If your endpoint requires a request body, use `flow.post`, `flow.put`, or `flow.patch` instead.

:::

::: warning Extract from the latest response

`flow.extract` always operates on the most recent API response.

If multiple requests are made, extraction uses the latest one.

:::

---
