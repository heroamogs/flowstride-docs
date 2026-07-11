# flow.delete

## Introduction

`flow.delete` is a **Flow Command** that sends an HTTP **DELETE** request to an API endpoint.

It is used to remove resources from a backend service directly within your Flowstride Scenario. Whether you're deleting users, removing records, cleaning up test data, or resetting application state, `flow.delete` allows you to perform these operations without writing JavaScript or integrating external HTTP libraries.

Like every API command, the response is automatically stored in Flowstride's API memory, making it immediately available to commands such as `flow.expect` and `flow.extract`.

---

## The Problem It Solves

Automated tests frequently need to remove data after it has been created.

Typical scenarios include:

- Deleting test users
- Removing temporary records
- Cleaning up seeded data
- Resetting application state
- Removing obsolete resources before another test begins

Without native API support, engineers often need separate cleanup scripts, external HTTP clients, or custom JavaScript utilities.

`flow.delete` makes backend cleanup a native part of the Flowstride language, allowing resource creation, validation, and deletion to occur within a single Scenario.

---

## How flow.delete Works

Flowstride routes every DELETE request through its native API engine before automatically caching the response for later commands.

### 1. Smart URL Resolution

Flowstride determines whether the supplied endpoint is absolute or relative.

If the endpoint begins with `http`, it is used exactly as provided.

```flow
flow.delete "https://api.example.com/users/1";
```

If a relative endpoint is supplied, Flowstride automatically prefixes it with the configured `baseUrl`.

```flow
flow.delete "/users/1";
```

---

### 2. Native Header Support

The parser natively understands request headers directly from your Flow script.

Headers are supplied using the `reqHeader` modifier.

Single headers are supported.

```flow
flow.delete "/users/1"
    with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}";
```

Multiple headers may also be supplied.

```flow
flow.delete "/users/1"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}",
        "Content-Type": "application/json"
    }
    """
```

Flowstride enforces strict camelCase syntax.

Correct:

```flow
with reqHeader
```

Incorrect:

```flow
with reqheader
```

---

### 3. Automatic Authentication Recovery

If an authenticated request receives a **401** or **403** response and an authentication handler has been configured, Flowstride automatically refreshes the authentication state and retries the request.

This recovery happens transparently without requiring additional commands in your Scenario.

---

### 4. Automatic API Telemetry

Every DELETE request is automatically recorded.

Flowstride captures:

- Endpoint URL
- Request headers
- Response status
- Response headers
- Response body
- Response time
- Generated cURL command

This information powers Flowstride's API reporting and debugging experience.

---

### 5. Automatic Response Memory

After the request completes, Flowstride stores the response in its API state.

Commands such as:

- `flow.expect`
- `flow.extract`

operate directly on this cached response without issuing another network request.

---

## Syntax

Basic DELETE request.

```flow
flow.delete "/users/1";
```

DELETE request with headers.

```flow
flow.delete "/users/1"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}"
    }
    """
```

---

## Parameters

| Parameter        | Required | Description                                              |
| ---------------- | :------: | -------------------------------------------------------- |
| Endpoint         |    ✅    | The API endpoint to delete. Can be relative or absolute. |
| `with reqHeader` | Optional | Adds one or more request headers.                        |

---

## Examples

### Delete an existing resource

```flow
Feature: User Management

Scenario: Delete a user

Given "Delete the user profile"
    flow.delete "{{env.API_URL}}"

When "Confirm the status code is 200"
    flow.expect status "200";

Then "Verify the title has been removed"
    flow.expect resBody "title" is.empty;
```

---

### Delete a protected resource

```flow
...
When "Delete the account"
    flow.delete "/api/accounts/42"
    with reqHeader
    """
    {
        "Authorization": "Bearer {{env.API_TOKEN}}"
    }
    """

Then "The request succeeds"
    flow.expect status "200";
```

---

### Clean up test data

```flow
...
When "Delete the temporary record"
    flow.delete "/api/test-data/100";

Then "The record is successfully removed"
    flow.expect status "200";
```

---

## When to Use flow.delete

Use `flow.delete` whenever your Scenario needs to remove existing resources from an API.

Typical use cases include:

- Deleting test users
- Cleaning up temporary data
- Removing obsolete records
- Resetting application state
- Performing backend cleanup after a Scenario

---

## Important Notes

::: info Relative URLs use the configured baseUrl

If the endpoint does not begin with `http`, Flowstride automatically prefixes it with the configured `baseUrl`.

:::

::: info Automatic response storage

Every DELETE response is automatically stored in Flowstride's API state, allowing immediate use with:

- `flow.expect`
- `flow.extract`

:::

::: info Built-in API telemetry

Flowstride automatically records every DELETE request and response for reporting, debugging, and replay.

:::

---

## Common Mistakes

::: warning DELETE requests do not use request bodies

`flow.delete` is intended to identify the resource through the endpoint URL.

If your API requires data to be submitted with the request, use the appropriate HTTP method supported by your API, such as `flow.post`, `flow.put`, or `flow.patch`.

:::

::: warning Extract from the latest response

`flow.extract` always operates on the most recent API response stored in memory.

If multiple requests are executed, extraction uses the latest response.

:::

---
