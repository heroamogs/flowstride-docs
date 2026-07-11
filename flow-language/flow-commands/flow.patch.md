# flow.patch

## Introduction

`flow.patch` is a **Flow Command** that sends an HTTP **PATCH** request to an API endpoint.

Unlike `flow.put`, which typically replaces an entire resource, `flow.patch` is designed to update only specific fields of an existing resource. Flowstride's native API engine allows partial updates to be performed directly inside your Scenario without writing JavaScript or integrating external HTTP libraries.

Like every API command, the response is automatically stored in memory, making it immediately available to commands such as `flow.expect` and `flow.extract`.

---

## The Problem It Solves

Many modern APIs support partial resource updates through the HTTP PATCH method.

Typical examples include:

- Updating a user's display name
- Changing an account status
- Editing a single profile field
- Updating an order status
- Toggling feature flags
- Modifying application preferences

Without native support, automation engineers often need to write JavaScript request wrappers, manually build HTTP payloads, and parse responses before continuing with the rest of the test.

`flow.patch` removes that complexity by making partial API updates a native part of the Flowstride language.

---

## How flow.patch Works

Flowstride routes every PATCH request through its native API engine before automatically caching the response for later commands.

### 1. Smart URL Resolution

Flowstride determines whether the supplied endpoint is absolute or relative.

If the endpoint begins with `http`, it is used exactly as provided.

```flow
flow.patch "https://api.example.com/users/1";
```

If a relative endpoint is supplied, Flowstride automatically prefixes it with the configured `baseUrl`.

```flow
flow.patch "/users/1";
```

---

### 2. Native Request Assembly

The parser understands API request modifiers directly from your Flow script.

Supported modifiers include:

- `with reqHeader`
- `with reqBody`

Multiple request headers may be supplied.

Flowstride also enforces strict camelCase syntax.

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

When a request body is supplied, Flowstride automatically applies:

```text
Content-Type: application/json
```

unless you explicitly provide another `Content-Type`.

This removes boilerplate while still allowing complete control over request headers.

---

### 4. Automatic Authentication Recovery

If an authenticated request receives a **401** or **403** response and an authentication handler has been configured, Flowstride automatically refreshes the authentication state and retries the request.

This process happens transparently without requiring additional commands in your Scenario.

---

### 5. Automatic API Telemetry

Every PATCH request is automatically recorded.

Flowstride captures:

- Endpoint URL
- Request headers
- Request body
- Response headers
- Response body
- Response status
- Response time
- Generated cURL command

This information powers Flowstride's reporting and debugging experience.

---

### 6. Automatic Response Memory

After the request completes, Flowstride stores the response in its API state.

Commands such as:

- `flow.expect`
- `flow.extract`

operate directly on this cached response without issuing another network request.

---

## Syntax

Basic PATCH request.

```flow
flow.patch "/users/1";
```

PATCH request with a JSON body.

```flow
flow.patch "/users/1"
    with reqBody
    """
    {
        "title": "Testing"
    }
    """;
```

PATCH request with custom headers.

```flow
flow.patch "/users/1"
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
        "title": "Testing"
    }
    """;
```

---

## Parameters

| Parameter        | Required | Description                                                |
| ---------------- | :------: | ---------------------------------------------------------- |
| Endpoint         |    ✅    | The API endpoint to update. Can be relative or absolute.   |
| `with reqHeader` | Optional | Adds one or more request headers.                          |
| `with reqBody`   | Optional | Supplies the JSON payload containing the fields to update. |

---

## Examples

### Update part of a resource

```flow
Feature: User Profile

Scenario: Update the user's profile

When "Update (PATCH) the user profile"
    flow.patch "{{env.API_URL}}"
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
        "title": "Testing"
    }
    """

When "Confirm the status code is 200"
    flow.expect status "200";

And "Verify the user ID"
    flow.expect resBody "userId" equals "1";

Then "Verify the updated title"
    flow.expect resBody "title" equals "Testing";
```

---

### Update a single account setting

```flow
Feature: Account Settings

Scenario: Enable email notifications

When "Update notification settings"
    flow.patch "/api/settings"
    with reqBody
    """
    {
        "emailNotifications": true
    }
    """

Then "The request succeeds"
    flow.expect status "200";

And "Email notifications are enabled"
    flow.expect resBody "emailNotifications" to.be "true";
```

---

### Update a secured resource

```flow
Feature: Secure API

Scenario: Update user preferences

When "Submit the update request"
    flow.patch "/api/preferences"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}"
    }
    """
    with reqBody
    """
    {
        "theme": "dark"
    }
    """

Then "The request succeeds"
    flow.expect status "200";

And "The theme was updated"
    flow.expect resBody "theme" equals "dark";
```

---

## When to Use flow.patch

Use `flow.patch` whenever your Scenario needs to update only part of an existing resource.

Typical use cases include:

- Editing profile information
- Updating user preferences
- Changing account settings
- Updating resource status
- Toggling feature flags
- Performing partial backend updates before UI automation

---

## Important Notes

::: info Partial updates

`flow.patch` is intended for updating specific fields of an existing resource rather than replacing the entire object.

:::

::: info Relative URLs use the configured baseUrl

If the endpoint does not begin with `http`, Flowstride automatically prefixes it with the configured `baseUrl`.

:::

::: info Automatic response storage

Every response is automatically cached, allowing immediate use with:

- `flow.expect`
- `flow.extract`

:::

::: info Built-in API telemetry

Flowstride automatically records every PATCH request and response for reporting and debugging.

:::

---

## Common Mistakes

::: warning Use PATCH for partial updates

Use `flow.patch` when only a subset of fields needs to change.

If your API expects the complete resource to be replaced, use `flow.put` instead.

:::

::: warning Extract from the latest response

`flow.extract` always operates on the most recent API response stored in memory.

If multiple requests are executed, extraction uses the latest response.

:::

---
