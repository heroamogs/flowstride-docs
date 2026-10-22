# Test browser games

Flowstride has native input, visual and state APIs for browser games. Use the built-in alias instead of a custom plugin file or a runner wrapper.

```flow
Feature: Browser game
let game = "flowstride:game"

Scenario: A player scores

Given "The board is open"
  flow.open "/";

When "The player taps the center"
  game.tap {
    "canvas": "#game",
    "x": 0.5,
    "y": 0.5
  }

Then "The score is updated"
  game.expectState {
    "path": "score",
    "equals": 1
  }
```

The application must provide the `#game` canvas and a state bridge for `expectState`. Input-only actions do not require a state bridge. The score/rules are defined by the game, not by Flowstride.

## Register observable state

In the browser application's bundle:

```ts
import { registerGame } from 'flowstride/dist/game/bridge.js';

const bridge = registerGame({
  readState: () => ({
    score: gameState.score,
    level: gameState.level
  })
});

// Dispose when the game instance is replaced.
// bridge.dispose();
```

Expose a small, serializable state surface that represents the behavior you need to verify. Keep hidden/private information out of it. Add [test-only fixtures](/games/state-and-fixtures) when the game needs controlled setup.

## Choose a device profile

```sh
npx flowstride run flows --ci --device desktop
npx flowstride run flows --ci --device phone
npx flowstride run flows --ci --device landscape
```

Phone and landscape use Chromium device emulation. They do not establish physical-device compatibility. Touch dragging uses Chromium CDP. Other browser engines and game engines require their own qualification.

## What to assert

Use state/UI assertions for rules and progression. Use pixel differences to confirm a visible change or preservation. A pixel change alone does not establish a correct move, a valid score or persistence.

Explore the [game action reference](/games/actions), [state/fixtures](/games/state-and-fixtures), and [Three.js integration](/games/threejs).
