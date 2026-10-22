# State, fixtures and persistence

The browser bridge gives tests a deliberate observation/setup surface. Keep it small, serializable and tied to meaningful game behavior.

## Observe, then assert

```ts
import { registerGame } from 'flowstride/dist/game/bridge.js';

registerGame({
  readState: () => ({
    score: gameState.score,
    campaign: { level: gameState.level }
  })
});
```

```flow
Feature: Campaign
let game = "flowstride:game"

Scenario: A campaign value is preserved

Given "The campaign is open"
  flow.open "/";
  game.snapshotState {
    "name": "campaign",
    "path": "campaign"
  }

When "The page is reopened"
  flow.open "/";

Then "The stored campaign remains"
  game.expectPreserved { "name": "campaign" }
```

The game must implement its own persistence. Flowstride compares observations; it does not add a save system to the game. State snapshot names are worker-local, not a shared parallel database.

## Test-only fixtures

```ts
registerGame({
  readState: () => ({ score: gameState.score }),
  testMode: true,
  fixtures: {
    reset: () => {
      gameState.score = 0;
    }
  }
});
```

```flow
Feature: Game reset
let game = "flowstride:game"

Scenario: A controlled score is observed

Given "The game test build is open"
  flow.open "/";
  game.fixture { "name": "reset" }

When "The player scores"
  game.tap {
    "canvas": "#game",
    "x": 0.5,
    "y": 0.5
  }

Then "The score is one"
  game.expectState {
    "path": "score",
    "equals": 1
  }
```

Enable `testMode: true` only in a dedicated test build. The application decides whether that build includes the fixture and what data it accepts. Fixtures are unavailable when the bridge is not explicitly registered in test mode.

A fixture can create state a human could not reach; still test the real journey separately. Keep acceptance assertions about the actual game behavior, not only the fixture function's return value.
