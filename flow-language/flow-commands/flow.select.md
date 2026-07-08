# flow.select

## Introduction

`flow.select` is a **Flow Command** that selects an option from a dropdown list.

It is designed to work seamlessly with both native HTML `<select>` elements and modern framework-based dropdown components.

Unlike traditional automation frameworks that require different code depending on how the dropdown was implemented, `flow.select` automatically detects the underlying component and chooses the appropriate interaction strategy.

---

## The Problem It Solves

Interacting with dropdown menus is one of the most inconsistent experiences in UI automation. Web applications generally use one of two completely different methods to build dropdowns:

- **The Native `<select>` Element:** The standard HTML element built into the browser.

- **The Custom UI Dropdown:** Beautifully styled dropdowns built by frameworks (like React, Vue, MUI, or Ant Design) using clickable `<div>`, `<ul>`, and `<li>` elements that mimic a select box but are completely invisible to standard dropdown APIs.

Standard automation forces the QA engineer to write completely different code depending on how the developer built the dropdown.

`flow.select` removes this complexity.

---

## Syntax

```flow
flow.select "<locator>" "<option>";
```

```flow
flow.select <element> "<locator>" "<option>";
```

---

## Parameters

| Parameter | Required | Description                                                              |
| --------- | :------: | ------------------------------------------------------------------------ |
| Element   | Optional | Narrows the search to a specific Flow Element such as `select` or `div`. |
| Locator   |    ✅    | Identifies the dropdown control.                                         |
| Option    |    ✅    | The option to select.                                                    |

---

## How flow.select Works

`flow.select` automatically determines how the dropdown has been implemented before selecting an option.

### 1. Native HTML Dropdown Detection

Flowstride first determines whether the located element is a standard HTML `<select>` element.

If it is, Flowstride performs a native browser selection without opening the dropdown.

The engine intelligently matches the supplied option using:

- the option's **value**
- the visible **label**
- the option's **index**, where applicable

This provides fast and reliable interaction with standard browser controls.

---

### 2. Custom Component Detection

If the target is **not** a native `<select>` element, Flowstride automatically switches to its human interaction strategy.

It:

1. Clicks the dropdown.
2. Waits for the dropdown menu to expand.
3. Searches the visible page for the requested option.
4. Clicks the matching option.

This allows the same Flow Command to work with custom dropdown implementations without requiring additional clicks or DOM-specific logic.

---

## Examples

### Select from a native HTML dropdown

```flow
Feature: User Onboarding

Scenario: Select a country

Given "Open the demographic profile"
  flow.open "/profile/demographics";

When "Choose Canada"
  flow.select select "Country" "Canada";

Then "Verify the next field appears"
  flow.expect visible "Province";
```

---

### Select from a custom React dropdown

```flow
Feature: User Management

Scenario: Assign a role

Given "Open the user editor"
  flow.open "/admin/users/edit";

When "Choose the Administrator role"
  flow.select div "User Role" "Administrator";

Then "Save the changes"
  flow.click button "Save Permissions";
```

---

### Select a vehicle route

```flow
flow.select "Route" "Lagos → Abuja";
```

---

### Select a vehicle

```flow
flow.select "Car" "BUS 03 (ABJ-QA-123AB)";
```

---

## When to Use flow.select

Use `flow.select` whenever you need to choose one value from a predefined list of options.

Typical examples include:

- Country selection
- State or province selection
- User roles
- Vehicle routes
- Categories
- Payment methods
- Shipping options
- Status values

Regardless of whether the application uses a native HTML dropdown or a custom framework component, the same Flow Command can be used.

---

## Why It Is Resilient

One of the biggest advantages of `flow.select` is that it adapts automatically to the application's implementation.

If developers replace a native HTML `<select>` with a custom React or Vue dropdown—or vice versa, the Flow script does not need to change.

Flowstride determines the type of dropdown at runtime and automatically performs the appropriate interaction.

This significantly reduces maintenance as applications evolve.

---

## Common Mistakes

::: warning Do not manually click the dropdown first

The following introduces unnecessary steps:

```flow
flow.click "Country";

flow.click "Canada";
```

Instead, let Flowstride perform the complete interaction.

```flow
flow.select "Country" "Canada";
```

:::

::: warning Use the visible option text

`flow.select` is designed to select the option presented to the user.

Prefer the visible label rather than attempting to reference implementation-specific DOM attributes.

:::

---
