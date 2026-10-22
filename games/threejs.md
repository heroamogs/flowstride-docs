# Three.js integration

The Three.js bridge works with your live scene, camera, canvas and constructors. It does not rebuild the scene or create another renderer/animation loop.

```ts
import { registerThreeGame } from 'flowstride/dist/game/three-bridge.js';
import { Vector3, Raycaster } from 'three';

const bridge = registerThreeGame({
  scene,
  camera,
  canvas: renderer.domElement,
  Vector3,
  Raycaster,
  objects: { 'player-piece': playerPiece },
  readState: () => ({ selectedId: gameState.selectedId })
});
```

The variable names represent your application's existing objects. Register after the scene and camera are ready. Alternatively give objects a stable `userData.flowstrideId`. Use unique IDs; a displayed name is not necessarily a stable identifier.

```flow
Feature: Three.js selection
let game = "flowstride:game"

Scenario: The player selects a piece

Given "The scene is open"
  flow.open "/";

When "The player selects a known object"
  game.select { "id": "player-piece" }

Then "The application records the selection"
  game.expectState {
    "path": "selectedId",
    "equals": "player-piece"
  }
```

## Picking behavior

The bridge projects the object's live position and raycasts the actual scene. Hidden, off-camera, occluded, non-pickable or covered targets fail explicitly. An optional local `userData.flowstridePickPoint: [x,y,z]` can identify a usable point when the object's center is unsuitable.

Keep the application's normal event handling active: `select` sends real pointer input at the resolved location. It does not call your game's selection function directly.

## Lifecycle and fixtures

Call `bridge.dispose()` when replacing the scene/game instance. `registerObject(id, object)` can add a new unique object. Optional state and fixtures use the same rules as the [generic bridge](/games/state-and-fixtures); fixture registration requires explicit test mode.

Current automated qualification includes real Three.js fixtures under Chromium. That does not establish support for every WebGL engine, custom raycaster, physical phone or browser engine.
