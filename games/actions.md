# Game action reference

Declare `let game = "flowstride:game"` within a Feature or Scenario. Arguments are JSON objects or a single string. There is no custom plugin file to install.

## Input

| Action | Arguments and behavior |
| --- | --- |
| `tap` | `canvas`, `x`, `y`; relative coordinates by default; `unit: "pixels"` uses coordinates within the canvas |
| `drag` | `canvas`, `from: {x,y}`, `to: {x,y}`, optional `duration` in ms and `input: "mouse"` or `"touch"` |
| `swipe` | Same coordinate structure as drag; forces touch input |
| `key` | Key string, or `{key, duration}` for an optional hold |
| `select` | Stable object `{id}` resolved by the application bridge, then actual pointer input |

```flow
Feature: Game gestures
let game = "flowstride:game"

Scenario: Move a piece

Given "The game is open"
  flow.open "/";

When "The player drags a piece"
  game.drag {
    "canvas": "#board",
    "from": {
      "x": 0.25,
      "y": 0.5
    },
    "to": {
      "x": 0.75,
      "y": 0.5
    },
    "duration": 300
  }
  game.key {
    "key": "ArrowRight",
    "duration": 100
  }

Then "The move is recorded"
  game.expectState {
    "path": "moves",
    "equals": 1
  }
```

Coordinates must remain inside a visible, uncovered canvas. Relative coordinates use fractions of its bounds; 1.0 is the outside boundary, not an inclusive last pixel. Use Chromium and a touch-capable profile for touch dragging/swiping. Mouse/keyboard checks follow the selected browser's behavior. Gesture/key durations must be within the configured timeout.

## Screens and pixel comparisons

| Action | Purpose |
| --- | --- |
| `checkpoint` | Save a named PNG; optional canvas selector |
| `snapshot` | Hold a named canvas image in worker memory |
| `expectVisual` | Compare with a named snapshot or project-local baseline image |

```flow
Feature: Canvas rendering
let game = "flowstride:game"

Scenario: A turn changes the board

Given "The game is open"
  flow.open "/";
  game.snapshot {
    "name": "before",
    "canvas": "#board"
  }

When "A turn is taken"
  game.tap {
    "canvas": "#board",
    "x": 0.5,
    "y": 0.5
  }

Then "The board changes visibly"
  game.expectVisual {
    "name": "before",
    "canvas": "#board",
    "minChange": 0.001
  }
  game.checkpoint {
    "name": "after-turn",
    "canvas": "#board"
  }
```

`minChange`/`maxChange` are ratios between 0 and 1, not percentages. With neither specified, the default requires zero changed pixels under the implementation's pixel-difference rule. Equal dimensions are required. Stabilize animations, fonts and the viewport before treating a comparison as a reliable signal. This is not Playwright Test's complete golden-screenshot update workflow.

## State and setup

| Action | Purpose |
| --- | --- |
| `state` | Read exposed state, optionally at a dotted `path` |
| `expectState` | Wait for deep equality with required `equals` |
| `snapshotState` | Save named state in worker memory, optionally at a path |
| `expectPreserved` | Compare current state with a named state snapshot |
| `fixture` | Run an application-registered named fixture in explicit test mode |

`select`, state and fixture actions depend on [the browser bridge](/games/state-and-fixtures). Application-specific rules remain in your game or project plugin.

## Keyboard chords and reviewed visual baselines

```flow
game.key {
  "key": "Shift+ArrowRight",
  "duration": 100
};
```

This holds the chord's keys and releases them in reverse order, including cleanup after an error. Your game must define what the combination means; follow it with a state/UI assertion. Click/focus the game first when it requires focus. A literal `+` is treated as that single key.

For a durable visual baseline, capture a stable canvas with `game.checkpoint`, inspect the PNG, and deliberately copy the accepted file into a project-local baseline directory. Then compare:

```flow
game.expectVisual {
  "canvas": "#board",
  "baseline": "baselines/board.png",
  "maxChange": 0.001
};
```

The current image and baseline must have equal dimensions. Fix the viewport, fonts, animations and relevant state before capture. Review a changed image before replacing an accepted baseline. `--update-baselines` is for ARIA baselines; it does not silently accept new game screenshots.

Named `snapshot`/`snapshotState` entries remain in worker memory. They are not durable global baselines or values automatically exposed as DSL `@name` extractions. Check state for game rules and pixels for rendering; neither alone proves every aspect of a move.
