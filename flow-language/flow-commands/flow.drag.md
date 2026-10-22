# flow.drag

Drag a source element into a destination.

## Example

```flow
flow.drag "Item A" into "Completed";
```

## Behavior and limits

For coordinate-based canvas gestures use native game drag/swipe rather than pretending a canvas object is a DOM element.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
