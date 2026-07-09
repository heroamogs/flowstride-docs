# flow.hover

## Introduction

`flow.hover` is a **Flow Command** that activates hover-driven user interfaces.

Unlike traditional automation frameworks that perform a single browser hover event, Flowstride executes a multi-stage hover activation sequence designed to work across modern frontend frameworks, CSS hover states, JavaScript event handlers, and responsive component libraries.

Whether you're opening a dropdown menu, revealing a tooltip, expanding a flyout, or triggering a mega-menu, `flow.hover` adapts its activation strategy automatically.

---

## The Problem It Solves

Triggering hover states (like dropdown menus, tooltips, or mega-menus) is one of the most notoriously flaky actions in browser automation.

Modern web applications trigger hover menus in several completely different ways:

- Pure CSS (`:hover` pseudo-classes)
- JavaScript event listeners (`mouseenter`, `mouseover`)
- "Hover Intent" libraries that monitor physical mouse movement
- Mobile-first architectures where a hover interaction is actually implemented as a soft click

Traditional automation frameworks typically trigger only one of these mechanisms, causing tests to fail on modern React, Vue, and component-library applications where menus refuse to expand.

`flow.hover` removes this complexity by performing multiple activation strategies automatically.

---

## How flow.hover Works

`flow.hover` treats hovering as a **multi-stage activation sequence** rather than a single browser action.

Based on its implementation, Flowstride performs the following sequence whenever a hover is requested.

### 1. Accessibility Wakeup (Focus)

Flowstride first focuses the target element before performing any pointer interaction.

This activates components that listen for keyboard focus or WAI-ARIA accessibility events rather than mouse movement alone.

---

### 2. Physical Pointer Movement

Flowstride calculates the geometric centre of the target element and physically moves the virtual mouse to that location using multiple intermediate steps.

This satisfies UI libraries that monitor genuine pointer movement rather than synthetic hover events.

---

### 3. Native Hover

After positioning the pointer, Flowstride executes the browser's native hover operation as an additional activation mechanism.

---

### 4. Event Synthesizer

Flowstride injects a complete set of pointer and mouse events directly into the target element, including:

- `pointerover`
- `pointerenter`
- `mouseover`
- `mouseenter`
- `mousemove`

These events include real pointer coordinates, helping JavaScript frameworks detect the interaction correctly.

---

### 5. Soft Click Activation

Finally, Flowstride performs a forced activation click.

This helps activate responsive interfaces and component libraries that expose hover behaviour through click interactions instead of traditional mouse hover events.

---

### 6. Paint Buffer

Before continuing to the next Flow Command, Flowstride automatically waits for UI animations and transitions to complete.

This allows dropdowns, flyouts, and tooltips sufficient time to render before the next interaction begins.

---

## Syntax

```flow
flow.hover "<locator>";
```

```flow
flow.hover button "<locator>";
```

```flow
flow.hover link "<locator>";
```

```flow
flow.hover image "<locator>";
```

Like other UI Flow Commands, `flow.hover` also supports Flowstride's Smart Locator engine and Spatial Locators.

---

## Parameters

| Parameter | Required | Description                                                       |
| --------- | :------: | ----------------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element.                    |
| Locator   |    ✅    | Identifies the element that should receive the hover interaction. |

---

## Examples

### Open a mega-menu

Hover over a navigation category before selecting one of its child links.

```flow
Feature: Main Navigation

Scenario: Browse the laptop category

Given "Open the storefront"
  flow.open "/";

When "Reveal the Electronics menu"
  flow.hover "Electronics";

When "Open the Laptops category"
  flow.click link "Laptops";

Then "The laptops page is displayed"
  flow.expect visible "Shop All Laptops";
```

---

### Display a tooltip

Hover over an information icon before verifying the tooltip text.

```flow
Feature: Pricing Information

Scenario: View the pricing disclaimer

Given "Open the pricing page"
  flow.open "/pricing";

When "Reveal the pricing tooltip"
  flow.hover span "Pricing Info";

Then "The tooltip is displayed"
  flow.expect visible "Prices do not include regional taxes.";
```

---

### Hover using a Spatial Locator

`flow.hover` fully supports Spatial Locators.

```flow
When "Reveal the profile actions"
  flow.hover "Profile" rightOf "Search";
```

---

### Hover the application menu

Flowstride also supports the built-in smart burger fallback.

```flow
When "Open the navigation menu"
  flow.hover burger;
```

---

## When to Use flow.hover

Use `flow.hover` whenever an application changes its interface in response to pointer placement rather than navigation.

Typical examples include:

- Dropdown menus
- Mega menus
- Tooltips
- Flyout menus
- Popovers
- Hover cards
- Navigation panels

---

## Important Notes

::: info Multi-stage activation

`flow.hover` performs more than a traditional browser hover.

To maximise compatibility across modern frontend frameworks, Flowstride combines:

- Keyboard focus
- Physical pointer movement
- Native browser hover
- Synthesized pointer events
- Soft click activation

before continuing execution.

:::

::: info Smart Locator support

`flow.hover` uses the same Smart Locator engine as other UI Flow Commands.

It supports:

- Flow Elements
- Smart Locators
- Spatial Locators
- Burger menu fallback

without requiring additional syntax.

:::

---

## Common Mistakes

::: warning Hover before interacting

If a menu or tooltip only appears after hovering, always perform the hover before attempting to click items inside it.

Instead of:

```flow
flow.click link "Laptops";
```

use:

```flow
flow.hover "Electronics";

flow.click link "Laptops";
```

:::

::: warning Don't use hover for navigation

`flow.hover` is designed to reveal hidden interface elements.

Use `flow.click` when your intention is to navigate or activate a control directly.

:::

---
