# flow.forceType

## Introduction

`flow.forceType` is a **Flow Command** that forcibly enters text into an input element.

Unlike `flow.type`, which performs a standard typing interaction, `flow.forceType` bypasses normal interaction restrictions and attempts to enter text even when the element would not ordinarily accept keyboard input.

This command should only be used when application-specific behaviour prevents normal typing.

---

## Syntax

```flow
flow.forceType "<locator>" "<value>";
```

```flow
flow.forceType <element> "<locator>" "<value>";
```

```flow
flow.forceType "<locator>" <locator-modifier> "<value>";
```

```flow
flow.forceType < element > "<locator>" < locator - modifier > "<value>";
```

---

## Parameters

| Parameter        | Required | Description                                                                                               |
| ---------------- | :------: | --------------------------------------------------------------------------------------------------------- |
| Element          | Optional | Narrows the search to a specific Flow Element such as `input` or `field`.                                 |
| Locator          |    ✅    | The text used to identify the input element.                                                              |
| Value            |    ✅    | The value to enter into the element.                                                                      |
| Locator Modifier | Optional | Additional locator such as `under`, `inside`, `near`, `leftOf`, `rightOf`, `above`, `below`, or an index. |

---

## Supported Flow Elements

`flow.forceType` supports every Flow Element recognised by the Flowstride parser.

Examples include:

- `input`
- `field`
- `div`
- `span`

See **Flow Elements** for the complete reference.

---

## Examples

### Force type plain text

```flow
flow.forceType "Email" "john@example.com";
```

---

### Force type into an input

```flow
flow.forceType input "Email" "john@example.com";
```

---

### Force type using Environment Variables

```flow
flow.forceType "Email" "{{env.EMAIL}}";

flow.forceType "Password" "{{env.PASSWORD}}";
```

---

### Force type using Dynamic Variables

```flow
flow.forceType "Username" "$randomUsername";

flow.forceType "Email" "$randomEmail";
```

---

### Reuse a generated value

```flow
flow.forceType "Email" "$randomEmail";

flow.forceType "Confirm Email" "@randomEmail";
```

---

### Force type using a relative locator

```flow
flow.forceType "input" under "Available Seats" "56";
```

---

### Complete Example

```flow
Feature: Update Profile

Scenario: Update account details

Given "Open the profile page"
  flow.open "/profile";

When "Force update the display name"
  flow.forceType "Display Name" "$randomDisplayName";

When "Force update the job title"
  flow.forceType "Job Title" "$randomJobTitle";

Then "Save the changes"
  flow.click button "Save";
```

---

## When to Use flow.forceType

Use `flow.forceType` only when standard typing cannot complete successfully.

Typical scenarios include:

- Custom JavaScript input controls.
- Rich text editors.
- UI frameworks that intercept keyboard events.
- Inputs that reject normal typing during automated execution.

---

## Supported Values

`flow.forceType` accepts any valid value, including:

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

Use `flow.forceType` to:

- Populate custom input controls.
- Work with rich text editors.
- Interact with JavaScript-driven forms.
- Enter values into applications that block standard typing.

---

## Common Mistakes

::: warning Prefer `flow.type` whenever possible

`flow.type` performs the same typing interaction as a real user.

Only use `flow.forceType` when normal typing cannot complete successfully.

:::

::: warning Verify the result after forcing input

Always confirm that the application accepted the value.

```flow
flow.forceType "Email" "$randomEmail";

flow.expect value "Email" equals "@randomEmail";
```

:::

::: warning Reuse generated values when needed

If the same generated value is required later in the Scenario, reference it using its Runtime Variable.

```flow
flow.forceType "Email" "$randomEmail";

flow.forceType "Confirm Email" "@randomEmail";
```

:::

---
