# flow.extract

## Introduction

`flow.extract` is a **Flow Command** that retrieves values from the most recent API response and stores them in Flowstride variables.

Whether you need to capture a generated user ID, authentication token, session cookie, request identifier, or any other dynamic value, `flow.extract` allows you to reuse that data throughout your Flowstride Scenario without writing JavaScript or manually parsing JSON.

---

## The Problem It Solves

Modern API workflows rarely consist of isolated requests.

Most real-world scenarios require data from one request to be reused in another. For example:

- Creating a user and using the generated ID in a subsequent request.
- Logging in and reusing the returned authentication token.
- Capturing a session cookie for authenticated requests.
- Extracting data from an API response and using it in a browser interaction.

Traditional automation requires writing JavaScript variables, parsing JSON objects, navigating nested structures, and manually handling HTTP headers and cookies.

`flow.extract` removes that complexity by making response data a first-class part of the Flowstride language.

---

## How flow.extract Works

Flowstride automatically stores the most recent API response in memory.

When `flow.extract` executes, it retrieves values directly from that stored response without issuing another network request.

### 1. Strict Target Validation

The parser strictly validates extraction targets.

Supported targets are:

- `resBody`
- `resHeader`
- `cookie`

Flowstride also enforces strict camelCase syntax.

For example:

✅ Correct

```flow
flow.extract resBody "user.id" as "userId";
```

❌ Invalid

```flow
flow.extract resbody "user.id" as "userId";
```

---

### 2. Deep JSON Traversal

When extracting from the response body, Flowstride navigates nested JSON structures using a built-in JSON path resolver.

Nested objects are fully supported.

```flow
flow.extract resBody "data.user.credentials.token" as "token";
```

Arrays are also supported.

```flow
flow.extract resBody "users[0].email" as "primaryEmail";
```

Flowstride automatically resolves array indexes during extraction.

---

### 3. Automatic Header & Cookie Parsing

Headers are retrieved directly from the stored response.

Header names are matched case-insensitively.

For example:

```flow
flow.extract resHeader "X-Request-Id" as "requestId";
```

For cookies, Flowstride automatically parses the `Set-Cookie` response headers, locates the requested cookie, and extracts only the cookie value.

Cookie metadata such as:

- Path
- Secure
- HttpOnly
- SameSite

is automatically ignored.

---

### 4. Scoped Variable Storage

Extracted values are stored in Flowstride's variable engine.

By default, values are stored as **local variables** and remain available throughout the current Flow file.

Adding the `global` modifier stores the value as a **global variable**, making it available across multiple Flow files during the test run.

---

### 5. Intelligent Error Reporting

If an extraction cannot be completed, Flowstride throws a detailed error rather than returning an undefined value.

The runtime reports:

- The failed extraction path
- The HTTP response status
- A truncated portion of the response body

This helps quickly identify incorrect JSON paths or unexpected API responses.

---

### 6. Automatic Response Memory

`flow.extract` never performs another API request.

Instead, it operates on the most recent API response already stored in memory.

This allows commands such as:

```flow
flow.post ...
flow.extract ...
flow.expect ...
```

to work together naturally without additional network calls.

---

## Syntax

Extract a value from the response body.

```flow
flow.extract resBody "data.user.id" as "userId";
```

Extract a response header.

```flow
flow.extract resHeader "X-Request-Id" as "requestId";
```

Extract a cookie.

```flow
flow.extract cookie "SessionId" as "sessionId";
```

Store the extracted value globally.

```flow
flow.extract resBody "token" as global "accessToken";
```

---

## Parameters

| Parameter     | Required | Description                                                        |
| ------------- | :------: | ------------------------------------------------------------------ |
| Target        |    ✅    | The source to extract from (`resBody`, `resHeader`, or `cookie`).  |
| Path / Key    |    ✅    | JSON path, header name, or cookie name to retrieve.                |
| `as`          |    ✅    | Assigns the extracted value to a Flowstride variable.              |
| `global`      | Optional | Stores the value as a global variable instead of a local variable. |
| Variable Name |    ✅    | The destination variable.                                          |

---

## Examples

### Extract a generated user ID

Capture a user ID from the response body and reuse it in another request.

```flow
Feature: User Management

Scenario: Create a new user

Given "Create a user"
  flow.post "/api/users" with reqBody;
  """
  {
      "name": "John Doe"
  }
  """

When "Store the generated user ID"
  flow.extract resBody "data.user.id" as "userId";

And "The request succeeds"
  flow.expect status "200";

Then "Retrieve the created user"
  flow.get "/api/users/@userId";
```

---

### Extract an authentication cookie

Retrieve a session cookie after login.

```flow
Feature: Authentication

Scenario: Capture the session cookie

Given "Authenticate the user"
  flow.post "/api/login" with reqBody;
  """
  {
      "email": "admin@example.com",
      "password": "Password123"
  }
  """

When "Store the session cookie"
  flow.extract cookie "SessionId" as global "sessionCookie";

Then "Authentication succeeds"
  flow.expect status "200";
```

---

### Extract a response header

Capture a request identifier returned by the server.

```flow
Feature: Request Tracking

Scenario: Capture the request ID

Given "Call the tracking endpoint"
  flow.get "/api/track";

When "Store the request identifier"
  flow.extract resHeader "X-Request-Id" as "requestId";

Then "The request succeeds"
  flow.expect status "200";
```

---

## When to Use flow.extract

Use `flow.extract` whenever you need to reuse dynamic values returned by an API, including:

- Generated IDs
- Authentication tokens
- Session cookies
- Response headers
- Nested JSON values
- Data shared between API and UI workflows

---

## Important Notes

::: info Uses the latest API response

`flow.extract` always operates on the most recent API response stored in memory.

It does not perform another network request.

:::

::: info Supports nested JSON

Complex JSON structures and array indexes are supported.

For example:

```flow
flow.extract resBody "users[0].email" as "email";
```

:::

::: info Local and global variables

By default, extracted values are stored as local variables.

Use the `global` modifier when the value needs to be shared across multiple Flow Scenarios.

:::

::: info Automatic cookie parsing

Flowstride automatically parses `Set-Cookie` headers and extracts only the requested cookie value.

You do not need to manually split cookie strings.

:::

---

## Common Mistakes

::: warning Use the correct extraction target

Only the following targets are supported:

- `resBody`
- `resHeader`
- `cookie`

Using any other target results in a parser error.

:::

::: warning Extract before using the variable

Always extract a value before referencing it.

Correct:

```flow
flow.extract resBody "token" as "accessToken";
flow.expect resBody "token" equals "@accessToken";
```

:::

---
