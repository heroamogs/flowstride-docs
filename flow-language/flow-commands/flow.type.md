# flow.type

## Introduction

`flow.type` is a **Flow Command** that enters text into an input field.

It is commonly used to populate forms, search boxes, login pages, registration screens, and any workflow that requires user input.

Like every Flowstride UI command, `flow.type` uses Flowstride's natural language locator engine instead of requiring CSS selectors or XPath expressions.

---

## Syntax

```flow
flow.type "<locator>" "<value>";
```

```flow
flow.type <element> "<locator>" "<value>";
```

```flow
flow.type "<locator>" <locator-modifier> "<value>";
```

```flow
flow.type < element > "<locator>" < locator - modifier > "<value>";
```

---

## Parameters

| Parameter        | Required | Description                                                                                                                |
| ---------------- | :------: | -------------------------------------------------------------------------------------------------------------------------- |
| Element          | Optional | Narrows the search to a specific Flow Element such as `input` or `field`.                                                  |
| Locator          |    ✅    | The text used to identify the input element.                                                                               |
| Value            |    ✅    | The value to type into the element. This may be plain text, a Runtime Variable, Dynamic Variable, or Environment Variable. |
| Locator Modifier | Optional | Additional locator such as `under`, `inside`, `near`, `leftOf`, `rightOf`, `above`, `below`, or an index.                  |

---

## Supported Flow Elements

`flow.type` supports every Flow Element recognised by the Flowstride parser.

Examples include:

- `input`
- `field`
- `div`
- `span`

See **Flow Elements** for the complete reference.

---

## Examples

### Type plain text

```flow
flow.type "Email" "john@example.com";
```

---

### Type into an input

```flow
flow.type input "Email" "john@example.com";
```

---

### Type into a field

```flow
flow.type field "Password" "MySecurePassword";
```

---

### Type using an Environment Variable

```flow
flow.type "Email" "{{env.EMAIL}}";

flow.type "Password" "{{env.PASSWORD}}";
```

---

### Type using a Dynamic Variable

```flow
flow.type "Email" "$randomEmail";

flow.type "Username" "$randomUsername";
```

---

### Reuse a generated value

```flow
flow.type "Email" "$randomEmail";

flow.type "Confirm Email" "@randomEmail";
```

---

### Type using a relative locator

```flow
flow.type "input" under "Available Seats" "56";
```

---

### Complete Example

```flow
Feature: User Login

Scenario: Login successfully

Given "Open the login page"
  flow.open "/login";

When "Enter user credentials"
  flow.type "Email" "{{env.EMAIL}}";
  flow.type "Password" "{{env.PASSWORD}}";

When "Submit the form"
  flow.click button "Login";

Then "Verify login"
  flow.expect visible "Logout";
```

---

## Supported Values

`flow.type` accepts any valid string value, including:

```flow
- Plain text
- Environment Variables (`{{env.*}}`)
- Runtime Variables (`@...`)
- Dynamic Variables (`$...`)
- Extracted values
- Generated values
```

---

## Common Use Cases

Use `flow.type` to:

- Fill login forms.
- Complete registration forms.
- Enter search terms.
- Populate profile information.
- Enter payment details.
- Fill checkout forms.

---

## Common Mistakes

::: warning Use the field label whenever possible

Prefer descriptive locators:

```flow
flow.type "Email" "john@example.com";
```

instead of generic locators unless necessary.

:::

::: warning Reuse generated values when needed

If a generated value must appear more than once, reuse it instead of generating a new one.

```flow
flow.type "Email" "$randomEmail";

flow.type "Confirm Email" "@randomEmail";
```

:::

::: warning Use `flow.forceType` only when necessary

`flow.type` performs a normal typing interaction.

If your application prevents standard typing, use `flow.forceType` instead.

:::

---
