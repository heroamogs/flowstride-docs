# flow.drag

Drag a DOM target into a destination. Available in OS and Cloud.

```flow
flow.drag "#task-102" into "#done-column";
flow.assert.that {
  "selector": "#done-column #task-102",
  "condition": "visible"
};
```

Replace the selectors with your application's draggable item and drop zone. The adapter attempts native dragging and supported pointer/HTML5 fallbacks. Different widgets accept different event sequences; command completion alone does not prove the application accepted the move.

Assert the resulting column, position or saved business state. Canvas gestures use [game.drag or game.swipe](/games/actions#input) instead. [Targeting](/guide/targeting) explains how to select a unique DOM source/destination.
