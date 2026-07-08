# flow.drag

## Introduction

`flow.drag` is a **Flow Command** that performs drag-and-drop interactions between two elements.

Whether an application uses native HTML5 drag-and-drop or a custom JavaScript implementation, `flow.drag` automatically performs the appropriate interaction without requiring changes to your Flow script.

---

## The Problem It Solves

Automating "Drag and Drop" interactions is notoriously one of the most fragile tasks in web testing. This is because modern web applications generally use one of two completely different sets of browser APIs to build drag-and-drop features:

**HTML5 Native Drag-and-Drop:** Uses specific browser events like `dragstart`, `dragover`, and `drop`.

**Custom Pointer Implementations:** Popular libraries like **react-beautiful-dnd** or **dnd-kit** completely ignore the native HTML5 API. Instead, they track raw `mousedown`, `mousemove`, and `mouseup` (or touch) coordinates to calculate where an element is being dragged.

Most standard automation tools only fire one set of these events, meaning your test might work on an HTML5 page but completely fail on a React Kanban board.

`flow.drag` removes this complexity.

---

## How flow.drag Works

Flowstride's `flow.drag` command abstracts away the underlying event matrix. When you tell the engine to move an element, the Web Adapter performs a high-fidelity human simulation.

### Coordinate Geometry Resolution

The engine calculates the exact geometric bounding boxes and center points for both your source (what you are dragging) and your destination (where you are dropping it).

---

### The Universal Event Sweep

Instead of guessing how the developer built the UI, Flowstride forcefully fires both sets of events in a complete interaction sequence.

The engine:

1. Moves the virtual mouse to the center of the source element.
2. Fires the appropriate drag initiation events.
3. Physically traces a path towards the destination.
4. Fires the corresponding drop events when the destination is reached.

This allows the same Flow Command to work across both native HTML5 drag-and-drop and modern JavaScript drag libraries.

---

### Animation Synchronization

Before completing the drop, Flowstride automatically waits for CSS transitions, animations, and layout shifts to settle, ensuring the destination is actually ready to receive the dragged element.

---

## Syntax

```flow
flow.drag "<source>" "<destination>";
```

---

## Parameters

| Parameter   | Required | Description                                       |
| ----------- | :------: | ------------------------------------------------- |
| Source      |    ✅    | The element to drag.                              |
| Destination |    ✅    | The element that should receive the dragged item. |

---

## Examples

### Move a task between Kanban columns

```flow
Feature: Task Management

Scenario: Move a ticket

Given "Open the sprint board"
  flow.open "/board/sprint-1";

When "Move the database task"
  flow.drag "Task: Update Database" "Column: In Progress";

Then "Verify the task moved"
  flow.expect visible "In Progress (1)";
```

---

### Reorder a playlist

```flow
Feature: Playlist Management

Scenario: Reorder videos

Given "Open the playlist"
  flow.open "/playlist/favorites";

When "Move the third video to the top"
  flow.drag "Video Item 3" "Video Item 1";

Then "Save the playlist"
  flow.click button "Save Order";
```

---

### Move a dashboard widget

```flow
flow.drag "Revenue Widget" "Top Row";
```

---

## When to Use flow.drag

Use `flow.drag` whenever an element must be physically moved to another location within the interface.

Typical examples include:

- Kanban boards
- Playlist reordering
- Dashboard widgets
- File organization
- Drag-and-drop upload zones
- Custom sliders
- Sortable lists

---

## Why It Is Resilient

One of the biggest advantages of `flow.drag` is that it adapts automatically to the application's drag-and-drop implementation.

Whether the page uses:

- Native HTML5 drag events
- React Beautiful DnD
- dnd-kit
- Vue drag-and-drop libraries
- Custom pointer tracking

the same Flow script continues to work.

Flowstride determines how to perform the interaction at runtime, allowing a single Flow Command to support a wide variety of modern frontend frameworks without requiring framework-specific automation code.

---

## Common Mistakes

::: warning Do not separate the drag operation into multiple commands

The following introduces unnecessary steps:

```flow
flow.click "Task";

flow.click "Column: In Progress";
```

Instead, perform the entire interaction with a single command.

```flow
flow.drag "Task: Update Database" "Column: In Progress";
```

:::

::: warning Drag to the destination element

Always provide the element representing the intended drop target rather than relying on screen coordinates.

This makes the Scenario easier to read and more resilient to layout changes.

:::

---
