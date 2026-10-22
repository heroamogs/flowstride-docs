# Canvas and controls

The canvas represents test steps, organization and the intended execution path. It is not a conditional workflow programming engine.

## Authoring tools

| Tool | Use |
| --- | --- |
| Hand | Pan across the workspace |
| Select | Select and reposition an entity; open its properties |
| Step | Add an action/observation node |
| Group | Draw a boundary around related steps |
| Arrow | Connect the next step in the journey |
| Text | Add a contextual note, precondition or cleanup reminder |

Groups organize the display and reporting. Moving a node into a group does not change the application's behavior. Keep group boundaries clear so the intended grouping is readable.

The UI also contains a Requirement tool entry. Do not rely on it as a complete requirements-management or traceability system; use the implemented Test Plan/reference fields and an external requirements record as described in [traceability](/manual-workspace/traceability).

## Design shortcuts

Focus the canvas, not a rich-text or input field.

| Shortcut | Action in Design Mode |
| --- | --- |
| Ctrl/Cmd + Z | Undo a canvas edit |
| Ctrl/Cmd + Shift + Z, or Ctrl/Cmd + Y | Redo |
| Ctrl/Cmd + C / V | Copy/paste selected canvas entities using the engine's internal clipboard |
| Ctrl/Cmd + D | Duplicate the selected entity/group |
| Delete / Backspace | Delete selected entities |

Undo history is in-memory and bounded; it is not a versioned backup. Save reviewed templates and keep file backups. Copying canvas entities does not put a portable test file onto the operating-system clipboard.

## Connections and order

Execution begins at the lowest internal node ID. It follows the first outgoing connection from the current node. Visual step labels are for presentation; renumbering a label does not reorder the graph.

Use a linear path with one outgoing arrow per node. Use separate flows for alternative paths, permission variants and failure cases. Unconnected nodes can remain Pending when the connected path ends; inspect all results before submitting.

## Zoom and navigation

Use the toolbar zoom controls and Hand tool to keep the current section visible. Keep text readable, place the primary path in a consistent direction, and use notes for context instead of putting every detail inside node titles.

Entering Execution Mode changes keyboard behavior. [Read the execution controls](/manual-workspace/execution#record-outcomes) before using Delete, Tab or Escape.
