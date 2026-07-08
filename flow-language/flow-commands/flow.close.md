# flow.close

## Introduction

`flow.close` is a **Flow Command** that dismisses in-page UI overlays such as modals, dialogs, popups, and banners.

Unlike traditional automation frameworks that require you to locate the exact "X" icon or close button, `flow.close` only requires a locator that identifies the modal itself. Flowstride then uses its geometric interaction engine to locate and activate the appropriate dismissal control automatically.

---

## The Problem It Solves

Modern web applications heavily utilize in-page overlays such as:

- Promotional popups
- Cookie consent banners
- Confirmation dialogs
- Feature announcements
- Welcome modals

Closing these overlays is often one of the most fragile parts of UI automation.

Traditional automation frameworks require QA engineers to locate the exact CSS selector or XPath for the close button, for example:

- `button.modal-close`
- `.close-icon`
- `svg[data-testid='close']`

Whenever developers redesign the modal or rename CSS classes, those selectors become invalid and the test fails.

`flow.close` removes this dependency.

Instead of targeting the close button, you simply identify the modal itself.

---

## How flow.close Works

`flow.close` dismisses UI overlays using **Geometric Target Resolution**.

Rather than locating the close button directly, Flowstride derives it automatically from the modal's geometry.

### Modal Identification

Flowstride first searches the page for the visible text supplied to `flow.close`.

Once the text is located, the engine walks up the DOM tree until it identifies the modal container.

The modal is recognised using semantic and visual indicators such as:

- `role="dialog"`
- CSS classes containing `modal`
- High `z-index` fixed or absolute positioned containers

If none of these indicators are present, Flowstride gracefully falls back to the nearest suitable parent container.

---

### Geometric Boundary Calculation

Once the modal has been identified, Flowstride calculates its bounding rectangle.

This establishes the exact visual boundaries of the overlay and allows the engine to search only within that region.

---

### Intelligent Dismissal Sweep

Flowstride scans the modal for likely dismissal controls, including:

- Buttons
- SVG icons
- Links
- Elements with `role="button"`
- Clickable images

Rather than selecting the first match, the engine ranks candidates according to their proximity to the modal's top-right corner, where dismissal controls are typically located.

The highest-ranked candidate is then clicked using a real mouse interaction.

---

### Geometric Fallback

Some applications use highly customized close controls that cannot be identified directly.

If no suitable dismissal control is found, Flowstride performs a geometric click near the modal's top-right corner.

This allows many custom modal implementations to be dismissed without requiring application-specific selectors.

---

## Syntax

```flow
flow.close "<locator>";
```

```flow
flow.close < element > "<locator>";
```

---

## Parameters

| Parameter | Required | Description                                                                     |
| --------- | :------: | ------------------------------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element.                                  |
| Locator   |    ✅    | Visible text that uniquely identifies the modal, dialog, or overlay to dismiss. |

---

## Examples

### Close a welcome modal

```flow
Feature: Dashboard Navigation

Scenario: Close the welcome dialog

Given "Open the dashboard"
  flow.open "/dashboard";

When "Dismiss the welcome dialog"
  flow.close "Welcome to the new dashboard";

Then "Open the profile page"
  flow.click "Profile";
```

---

### Close a cookie banner

```flow
Feature: Footer Navigation

Scenario: Access the privacy policy

Given "Open the homepage"
  flow.open "/";

When "Dismiss the cookie banner"
  flow.close "We use cookies";

Then "Open the privacy policy"
  flow.click "Privacy Policy";
```

---

### Close a confirmation dialog

```flow
flow.close "Delete Project";
```

---

## When to Use flow.close

Use `flow.close` whenever an in-page overlay blocks interaction with the underlying application.

Typical examples include:

- Cookie banners
- Welcome dialogs
- Marketing popups
- Confirmation dialogs
- Announcement modals
- Update notifications
- Feature tours

---

## Why It Is Resilient

One of the biggest advantages of `flow.close` is that it is **independent of the close button's implementation**.

Rather than relying on fragile CSS selectors or XPath expressions, Flowstride derives the dismissal target from the modal itself.

Even if developers:

- redesign the close icon,
- replace the button with an SVG,
- change CSS classes,
- or modify the internal DOM structure,

the Flow script can remain unchanged because the modal is identified by its visible content, not its implementation.

---

## Common Mistakes

::: warning Identify the modal, not the close button

Do not attempt to locate the "X" icon or close button.

Instead, identify the modal using text that is visible inside it.

```flow
flow.close "Welcome to the new dashboard";
```

not

```flow
flow.click button "Close";
```

unless you intentionally want to click a specific button.

:::

::: warning The locator is required

`flow.close` requires a locator that identifies the modal.

The following is invalid:

```flow
flow.close;
```

Instead, provide visible text from the dialog or overlay.

```flow
flow.close "We use cookies";
```

:::

::: warning Choose text that uniquely identifies the modal

If multiple dialogs contain the same text, provide a locator that uniquely identifies the intended overlay.

This helps Flowstride target the correct modal before performing geometric analysis.

:::

---
