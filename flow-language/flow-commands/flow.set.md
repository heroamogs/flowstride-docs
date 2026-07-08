# flow.set

## Introduction

`flow.set` is a **Flow Command** that forcefully injects a value into an element.

Unlike `flow.type`, which simulates keyboard input, `flow.set` writes directly to the underlying DOM element and synchronizes the application's internal state.

It is designed specifically for modern UI components that reject normal typing, such as custom date pickers, range sliders, masked inputs, and other framework-controlled controls.

---

## The Problem It Solves

Modern frontend frameworks such as React, Vue, and Angular frequently replace standard HTML inputs with highly interactive components.

Examples include:

- Date pickers
- Range sliders
- Masked inputs
- Read-only fields
- Custom dropdowns
- Third-party UI libraries

These components often reject simulated keyboard input because they expect users to interact with the visual component instead of manually typing into the underlying input.

`flow.set` exists to bridge that gap.

---

## Syntax

```flow
flow.set "<locator>" "<value>";
```

```flow
flow.set <element> "<locator>" "<value>";
```

---

## Parameters

| Parameter | Required | Description                                                             |
| --------- | :------: | ----------------------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element such as `input` or `div`. |
| Locator   |    ✅    | Identifies the target control.                                          |
| Value     |    ✅    | The value to inject into the component.                                 |

---

## How flow.set Works

Unlike `flow.type`, `flow.set` does not simulate keyboard input.

Instead, it performs a multi-stage injection process designed for modern frontend frameworks.

### 1. Native DOM Injection

Flowstride bypasses framework-controlled input wrappers and writes the value directly to the native HTML element.

This allows values to be injected even when the application blocks normal keyboard input.

---

### 2. State Synchronization

After injecting the value, Flowstride updates the component's internal state by synchronizing common framework-managed attributes.

It also dispatches the browser events typically expected by frontend frameworks, ensuring that React, Vue, Angular, and similar libraries recognise the change.

---

### 3. Automatic Calendar Recovery

Date pickers deserve special handling.

If Flowstride detects that:

- the supplied value represents a date, and
- the application rejects the injected value,

the engine automatically switches strategy.

Instead of continuing with DOM injection, it:

1. Opens the calendar widget.
2. Converts the supplied ISO date into a human-readable calendar value.
3. Locates the corresponding calendar day.
4. Selects the date exactly as a real user would.

This entire recovery process happens automatically without requiring changes to the Flow script.

---

## Examples

### Set a departure date

```flow
Feature: Flight Booking

Scenario: Select a departure date

Given "Open the flight booking page"
  flow.open "/flights";

When "Choose a departure date"
  flow.set input "Departure Date" "2026-07-15";

Then "Search for available flights"
  flow.click button "Search Flights";
```

If direct injection is not accepted by the application, Flowstride automatically opens the calendar and selects **15 July 2026**.

---

### Set a custom range slider

```flow
Feature: Product Search

Scenario: Filter laptops by price

Given "Open the laptops category"
  flow.open "/category/laptops";

When "Set the maximum price"
  flow.set div "Max Price Slider" "1500";

Then "Verify the filtered results"
  flow.expect visible "Laptops under $1500";
```

---

### Set a masked input

```flow
flow.set input "Phone Number" "+2348012345678";
```

---

## When to Use flow.set

Use `flow.set` when interacting with components that reject standard typing.

Typical examples include:

- Date pickers
- Calendar controls
- Range sliders
- Masked inputs
- Read-only inputs
- Framework-controlled components
- Third-party UI widgets

For ordinary text fields, `flow.type` remains the recommended command.

---

## flow.set vs flow.type

| `flow.type`                    | `flow.set`                                     |
| ------------------------------ | ---------------------------------------------- |
| Simulates keyboard typing.     | Injects values directly into the DOM.          |
| Best for standard text inputs. | Best for complex UI components.                |
| Mimics real user keystrokes.   | Synchronizes component state programmatically. |
| Recommended for most forms.    | Recommended when normal typing is rejected.    |

---

## Common Use Cases

Use `flow.set` to:

- Select dates.
- Set price sliders.
- Populate masked inputs.
- Update read-only fields.
- Interact with complex React or Vue controls.

---

## Common Mistakes

::: warning Prefer `flow.type` for ordinary text fields

Use `flow.type` whenever a component accepts normal keyboard input.

Reserve `flow.set` for components that intentionally block or ignore typing.

:::

::: warning Use ISO dates for calendar controls

When setting dates, prefer the ISO format.

```flow
flow.set input "Departure Date" "2026-07-15";
```

This allows Flowstride to activate its automatic calendar recovery if required.

:::

---
