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

Phone and landscape are browser device-emulation profiles, not physical-device qualification. Chromium provides the mobile-emulation path; Firefox omits the unsupported mobile flag. Touch dragging/swiping uses Chromium CDP and needs a touch-capable profile. Mouse/keyboard, state and canvas checks can be run on other engines where compatible; qualify your actual game. [Browser compatibility](/guide/browser-compatibility) lists the limits.

## What to assert

Use state/UI assertions for rules and progression. Use pixel differences to confirm a visible change or preservation. A pixel change alone does not establish a correct move, a valid score or persistence.

Explore the [game action reference](/games/actions), [state/fixtures](/games/state-and-fixtures), and [Three.js integration](/games/threejs).

## Run the included canvas game

Use a new npm project so the example configuration does not replace your own:

```sh
npm init -y
npm i flowstride
npx flowstride install chromium
cp -R node_modules/flowstride/examples/native-game/. .
npx flowstride run --ci
```

On PowerShell, copy the contents with `Copy-Item -Recurse node_modules/flowstride/examples/native-game/* .`. The example includes `server.mjs`, configuration and `flows/canvas.flow`. Its `webServer` starts the local app, waits for readiness and stops it after the run.

Expected: seven passing commands covering navigation, fixture reset, an initial snapshot, a canvas tap, state, visual change and a checkpoint. Inspect `flowstride-artifacts/summary.json`, JUnit and the run's video/checkpoint files.

For a deliberate negative check, copy the flow under a separate filename and change one expected state value to one the app cannot produce. Run only that file with `--ci`; it must fail with a nonzero exit and retain the failed step's diagnostic evidence. Restore or exclude the negative file from the passing suite.

The same installed example can run with a connected Cloud engine. Device-emulation, touch and browser limits remain as described above; the example does not claim coverage of every game engine or a real phone.
