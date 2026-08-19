# flow.extract

## Introduction

`flow.extract` is a **Flow Command** that retrieves values from the most recent API response or visible User Interface elements and stores them in Flowstride variables.

Whether you need to capture a generated user ID, authentication token, session cookie, or scrape dynamic text directly from a data table, `flow.extract` allows you to reuse that data throughout your Flowstride Scenario without writing JavaScript or manually parsing JSON.

---

## The Problem It Solves

Modern workflows rarely consist of isolated actions.

Most real world scenarios require data from one step to be reused in another. For example:

- Creating a user and using the generated ID in a subsequent request.
- Logging in and reusing the returned authentication token.
- Capturing a session cookie for authenticated requests.
- Extracting a dynamic patient name from a dashboard table and using it in a browser interaction.

Traditional automation requires writing JavaScript variables, parsing JSON objects, navigating nested structures, and manually locating Document Object Model elements.

`flow.extract` removes that complexity by making data extraction a first class part of the Flowstride language.

---

## How flow.extract Works

Flowstride automatically stores the most recent API response in memory and has direct access to the live Document Object Model.

When `flow.extract` executes, it mathematically retrieves values directly from your chosen target.

### 1. Strict Target Validation

The parser strictly validates extraction targets.

Supported targets are:

- `resBody`
- `resHeader`
- `cookie`
- `text`
- `value`
- `attribute`

Flowstride also enforces strict camelCase syntax.

For example:

✅ Correct

```flow
flow.extract resBody "user.id" as "userId";
flow.extract text "table[0] tr[1] td[9]" as "cellData";
```

❌ Invalid

```flow
flow.extract resbody "user.id" as "userId";
```

---

### 2. Deep JSON Traversal

When extracting from the response body, Flowstride navigates nested JSON structures using a built in JSON path resolver.

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

Header names are matched case insensitively.

For example:

```flow
flow.extract resHeader "X-Request-Id" as "requestId";
```

For cookies, Flowstride automatically parses the `Set-Cookie` response headers, locates the requested cookie, and extracts only the cookie value.

Cookie metadata such as Path, Secure, HttpOnly, and SameSite is automatically ignored.

---

### 4. Smart DOM Extraction

When extracting from the User Interface, Flowstride integrates seamlessly with spatial selectors and Flow Elements (including `table`, `tr`, `td`, and `th`).

You can extract visible text, input field values, or specific HTML attributes.

```flow
// Extract visible text using table coordinates
flow.extract text "table[0] tr[1] td[0]" as "userData";

// Extract the value from an input field
flow.extract value field "Email Address" as "userEmail";

// Extract an attribute (like href) from a link
flow.extract attribute link "Profile" "href" as "profileUrl";
```

---

### 5. Scoped Variable Storage

Extracted values are stored in Flowstride's variable engine.

By default, values are stored as **local variables** and remain available throughout the current Flow file.

Adding the `global` modifier stores the value as a **global variable**, making it available across multiple Flow files during the test run.

---

### 6. Intelligent Error Reporting

If an extraction cannot be completed, Flowstride throws a detailed error rather than returning an undefined value.

The runtime reports the failed extraction path, the HTTP response status, or the missing User Interface element, helping you quickly identify incorrect paths or unexpected application states.

---

## Syntax

Extract a value from the response body.

```flow
flow.extract resBody "data.user.id" as "userId";
```

Extract a cookie.

```flow
flow.extract cookie "SessionId" as "sessionId";
```

Extract text from a table coordinate.

```flow
flow.extract text "table[0] tr[1] td[9]" as "actionText";
```

Store the extracted value globally.

```flow
flow.extract resBody "token" as global "accessToken";
```

---

## Parameters

| Parameter       | Required | Description                                                                                     |
| :-------------- | :------: | :---------------------------------------------------------------------------------------------- |
| Target          |    ✅    | The source to extract from (`resBody`, `resHeader`, `cookie`, `text`, `value`, or `attribute`). |
| Path / Selector |    ✅    | JSON path, header name, cookie name, or the Document Object Model selector.                     |
| Attribute       | Optional | Required only if Target is `attribute`. Specifies the exact HTML attribute to scrape.           |
| `as`            |    ✅    | Assigns the extracted value to a Flowstride variable.                                           |
| `global`        | Optional | Stores the value as a global variable instead of a local variable.                              |
| Variable Name   |    ✅    | The destination variable.                                                                       |

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

### Extract data from a Table

Scrape the dynamic patient name from the first row of a dashboard table.

```flow
Feature: Patient Records

Scenario: Verify dynamic patient assignment

Given "The user is logged in"
  flow.open "/dashboard";

When "Store the latest patient name"
  flow.extract text "table[0] tr[1] td[0]" as "latestUser";

Then "Search for the extracted patient"
  flow.type field "Search User" "@latestUser";
```

---

## When to Use flow.extract

Use `flow.extract` whenever you need to reuse dynamic values returned by an API or rendered in the User Interface, including:

- Generated IDs
- Authentication tokens
- Session cookies
- Response headers
- Dynamic table cell data
- Input field values
- Data shared between API and UI workflows

---

## Important Notes

::: info API Extractions Use Memory

When targeting `resBody`, `resHeader`, or `cookie`, `flow.extract` operates on the most recent API response stored in memory. It does not perform another network request.

:::

::: info Local and global variables

By default, extracted values are stored as local variables. Use the `global` modifier when the value needs to be shared across multiple Flow Scenarios.

:::

::: info Zero Index Coordinates

When extracting text from tables, remember that computer arrays start at zero. The first table on the page is `table[0]`, the first row is `tr[0]`, and the first column is `td[0]`.

:::

---

## Common Mistakes

::: warning Use the correct extraction target

Only the strictly defined targets (`resBody`, `resHeader`, `cookie`, `text`, `value`, `attribute`) are supported. Using any other target results in a parser error.

:::

::: warning Extract before using the variable

Always extract a value before referencing it.

Correct:

```flow
flow.extract text "tr[1] td[0]" as "userData";
flow.expect visible "@userData";
```

:::
