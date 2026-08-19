# leftOf, rightOf

## Introduction

`leftOf` and `rightOf` are **Spatial Modifiers** that allow Flowstride to locate a target element based on its strict horizontal placement relative to an anchor element on the screen.

While the `near` modifier searches in all directions simultaneously, `leftOf` and `rightOf` mathematically force the locator engine to look strictly horizontally, making them perfect for precise inline layouts.

---

## The Problem It Solves

Web pages frequently align related data horizontally. For example:

- A user list where the "Delete" button sits on the far right of the user's name.
- An inline form where "First Name" and "Last Name" sit side by side.
- A navigation bar with horizontally aligned links.

If you use `near` in a tightly packed list, the engine might accidentally grab a button from the row immediately above or below the anchor if it happens to be geometrically closer in total pixel distance.

By using `leftOf` or `rightOf`, you mathematically eliminate any elements that do not sit in the correct horizontal direction, guaranteeing absolute precision.

Compare:

```flow
flow.click button "Edit";
```

with:

```flow
flow.click button "Edit" rightOf "Jane Doe";
```

The second version mathematically filters out all "Edit" buttons on the page except the ones strictly to the right of "Jane Doe", and then clicks the closest one.

---

## How It Works

When you use horizontal spatial modifiers, Flowstride bypasses standard Document Object Model nesting rules and looks at the rendered pixels on the screen.

1.  **Anchor Resolution:** Flowstride first finds the anchor element (e.g., "Jane Doe").
2.  **Target Resolution:** It finds all elements matching your target (e.g., all "Edit" buttons).
3.  **Directional Filtering:**
    - For `leftOf`, it immediately discards any target whose right boundary extends past the anchor's left boundary.
    - For `rightOf`, it immediately discards any target whose left boundary sits behind the anchor's right boundary.
4.  **Geometric Calculation:** It draws physical bounding boxes around the remaining valid matches and calculates the shortest mathematical distance to the anchor.
5.  **Execution:** It selects the target that is horizontally closest.

---

## Syntax

### Click a button to the right of a label

```flow
flow.click button "Delete" rightOf "Project Alpha";
```

### Type into a field to the left of another field

```flow
flow.type input "First Name" leftOf "Last Name" "John";
```

### Verify an element to the right of text

```flow
flow.expect visible "Active Status" rightOf "System Administrator";
```

---

## Examples

### Resolving ambiguity in a data list

When a list contains multiple identical action buttons, use the specific item name as the horizontal anchor.

```flow
Feature: User Administration

Scenario: Deactivate a specific user account

Given "The administrator is on the user management page"
    flow.open "/users";

When "The administrator clicks the deactivate button for Jane Doe"
    flow.click button "Deactivate" rightOf "Jane Doe";

Then "The system confirms the deactivation"
    flow.expect visible "User account deactivated";
```

---

### Targeting adjacent form fields

When dealing with horizontally aligned inputs, you can anchor them to each other or to adjacent labels.

```flow
Feature: Profile Registration

Scenario: Complete an inline registration form

Given "The user is on the registration page"
    flow.open "/register";

When "The user enters their first name"
    flow.type input "First Name" leftOf "Last Name" "Alice";

Then "The user enters their last name"
    flow.type input "Last Name" rightOf "First Name" "Smith";
```

---

## When to Use "leftOf" and "rightOf"

Use horizontal spatial modifiers whenever you need to resolve visual ambiguity across a horizontal axis. They are highly effective for:

- Action buttons aligned to the right of list items
- Inline form fields (e.g., side by side date pickers or name fields)
- Data grids without strict table structures
- Status badges positioned next to titles

---

## Important Notes

::: info Responsive Layout Warning
Spatial modifiers rely entirely on physical bounding boxes at the moment of execution. If your application shifts to a mobile layout where adjacent elements stack vertically instead of side by side, `leftOf` and `rightOf` will mathematically fail. In responsive scenarios, consider using `near` instead.
:::

::: info Visible Elements Only
Because directional calculations rely on rendered pixels, both your target element and your anchor element must be fully visible on the screen for the calculation to work.
:::

---

## Common Mistakes

::: warning Using a vague anchor
If your anchor text appears multiple times on the page, Flowstride will throw an ambiguity error for the anchor itself. Always choose a highly unique anchor (like a specific user name or distinct data point) to guide the engine.
:::

::: warning Vertical alignment drift
If an element sits diagonally (below and to the right), `rightOf` will still find it as long as its physical pixels are located to the right. However, if you strictly want vertical filtering, you should use `above` or `below`.
:::
