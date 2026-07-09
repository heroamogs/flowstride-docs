# flow.expect

## Introduction

`flow.expect` is the universal **Flow Command** for validating both UI and API behaviour.

Unlike traditional automation frameworks that require separate assertion libraries for browser interactions and backend responses, Flowstride provides a single assertion engine that works seamlessly across both.

Whether you're verifying that a button is visible, checking the value of an input field, validating an HTTP status code, or asserting a complex JSON response, every verification is performed using the same command.

---

## The Problem It Solves

Testing is entirely about validation. However, UI assertions and API assertions often require different libraries, APIs, and assertion styles. Furthermore, UI assertions are notoriously flaky because tests frequently perform assertions before the frontend framework has finished rendering the page.

`flow.expect` removes this complexity by providing a single assertion engine that automatically routes each assertion to the appropriate execution engine.

---

## How flow.expect Works

`flow.expect` is the universal assertion engine of Flowstride.

Based on its implementations, the command uses contextual routing to determine how each assertion should be executed.

### 1. The UI Synchronization Engine

When you perform a UI assertion such as `visible`, `text`, `value`, or `transcript`, Flowstride automatically routes the assertion to the Web Adapter.

Rather than checking the page only once, the framework waits for the expected UI state before failing. This gives modern frontend frameworks like React and Vue enough time to finish rendering or updating the interface.

For transcript assertions, Flowstride continuously polls the page while normalizing capitalization, punctuation, and whitespace before performing the comparison, making voice transcription assertions far more resilient.

---

### 2. The In-Memory API Assertion Engine

When you perform an API assertion such as `status`, `responseTime`, `resBody`, `resHeader`, or `cookie`, Flowstride evaluates the previously captured API response directly from memory inside the Flow Worker.

Your Flow script can perform rich assertions without writing JavaScript.

Supported validations include:

**Types**

- `type.of "string"`
- `type.of "number"`
- `type.of "boolean"`
- `type.of "array"`
- `type.of "object"`
- `type.of "null"`
- `type.of "undefined"`

**Formats**

- `format "email"`
- `format "uuid"`
- `format "url"`
- `format "date"`
- `format "hex"`

**Collections**

- `has.key`
- `does.not.have.key`
- `includes`
- `does.not.include`
- `is.empty`
- `not.empty`

**Comparisons**

- `equals`
- `contains`
- `greaterThan`
- `lessThan`
- `length`
- `length.greaterThan`
- `length.lessThan`
- `matches`

---

## Supported Assertions

### UI Assertions

- `visible`
- `text`
- `value`
- `transcript`

### API Assertions

- `status`
- `responseTime`
- `resBody`
- `resHeader`
- `cookie`

---

## Syntax

### UI Assertions

```flow
flow.expect visible "<locator>";
```

```flow
flow.expect visible contains "<text>";
```

```flow
flow.expect text "<text>";
```

```flow
flow.expect value "<locator>" "<expectedValue>";
```

```flow
flow.expect transcript contains "<expectedTranscript>";
```

---

### API Assertions

```flow
flow.expect status "200";
```

```flow
flow.expect responseTime lessThan "500";
```

```flow
flow.expect resBody "data.id" format "uuid";
```

```flow
flow.expect resHeader "content-type" contains "application/json";
```

```flow
flow.expect cookie "sessionId" not.empty;
```

---

## Parameters

| Parameter           | Required | Description                                                                                               |
| ------------------- | :------: | --------------------------------------------------------------------------------------------------------- |
| Assertion Type      |    ✅    | Specifies what should be validated.                                                                       |
| Element             | Optional | Narrows UI assertions to a specific Flow Element.                                                         |
| Locator / JSON Path |    ✅    | Identifies the UI element or API value to validate.                                                       |
| Matcher             | Optional | Defines how the value should be evaluated (for example `contains`, `equals`, `greaterThan`, or `format`). |
| Expected Value      | Depends  | The expected result for the assertion.                                                                    |

---

## Examples

### Validate UI elements

Use `flow.expect` to verify that the application displays the expected UI after performing an action.

```flow
Feature: Profile Management

Scenario: Updating a profile

Given "Open the profile page"
  flow.open "/profile";

When "Update the profile information"
  flow.type input "Display Name" "John Doe";

When "Save the changes"
  flow.click button "Save";

Then "The profile is updated successfully"
  flow.expect visible "Your profile was updated";

And "The updated name is displayed"
  flow.expect text "John Doe";
```

---

### Validate using a Spatial Locator

UI assertions support Flowstride's natural language locator engine, including Spatial Locators.

```flow
Feature: Appearance Settings

Scenario: Verify the active theme

Given "Open the appearance settings"
  flow.open "/settings/appearance";

Then "The Light Theme toggle is visible"
  flow.expect visible "Switch to light theme" near "Appearance";
```

---

### Validate API responses

`flow.expect` can validate complex API responses without writing JavaScript.

```flow
Feature: Backend Services

Scenario: Fetch a user

Given "Retrieve the user information"
  flow.get "/api/v1/users/99";

Then "The API response is valid"
  flow.expect status "200";

And "The response is fast"
  flow.expect responseTime lessThan "300";

And "The identifier is a UUID"
  flow.expect resBody "data.id" format "uuid";

And "The user has the admin role"
  flow.expect resBody "data.roles" includes "admin";
```

---

## When to Use flow.expect

Use `flow.expect` whenever you need to validate the outcome of a Scenario.

Typical uses include:

- Verifying UI elements
- Validating displayed text
- Confirming input values
- Checking voice transcripts
- Validating HTTP responses
- Verifying response times
- Inspecting JSON payloads
- Validating response headers
- Verifying cookies

---

## Important Notes

::: info A single assertion engine

`flow.expect` is the only assertion command in Flowstride.

The framework automatically determines whether the assertion should be evaluated against the browser or the API response based on the assertion type.

:::

## Common Mistakes

::: warning Don't use separate assertion libraries

Avoid mixing browser assertion libraries with Flowstride assertions.

Instead of relying on framework-specific assertion APIs, use `flow.expect` for both UI and API validation.

:::

::: warning Use the correct assertion type

Choose the assertion that matches what you're validating.

For example:

- Use `visible` to verify an element exists on the page.
- Use `text` to verify displayed content.
- Use `value` to verify input values.
- Use `status` to verify HTTP status codes.
- Use `resBody` to validate JSON responses.

:::

---
