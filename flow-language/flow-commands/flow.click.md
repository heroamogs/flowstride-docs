# flow.click

## Introduction

`flow.click` is a **Flow Command** that clicks an element in the active browser.

Unlike traditional automation frameworks that require CSS selectors or XPath expressions, `flow.click` locates elements using Flowstride's natural language locator engine.

The command automatically searches for the most appropriate matching element, waits until it becomes interactable, scrolls it into view if necessary, and performs the click.

---

## Syntax

```flow
flow.click "<text>";
```

```flow
flow.click < element > "<text>";
```

```flow
flow.click "<text>" <locator>;
```

```flow
flow.click <element> "<text>" <locator>;
```

---

## Parameters

| Parameter | Required | Description                                                                                               |
| --------- | :------: | --------------------------------------------------------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element such as `button`, `input`, or `link`.                       |
| Text      |    ✅    | The text or label used to identify the element.                                                           |
| Locator   | Optional | Additional locator such as `near`, `inside`, `under`, `leftOf`, `rightOf`, `above`, `below`, or an index. |

---

## Supported Flow Elements

`flow.click` supports every Flow Element recognised by the Flowstride parser.

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

### Click using visible text

```flow
flow.click "Login";
```

---

### Click a button

```flow
flow.click button "Login";
```

---

### Click a link

```flow
flow.click link "Forgot Password";
```

---

### Click an image

```flow
flow.click image "Product Preview";
```

---

### Click using a relative locator

```flow
flow.click "Log in" near "Sign Up";
```

---

### Click inside a container

```flow
flow.click "Schedules" inside "aside";
```

---

### Click under another element

```flow
flow.click button "Continue" under "Billing Details";
```

---

### Click the first matching element

```flow
flow.click "Delete [0]";
```

---

### Complete Example

```flow
Feature: User Login

Scenario: Login successfully

Given "Open the application"

  flow.open "/";

When "Click the login button"

  flow.click button "Log in";

When "Enter credentials"

  flow.type "Email" "{{env.EMAIL}}";

  flow.type "Password" "{{env.PASSWORD}}";

When "Submit the form"

  flow.click button "Login";

Then "Verify login"

  flow.expect visible "Logout";
```

---

## How Flowstride Finds Elements

Flowstride does not require CSS selectors for most interactions.

Instead, it combines:

- Visible text
- Optional Flow Element
- Relative locators
- Element position
- DOM heuristics

to locate the intended element before performing the click.

Providing a Flow Element further narrows the search and can improve accuracy when multiple elements share similar text.

---

## When to Use Flow Elements

Instead of:

```flow
flow.click "Login";
```

you can make the intent more explicit:

```flow
flow.click button "Login";
```

This helps Flowstride narrow its search to button-like elements.

---

### Click using a Spatial Locator

When multiple elements contain similar text, a Spatial Locator helps Flowstride identify the correct target based on its position relative to another element.

```flow
Feature: Dashboard Navigation

Scenario: Open the Notifications page

Given "User is on the dashboard"
  flow.open "/dashboard";

When "User clicks the Notifications menu"
  flow.click "Notifications" rightOf "Messages";

Then "The Notifications page is displayed"
  flow.expect visible "Notification Preferences";
```

## Common Use Cases

Use `flow.click` to:

- Click buttons
- Click hyperlinks
- Open menus
- Select cards
- Navigate between pages
- Open dialogs
- Submit forms

---

## Common Mistakes

::: warning Multiple matching elements

If several elements share the same text, provide additional context such as an Element, a relative locator, or an index.

```flow
flow.click button "Delete";

flow.click "Delete" inside "Users";

flow.click "Delete [1]";
```

:::

::: warning Use `flow.forceClick` only when necessary

`flow.click` performs a normal user interaction.

If you intentionally need to bypass normal interaction checks, use `flow.forceClick` instead.

:::

---
