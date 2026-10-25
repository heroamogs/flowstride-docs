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

The UI also contains a Requirement tool entry. Do not rely on it as a complete requirements-management or traceability system; use the implemented Test Plan and rich-text notes and an external requirements record as described in [traceability](/manual-workspace/traceability).

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

## Make a connected, readable case

1. Add the first Step and give it a short action title.
2. Add the next Step and connect their anchors with the Arrow tool. An anchor-to-anchor connection defines progression; a decorative free arrow does not create an executable relationship between steps.
3. Continue with one outgoing connection per step, then check the highlighted start in Execution Mode.
4. Add a Group around a coherent part of the journey, such as authentication or checkout. Group membership follows node-center placement inside its bounds.
5. Add Text for preconditions, fixture IDs or cleanup reminders. Resize text independently so notes remain readable.

Dragging a group moves its contained nodes. Floating notes are separate entities; confirm their position after reorganizing a group. Deleting a group does not mean every contained step should disappear. Review the resulting canvas and save intentionally.

The visual step-number menu can change the displayed label. Internal IDs/connections still define progression. Displaying a node as “1” does not make it the execution start.

## Move, copy and recover edits

Wheel panning, zoom/recenter controls and edge auto-pan help navigate a large canvas. Use Hand when you intend to move the view and Select when you intend to move an entity. Check the active tool before dragging.

Copy/paste uses an internal canvas clipboard and remaps copied entity/connection IDs. Check that the copied path remains connected to the intended new nodes; clipboard content is not a portable project export. Undo retains up to 50 in-memory snapshots. Save templates and backups for durable recovery.

## Connections panel

The property editor's **Connections** tab is a scaffold. Use the implemented canvas arrow anchors to connect steps; do not rely on that tab as a connection-management form, conditional branch editor or loop designer.
