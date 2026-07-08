# flow.forceClick

## Introduction

`flow.forceClick` is a **Flow Command** that forcibly clicks an element in the active browser.

Unlike `flow.click`, which performs a standard user interaction, `flow.forceClick` bypasses normal interaction restrictions and attempts the click even when the element would not ordinarily be clickable.

This command should be reserved for situations where a normal click cannot be performed due to application-specific UI behaviour.

---

## Syntax

```flow
flow.forceClick "<text>";
```

```flow
flow.forceClick < element > "<text>";
```

```flow
flow.forceClick "<text>" <locator>;
```

```flow
flow.forceClick <element> "<text>" <locator>;
```

---

## Parameters

| Parameter | Required | Description                                                                                               |
| --------- | :------: | --------------------------------------------------------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element such as `button`, `input`, or `link`.                       |
| Text      |    ✅    | The visible text used to identify the element.                                                            |
| Locator   | Optional | Additional locator such as `near`, `inside`, `under`, `leftOf`, `rightOf`, `above`, `below`, or an index. |

---

## Supported Flow Elements

`flow.forceClick` supports every Flow Element recognised by the Flowstride parser.

Examples include:

- `button`
- `link`
- `a`
- `input`
- `field`
- `div`
- `span`
- `image`
- `img`
- `burger`
- `hamburger`

See **Flow Elements** for the complete reference.

---

## Examples

### Force click using visible text

```flow
flow.forceClick "Login";
```

---

### Force click a button

```flow
flow.forceClick button "Submit";
```

---

### Force click using a relative locator

```flow
flow.forceClick "Continue" near "Cancel";
```

---

### Force click inside a container

```flow
flow.forceClick button "Delete" inside "User List";
```

---

### Force click the second matching element

```flow
flow.forceClick "Delete [1]";
```

---

### Complete Example

```flow
Scenario: Dismiss an overlay

Given "Open the application"
  flow.open "/";

When "Force click the close button"
  flow.forceClick button "Close";

Then "Verify the overlay is dismissed and 'Welcome' is displayed"
  flow.expect visible "Welcome";
```

---

## When to Use flow.forceClick

Use `flow.forceClick` only when a normal click is prevented by the application's behaviour.

Typical scenarios include:

- Elements covered by temporary overlays.
- Custom UI components that block standard interaction.
- Applications that intentionally intercept pointer events.
- UI frameworks that require a forced click during testing.

---

## Common Use Cases

- Dismissing modal overlays.
- Clicking hidden toggle controls.
- Interacting with custom UI libraries.
- Working around temporary UI obstructions.

---

## Common Mistakes

::: warning Prefer `flow.click` whenever possible

`flow.click` performs the same interaction a real user would.

Only use `flow.forceClick` when a standard click cannot complete successfully.

:::

::: warning A forced click does not guarantee the application handled the action

Always verify the expected outcome after forcing a click.

```flow
flow.forceClick button "Delete";

flow.expect visible "Record deleted";
```

:::

---
