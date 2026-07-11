# flow.put

## Introduction

`flow.put` is a **Flow Command** that sends an HTTP **PUT** request to an API endpoint.

It is primarily used to update or completely replace an existing resource on the server. Flowstride's native API engine allows you to perform backend updates directly from your Scenario without writing JavaScript or integrating external HTTP libraries.

Like every API command in Flowstride, the response is automatically stored in memory, making it immediately available to commands such as `flow.expect` and `flow.extract`.

---

## The Problem It Solves

Real-world automation frequently requires updating existing data before continuing with the remainder of a test.

Common examples include:

- Updating a user's profile
- Modifying account information
- Changing application settings
- Updating product inventory
- Editing configuration records

Traditional automation often requires external HTTP libraries, custom request builders, asynchronous JavaScript, and manual JSON parsing.

`flow.put` makes backend updates a native part of the Flowstride language, allowing API and UI automation to work together inside a single Scenario.

---

## How flow.put Works

Flowstride routes every PUT request through its native API engine before automatically caching the response for later commands.

### 1. Smart URL Resolution

Flowstride determines whether the supplied endpoint is an absolute or relative URL.

If the endpoint begins with `http`, it is used exactly as provided.

```flow
flow.put "https://api.example.com/users/1";
```

If a relative endpoint is supplied, Flowstride automatically prefixes it with the configured `baseUrl`.

```flow
flow.put "/users/1";
```

---

### 2. Native Request Assembly

The parser natively understands API request modifiers and builds the HTTP request directly from your Flow script.

Supported modifiers include:

- `with reqHeader`
- `with reqBody`

Multiple request headers may be supplied.

The parser also enforces strict camelCase syntax.

Correct:

```flow
with reqBody
```

Incorrect:

```flow
with reqbody
```

---

### 3. Automatic JSON Handling

When a request body is supplied, Flowstride automatically sends it as JSON.

If you do not specify a `Content-Type`, Flowstride automatically applies:

```text
Content-Type: application/json
```

You may still override this by supplying your own `Content-Type` header.

---

### 4. Automatic Authentication Recovery

If an authenticated request receives a **401** or **403** response, Flowstride can automatically refresh the authentication state and retry the request.

This process happens transparently without requiring additional commands in your Scenario.

---

### 5. Automatic API Telemetry

Every PUT request automatically generates execution telemetry.

Flowstride records:

- Endpoint URL
- Request headers
- Request body
- Response status
- Response headers
- Response body
- Response time
- Generated cURL command

This information powers Flowstride's API reporting and debugging experience.

---

### 6. Automatic Response Memory

After the request completes, Flowstride stores the response in its API state.

Commands such as:

- `flow.expect`
- `flow.extract`

operate directly on this cached response without issuing another network request.

---

## Syntax

Basic PUT request.

```flow
flow.put "/users/1";
```

PUT request with a JSON body.

```flow
flow.put "/users/1"
    with reqBody
    """
    {
        "name": "John Doe"
    }
    """;
```

PUT request with custom headers.

```flow
flow.put "/users/1"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}",
        "Content-Type": "application/json"
    }
    """
    with reqBody
    """
    {
        "name": "John Doe"
    }
    """;
```

---

## Parameters

| Parameter        | Required | Description                                              |
| ---------------- | :------: | -------------------------------------------------------- |
| Endpoint         |    ✅    | The API endpoint to update. Can be relative or absolute. |
| `with reqHeader` | Optional | Adds one or more request headers.                        |
| `with reqBody`   | Optional | Supplies the JSON payload sent with the request.         |

---

## Examples

### Update a user profile

```flow
Feature: User Profile

Scenario: Update user information

Given "Update the user's profile"
    flow.put "{{env.API_URL}}"
    with reqHeader
    """
    {
        "Content-Type": "application/json",
        "Connection": "keep-alive"
    }
    """
    with reqBody
    """
    {
        "id": 1,
        "title": "Test",
        "body": "This is a test body",
        "userId": 1
    }
    """

When "Confirm the request succeeds"
    flow.expect status "200";

And "Verify the updated ID"
    flow.expect resBody "id" equals "1";

Then "Verify the updated body"
    flow.expect resBody "body" equals "This is a test body";
```

---

### Update data and extract a value

```flow
Feature: Product Management

Scenario: Update product details

When "Update the product"
    flow.put "/api/products/12"
    with reqBody
    """
    {
        "price": 99.99
    }
    """

When "Store the updated product ID"
    flow.extract resBody "id" as "productId";

Then "The request succeeds"
    flow.expect status "200";
```

---

### Update a secured resource

```flow
Feature: Secure API

Scenario: Update account settings

When "Submit the update request"
    flow.put "/api/settings"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}"
    }
    """
    with reqBody
    """
    {
        "notifications": true
    }
    """

Then "The update succeeds"
    flow.expect status "200";

And "Notifications are enabled"
    flow.expect resBody "notifications" to.be "true";
```

---

## When to Use flow.put

Use `flow.put` whenever your Scenario needs to update an existing resource through an API.

Typical use cases include:

- Updating user profiles
- Editing account information
- Modifying application settings
- Updating products or inventory
- Changing configuration data
- Preparing backend state before UI automation

---

## Important Notes

::: info Relative URLs use the configured baseUrl

If the endpoint does not begin with `http`, Flowstride automatically prefixes it with the configured `baseUrl`.

:::

::: info Automatic JSON requests

Request bodies are automatically sent as JSON unless you explicitly specify another `Content-Type`.

:::

::: info Automatic response storage

Every response is automatically stored in Flowstride's API state, making it immediately available to:

- `flow.expect`
- `flow.extract`

:::

::: info Built-in API telemetry

Flowstride automatically records every request and response for reporting, debugging, and replay.

:::

---

## Common Mistakes

::: warning Use `reqBody` for update payloads

PUT requests that update resources typically require a request body.

Correct:

```flow
flow.put "/users/1"
    with reqBody
    """
    {
        "name": "John"
    }
    """;
```

:::

::: warning Extract from the latest response

`flow.extract` always operates on the most recent API response stored in memory.

If multiple requests are executed, extraction uses the latest response.

:::

---
