# flow.post

## Introduction

`flow.post` is a **Flow Command** that sends an HTTP **POST** request to an API endpoint directly from your Flowstride Scenario.

Flowstride includes a native API engine, allowing UI and API automation to live together in a single workflow. Whether you're creating test data, authenticating users, triggering backend processes, or validating business logic, `flow.post` lets you communicate directly with your application's backend without writing JavaScript or integrating external HTTP libraries.

---

## The Problem It Solves

Modern end-to-end testing is rarely limited to browser interactions.

Many scenarios require direct communication with backend services before the UI can be tested. Common examples include:

- Creating users before login
- Seeding databases with test data
- Triggering backend workflows
- Calling internal APIs
- Performing authenticated setup before UI automation begins

Traditional automation frameworks often require engineers to import HTTP libraries, build request wrappers, manually parse JSON responses, and switch between API and UI tooling.

`flow.post` removes that complexity by making HTTP requests a native part of the Flowstride language.

---

## How flow.post Works

Flowstride combines the parser, execution engine, and native API adapter into a unified HTTP pipeline.

### 1. Smart URL Resolution

The runtime first determines whether the supplied endpoint is an absolute or relative URL.

If the endpoint begins with `http`, it is used exactly as provided.

If a relative path is supplied, Flowstride automatically prefixes it with the configured `baseUrl`.

For example:

```flow
flow.post "/users";
```

might automatically resolve to:

```text
https://api.example.com/users
```

depending on your Flowstride configuration.

---

### 2. Request Assembly

The parser natively understands API modifiers and builds the request directly from your Flow script.

Supported modifiers include:

- `with reqHeader`
- `with reqBody`

Multiple request headers may be chained together.

Flowstride also enforces strict camelCase naming.

For example:

✅ Correct

```flow
with reqBody
```

❌ Invalid

```flow
with reqbody
```

---

### 3. Automatic JSON Handling

When a request body is supplied, Flowstride automatically applies:

```text
Content-Type: application/json
```

unless you explicitly provide your own `Content-Type` header.

This removes unnecessary boilerplate while still allowing complete control when custom headers are required.

---

### 4. Automatic Authentication Recovery

If an authenticated request receives a **401** or **403** response and an authentication handler has been configured, Flowstride automatically refreshes the authentication state and retries the request.

This recovery happens transparently without requiring additional commands in your Scenario.

---

### 5. API Telemetry

Every request executed by `flow.post` is automatically recorded.

Flowstride captures:

- Endpoint URL
- Request headers
- Request body
- Response headers
- Response body
- Response status
- Response time
- Generated cURL command

This information powers Flowstride's API reporting and debugging experience.

---

### 6. Response State Caching

After the request completes, Flowstride stores the response in memory.

The cached response immediately becomes available to commands such as:

- `flow.expect`
- `flow.extract`

This allows API responses to flow naturally through the remainder of your Scenario without additional scripting.

---

## Syntax

### Send a POST request

```flow
flow.post "/api/users";
```

### Send a POST request with a request body

```flow
flow.post "/api/users" with reqBody;
"""
{
    "name": "John Doe",
    "role": "admin"
}
"""
```

### Send custom request headers

```flow
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
    "email": "$randomEmail"
}
"""
```

---

## Parameters

| Parameter        | Required | Description                                                                |
| ---------------- | :------: | -------------------------------------------------------------------------- |
| Endpoint         |    ✅    | The API endpoint to receive the POST request. Can be absolute or relative. |
| `with reqHeader` | Optional | Adds a request header.                                                     |
| `with reqBody`   | Optional | Specifies the JSON request body to send.                                   |

---

## Examples

### Create a new user

Create a user through the backend before beginning UI automation.

```flow
Feature: User Management

Scenario: Create a new user

When "Create a new user"
  flow.post "/api/v1/users" with reqBody;
  """
  {
      "name": "Jane Doe",
      "role": "admin"
  }
  """

Then "The request succeeds"
  flow.expect status "201";

And "A user ID is generated"
  flow.expect resBody "data.id" type.of "uuid";
```

---

### Send authenticated requests

Attach custom headers while submitting a JSON payload.

```flow
Feature: Secure API

Scenario: Trigger a secure operation

When "Submit the authenticated request"
  flow.post "/api/v1/sync"
    with reqHeader
    """
    {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Authorization": "Bearer {{env.TOKEN}}"
    }
    """
    with reqBody;
    """
    {
        "forceRefresh": true
    }
    """

Then "The operation succeeds"
  flow.expect status "200";

And "The response confirms success"
  flow.expect resBody "status" equals "success";
```

---

## Important Notes

::: info Automatic response storage

Every response is automatically stored in memory, allowing immediate use with commands such as:

- `flow.expect`
- `flow.extract`

No additional scripting is required.

:::

::: info Built-in telemetry

Every request and response is automatically captured for reporting, debugging, and replay.

:::

---

## Common Mistakes

::: warning Use the correct modifier

Request bodies must use the `reqBody` modifier.

Correct:

```flow
flow.post "/users" with reqBody;
```

Incorrect:

```flow
flow.post "/users" with reqbody;
```

Flowstride enforces strict camelCase syntax.

:::

::: warning Use relative URLs when a baseUrl is configured

Instead of:

```flow
flow.post "https://api.example.com/users";
```

prefer:

```flow
flow.post "/users";
```

when your project already defines a `baseUrl`.

This keeps Scenarios cleaner and easier to maintain.

:::

::: warning Validate API responses

Submitting a request does not automatically verify success.

Always follow a request with assertions such as:

```flow
flow.expect status "201";
```

or

```flow
flow.expect resBody "status" equals "success";
```

to ensure the backend behaved as expected.

:::

---
