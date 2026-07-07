# Docstrings

## Introduction

When working with APIs, you will often need to send structured data such as JSON or GraphQL.

While these payloads are easy for humans to read in their original format, they quickly become difficult to maintain when compressed into a single line of text.

Flowstride solves this problem with **Docstrings**.

Docstrings allow you to write large blocks of text exactly as they were intended to appear, keeping your automation clean, readable, and easy to maintain.

---

## What are Docstrings?

A Docstring is a multi-line block of text enclosed by triple quotation marks.

```flow
""" // Open docstring
{
    "email": "{{env.EMAIL}}",
    "password": "{{env.PASSWORD}}"
}
""" // Close docstring
```

Unlike ordinary strings, Docstrings preserve line breaks and formatting, allowing you to paste structured content directly into your `.flow` files without rewriting it.

Although Docstrings can contain any text, they are most commonly used for:

- JSON request bodies
- GraphQL queries
- Large structured payloads

---

## Why Docstrings Exist

Modern APIs frequently exchange complex payloads.

A simple request body may contain dozens of nested objects, arrays, and configuration values.

Writing those payloads as ordinary strings makes automation difficult to read and even harder to maintain.

Instead of focusing on the business behaviour being tested, your Scenario becomes filled with escaped characters and formatting noise.

Docstrings remove that complexity by allowing the payload to remain in its natural form.

This makes your automation easier to understand for both testers and developers.

---

## Why Escaped JSON is Difficult to Maintain

Traditional string literals require quotation marks to be escaped.

For example:

```flow
flow.post "/api/login" with reqBody "{\"email\":\"{{env.EMAIL}}\",\"password\":\"{{env.PASSWORD}}\"}";
```

Even a small payload quickly becomes difficult to read.

As the payload grows, maintaining it becomes increasingly frustrating.

Adding a new property or correcting a typo often means counting quotation marks and escape characters instead of focusing on the actual request.

The problem becomes even worse when working with deeply nested JSON structures or GraphQL queries.

---

## How Flowstride Solves It

Flowstride supports native multi-line Docstrings using triple quotation marks.

Instead of escaping every quotation mark, you simply write the payload exactly as it should appear.

```flow
"""
{
    "email": "{{env.EMAIL}}",
    "password": "{{env.PASSWORD}}"
}
"""
```

The formatting remains intact, making the request easy to read, review, and maintain.

Because Docstrings are part of the Flow Language, they integrate naturally with Flowstride variables.

You can freely use:

```flow
- Environment variables (`{{env.*}}`)
- Generated variables (`$...`)
- Runtime variables (`@...`)
```

inside the same payload without sacrificing readability.

This allows your Scenarios to describe **what** is being sent rather than forcing you to fight with string formatting.

---

## Writing Docstrings

Flowstride uses **triple quotation marks** (`"""`) to define a Docstring.

Everything between the opening and closing triple quotes is treated as a single block of text while preserving its original formatting.

This allows you to write large payloads exactly as they should appear.

---

## Triple Quotes (`"""`)

A Docstring begins with three quotation marks and ends with another three quotation marks.

```flow
"""
{
    "email": "{{env.EMAIL}}",
    "password": "{{env.PASSWORD}}"
}
"""
```

The opening and closing delimiters define the entire block as a single string, regardless of how many lines it contains.

---

## Basic Syntax

Docstrings are most commonly used together with commands that accept request bodies.

```flow
When "Authenticate the user"
  flow.post "/api/auth/login" with reqBody
  """
  {
      "email": "{{env.EMAIL}}",
      "password": "{{env.PASSWORD}}"
  }
  """
```

Notice that the JSON is written exactly as it would appear in an API specification.

No quotation marks need to be escaped.

No line breaks need to be removed.

The payload remains clean and readable.

---

## Multi-line Text

Docstrings preserve multiple lines automatically.

This means you can paste large payloads directly into your `.flow` file without rewriting them.

```flow
When "Create a new customer"
  flow.post "/api/customers" with reqBody
  """
  {
      "firstName": "Samuel",
      "lastName": "Okolo",
      "address": {
          "city": "Lagos",
          "country": "Nigeria"
      },
      "preferences": [
          "email",
          "sms"
      ]
  }
  """
```

Whether the payload contains ten lines or hundreds, the structure remains intact.

---

## Preserving Formatting

One of the biggest advantages of Docstrings is that they preserve the original formatting of your content.

Instead of compressing everything into a single line:

```text
{"user":{"name":"Samuel","role":"Admin"}}
```

you can keep the payload formatted naturally.

```json
{
  "user": {
    "name": "Samuel",
    "role": "Admin"
  }
}
```

Readable payloads are easier to review, easier to debug, and much easier to maintain over time.

---

## Indentation Rules

Flowstride preserves the content inside a Docstring exactly as it is written.

For consistency, it is recommended to indent the contents of the Docstring using the same indentation style as the surrounding Flow script.

```flow
flow.post "/api/orders" with reqBody
"""
{
    "orderId": 12345,
    "status": "Pending"
}
"""
```

Keeping consistent indentation makes large Scenarios easier to read, especially when working with nested JSON objects.

---

# Variables Inside Docstrings

Docstrings fully support Flowstride variables.

This allows dynamic values to be mixed naturally with static content.

## Environment Variables

```flow
"""
{
    "email": "{{env.EMAIL}}",
    "password": "{{env.PASSWORD}}"
}
"""
```

---

## Generated Variables

```flow
"""
{
    "email": "$randomEmail",
    "password": "$randomPassword"
}
"""
```

---

## Runtime Variables

```flow
"""
{
    "userId": "@newUserId",
    "email": "@randomEmail"
}
"""
```

Variables are resolved during execution, allowing the payload to remain both readable and dynamic.

This makes Flowstride Docstrings ideal for API requests that contain a combination of configuration values, generated data, and values captured earlier in the Scenario.

---

## Request Bodies

The most common use of Docstrings is sending request bodies with API commands.

Flowstride uses the `with reqBody` modifier to attach structured data to a request.

Instead of writing an entire payload on a single line, you can write it exactly as it would appear in an API specification.

```flow
When "Authenticate the user"
  flow.post "/api/auth/login" with reqBody
  """
  {
      ...
      "email": "{{env.EMAIL}}",
      "password": "{{env.PASSWORD}}"
  }
  """
```

The payload remains clean, readable, and easy to maintain regardless of its size.

---

## The `with reqBody` Modifier

The `with reqBody` modifier tells Flowstride that the following Docstring should be used as the request body for the current API request.

The request body immediately follows the API command.

```flow
flow.post "/api/users" with reqBody
"""
{
    "firstName": "Samuel",
    "lastName": "Okolo"
}
"""
```

Because the request body is separated from the command itself, the Flow script remains easy to read.

The Scenario continues to describe the business behaviour while the payload remains formatted as ordinary JSON.

---

## JSON Payloads

Most REST APIs exchange JSON.

Docstrings allow you to copy JSON directly from API documentation, Postman collections, or backend specifications without rewriting it.

```flow
When "Create a customer account"
  flow.post "/api/customers" with reqBody
  """
  {
      "firstName": "John",
      "lastName": "Doe",
      "email": "$randomEmail",
      "password": "$randomPassword",
      "phone": "$randomPhone"
  }
  """
```

Notice that generated variables can be mixed naturally with static values.

This keeps the payload dynamic while preserving its readability.

---

## Large Request Bodies

Many enterprise APIs require large payloads containing dozens of fields.

Docstrings allow these payloads to remain fully structured.

```flow
When "Create a ride schedule"
  flow.post "/api/schedules" with reqBody
  """
  {
      "route": {
          "origin": "Lagos",
          "destination": "Abuja"
      },
      "vehicle": {
          "registration": "ABJ-QA-123AB",
          "capacity": 56
      },
      "departure": {
          "date": "2026-11-14",
          "time": "10:30"
      },
      "driver": {
          "name": "John Doe",
          "phone": "$randomPhone"
      }
  }
  """
```

Rather than squeezing everything into a single line, each object remains clearly organised.

Large payloads become much easier to review, update, and debug.

---

## Complex Nested JSON

Nested objects and arrays are common in modern APIs.

Docstrings preserve the hierarchy exactly as it was written.

```flow
When "Submit order"
  flow.post "/api/orders" with reqBody
  """
  {
      "customer": {
          "name": "Samuel",
          "email": "$randomEmail"
      },
      "items": [
          {
              "productId": 1001,
              "quantity": 2
          },
          {
              "productId": 2045,
              "quantity": 1
          }
      ],
      "delivery": {
          "address": {
              "country": "$randomPair[Country]",
              "state": "@randomPair[State]",
              "city": "@randomPair[City]"
          }
      }
  }
  """
```

The nested structure remains obvious, making it easy to understand relationships between objects, arrays, and properties.

---

## Combining Variables Inside Request Bodies

One of Flowstride's strengths is that every variable type can be used inside the same Docstring.

```flow
When "Register a new user"
  flow.post "/api/users" with reqBody
  """
  {
      "email": "$randomEmail",
      "password": "$randomPassword",
      "country": "$randomPair[Country]",
      "state": "@randomPair[State]",
      "city": "@randomPair[City]",
      "referrerId": "@newUserId",
      "environment": "{{env.TEST_ENV}}"
  }
  """
```

In a single request body, Flowstride combines:

```flow
- Environment Variables (`{{env.*}}`)
- Generated Variables (`$...`)
- Runtime Variables (`@...`)
```

Each value is resolved automatically during execution before the request is sent.

---

## Real-World Example

The following example demonstrates a complete authentication request using a Docstring.

```flow
Given "User authenticates via API"
  flow.post "/api/auth/login" with reqBody
  """
  {
      "email": "{{env.ADMIN_EMAIL}}",
      "password": "{{env.ADMIN_PW}}"
  }
  """

Then "Confirm authentication succeeded"
  flow.expect status "200"
```

The request body remains identical to the backend API contract, making it easy for both testers and developers to understand.

There are no escaped quotation marks, no compressed JSON, and no unnecessary formatting noise.

The Flow script continues to read as business behaviour, while the request body remains valid, readable JSON.

---

## GraphQL

Flowstride provides native support for GraphQL through the `flow.graphql` command.

Like other API commands, GraphQL requests use Docstrings to keep queries and mutations readable and easy to maintain.

Unlike many testing tools, Flowstride allows you to write raw GraphQL directly inside your `.flow` files.

---

## The `flow.graphql` Command

Use `flow.graphql` whenever your application exposes a GraphQL endpoint.

```flow
When "Retrieve the authenticated user's profile"
  flow.graphql "/graphql" with reqBody
  """
  query {
      me {
          id
          firstName
          lastName
          email
      }
  }
  """
```

The query remains identical to the GraphQL syntax developers already use.

---

## Automatic GraphQL Wrapping

GraphQL servers expect requests to be sent as JSON.

Normally you would have to write:

```json
{
  "query": "query { me { id email } }"
}
```

Flowstride removes that boilerplate.

When the engine receives the Docstring, it first checks whether the content is already valid JSON.

If it is, the payload is sent unchanged.

If it is not valid JSON, Flowstride automatically wraps the GraphQL operation into the standard GraphQL request format before sending it.

For example, writing:

```flow
flow.graphql "/graphql" with reqBody
"""
query {
    me {
        id
        email
    }
}
"""
```

is automatically transformed into:

```json
{
    "query": "query {
        me {
            id
            email
        }
    }"
}
```

before the request is executed.

Flowstride also automatically applies the `Content-Type: application/json` header if one has not already been supplied.

---

## Multi-line GraphQL Queries

GraphQL queries often contain deeply nested fields.

Docstrings preserve the structure exactly as written.

```flow
When "Retrieve ride schedules"
  flow.graphql "/graphql" with reqBody
  """
  query {
      schedules {
          id
          departureDate
          availableSeats

          route {
              origin
              destination
          }

          vehicle {
              registration
              capacity
          }
      }
  }
  """
```

Because the query remains fully formatted, nested relationships are immediately obvious.

---

## Mutations Work the Same Way

The same automatic wrapping applies to GraphQL mutations.

Simply write the mutation exactly as you normally would.

```flow
When "Create a customer"
  flow.graphql "/graphql" with reqBody
  """
  mutation {
      createCustomer(
          input: {
              name: "John Doe"
              email: "$randomEmail"
          }
      ) {
          id
          email
      }
  }
  """
```

Flowstride automatically detects that the Docstring contains raw GraphQL, wraps it into the required JSON request, and submits it to the GraphQL server.

No additional formatting is required.

---

## Real-World Example

The following Scenario retrieves the authenticated administrator's profile.

```flow
Given "Retrieve the administrator profile"
  flow.graphql "/graphql" with reqBody
  """
  query {
      me {
          id
          firstName
          lastName
          email
          role
      }
  }
  """

Then "Confirm authentication succeeded"
  flow.expect status "200"

And "Verify administrator role"
  flow.expect resBody "data.me.role" equals "admin"
```

If the GraphQL server returns the following response:

```json
{
  "data": {
    "me": {
      "id": "1",
      "firstName": "Samuel",
      "lastName": "Okolo",
      "email": "sam@example.com",
      "role": "admin"
    }
  }
}
```

the assertion:

```flow
flow.expect resBody "data.me.role" equals "admin"
```

verifies that the authenticated user's role is `"admin"`.

The Flow script describes the business behaviour, while the GraphQL operation remains identical to the query developers work with every day.

---

## Best Practices

Docstrings are designed to make API automation easier to read and maintain. Following a few simple practices will help keep your Flow scripts consistent as your test suites grow.

---

## Keep JSON Formatted

Write JSON exactly as you would in your API documentation.

Proper indentation makes nested objects much easier to understand and reduces the likelihood of introducing syntax errors.

**Recommended**

```flow
flow.post "/api/users" with reqBody
"""
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "$randomEmail"
}
"""
```

Avoid compressing large payloads into a single line.

```flow
flow.post "/api/users" with reqBody """{"firstName":"John","lastName":"Doe","email":"$randomEmail"}"""
```

Readable payloads are easier to review, debug, and maintain.

---

## Avoid Escaped Strings

Docstrings eliminate the need to manually escape quotation marks.

Instead of writing:

```flow
flow.post "/api/login" with reqBody "{\"email\":\"{{env.EMAIL}}\",\"password\":\"{{env.PASSWORD}}\"}"
```

prefer:

```flow
flow.post "/api/login" with reqBody
"""
{
    "email": "{{env.EMAIL}}",
    "password": "{{env.PASSWORD}}"
}
"""
```

The second approach is significantly easier to read and closely matches the payload expected by the backend.

---

## Use Variables Instead of Hard-Coded Values

Where possible, replace fixed values with Flowstride variables.

This makes your Scenarios reusable across different environments and test runs.

```flow
flow.post "/api/register" with reqBody
"""
{
    "email": "$randomEmail",
    "password": "$randomPassword",
    "environment": "{{env.TEST_ENV}}"
}
"""
```

Using variables reduces duplication and helps ensure every execution starts with fresh, predictable data.

---

## Common Mistakes

::: warning Avoid These Mistakes

**Using ordinary strings for large payloads**

Docstrings exist specifically to make large request bodies readable. Avoid placing complex JSON inside ordinary string literals.

---

**Inconsistent indentation**

Although Flowstride preserves the contents of a Docstring, inconsistent indentation makes large payloads difficult to follow.

---

**Hard-coding test data**

Avoid fixed email addresses, phone numbers, and identifiers when dynamic variables are available.

---

**Forgetting to close the Docstring**

Every opening `"""` must have a matching closing `"""`.

An unclosed Docstring prevents the remainder of the Flow script from being parsed correctly.

:::

---
