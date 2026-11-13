# Structured command index

Both Flowstride engines accept the same built-in structured commands. A **structured command** takes a JSON object containing named inputs. An **assertion** verifies a result. Other structured commands can send a request, configure a browser, capture evidence or prepare test data.

```flow
flow.assert.that {
  "target": "Order summary",
  "condition": "visible",
  "timeout": 5000
};
```

Put the command inside a valid `.flow` scenario. Use JSON double quotes and type booleans and numbers as `true` and `5000`. Use `{}` for commands that take no settings. Keep one `Feature` at the top of the file and use [the normal scenario structure](/guide/core-concepts). An intermediate `And` is for assertions. `Then` is the last block of its scenario and can hold multiple commands.

## Readable targeting

Start with the label or text a tester can see. When two controls have the same label, add the element type, a named container or a spatial relationship.

```flow
flow.assert.that {
  "target": {
    "text": "Submit",
    "element": "button",
    "inside": "Checkout",
    "under": "Password"
  },
  "condition": "enabled"
};
```

Use `inside` for containment. You can add one of `near`, `above`, `under` (or `below`), `leftOf` and `rightOf` for layout. These relationships depend on the current page layout. Supported `element` values in a readable object are `button`, `link` (or `a`), `input` (or `field`), `div`, `span`, `image` (or `img`), `text`, `table`, `tr`, `th`, `td` and `iframe`.

For a browser assertion, `role` with an optional exact accessible `name` is another way to identify the control. If readable or semantic targeting cannot uniquely identify it, supply an explicit selector to a command that supports `selector`. Use it as an alternative to `target`.

```flow
flow.assert.that {
  "selector": "[data-testid='checkout-submit']",
  "condition": "enabled"
};
```

Each link below leads to its inputs and an example. The [structured assertions reference](/reference/assertions) keeps all checks, including every `flow.assert.that` condition, on one page.

## Assertions and comparisons

| Task | Commands |
| --- | --- |
| Browser conditions | [`flow.assert.that`](/reference/assertions#flow-assert-that) |
| Stored values | [`flow.assert.value`](/reference/assertions#flow-assert-value) |
| Dialog | [`flow.dialog.expect`](/reference/assertions#flow-dialog-expect) |
| Network traffic | [`flow.network.expect`](/reference/assertions#flow-network-expect) |
| Downloads | [`flow.download.expect`](/reference/assertions#flow-download-expect) |
| Spies and stubs | [`flow.stub.expect`](/reference/assertions#flow-stub-expect) |
| JSON Schema | [`flow.api.expectSchema`](/reference/assertions#flow-api-expect-schema) |
| API polling | [`flow.api.poll`](/reference/assertions#flow-api-poll) |
| Console messages | [`flow.console.expect`](/reference/assertions#flow-console-expect) |
| Live messages | [`flow.channel.expect`](/reference/assertions#flow-channel-expect) |
| Accessibility scan | [`flow.a11y.scan`](/reference/assertions#flow-a11y-scan) |
| ARIA snapshot | [`flow.a11y.snapshot`](/reference/assertions#flow-a11y-snapshot) |
| ARIA match | [`flow.a11y.match`](/reference/assertions#flow-a11y-match) |
| Visual comparison | [`flow.visual.match`](/reference/assertions#flow-visual-match) |

## Browser interactions and scope

| Task | Commands |
| --- | --- |
| Configurable typing | [`flow.input.type`](/reference/interaction-commands#configurable-typing) |
| Scrolling | [`flow.scroll`](/reference/interaction-commands#scrolling) |
| Named tabs | [`flow.tab.name`](/reference/interaction-commands#named-tabs), [`flow.tab.arm`](/reference/interaction-commands#named-tabs), [`flow.tab.use`](/reference/interaction-commands#named-tabs), [`flow.tab.close`](/reference/interaction-commands#named-tabs) |
| Frames | [`flow.frame.use`](/reference/interaction-commands#frames), [`flow.frame.main`](/reference/interaction-commands#frames) |
| Dialog capture | [`flow.dialog.arm`](/reference/interaction-commands#dialogs) |

## Files, data and suite control

| Task | Commands |
| --- | --- |
| File selection | [`flow.files.select`](/reference/data-and-run-control#select-files-and-folders) |
| Fixture data | [`flow.data.load`](/reference/data-and-run-control#load-a-fixture) |
| Local file inspection | [`flow.file.read`](/reference/data-and-run-control#read-a-local-file) |
| Data-driven scenarios | [`flow.data.cases`](/reference/data-and-run-control#run-a-scenario-once-per-row) |
| Cleanup | [`flow.cleanup.register`](/reference/data-and-run-control#register-cleanup) |
| Conditional skips | [`flow.skipIf`](/reference/data-and-run-control#skip-a-scenario-for-one-browser) |

## API and browser network

| Task | Commands |
| --- | --- |
| Request and body formats | [`flow.api.request`](/reference/structured-api#requests) |
| Named API contexts | [`flow.api.create`](/reference/structured-api#named-api-contexts), [`flow.api.use`](/reference/structured-api#named-api-contexts), [`flow.api.close`](/reference/structured-api#named-api-contexts) |
| Routes | [`flow.network.route`](/reference/structured-api#routes), [`flow.network.unroute`](/reference/structured-api#routes) |
| Browser request and response capture | [`flow.network.arm`](/reference/structured-api#capture-an-event), [`flow.network.wait`](/reference/structured-api#capture-an-event) |

## Application evidence

| Task | Commands |
| --- | --- |
| Console observer | [`flow.console.arm`](/reference/application-evidence#console-messages) |
| WebSocket and SSE observers | [`flow.channel.arm`](/reference/application-evidence#live-channels) |
| Visual capture | [`flow.visual.capture`](/reference/application-evidence#visual-comparison) |

## Profiles, downloads and browser tools

| Task | Commands |
| --- | --- |
| Browser profiles and permissions | [`flow.browser.create`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.use`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.close`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.list`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.offline`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.permissions`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.clearPermissions`](/reference/native-browser-commands#profiles-and-runtime-settings), [`flow.browser.geolocation`](/reference/native-browser-commands#profiles-and-runtime-settings) |
| Download capture and save | [`flow.download.arm`](/reference/native-browser-commands#downloads), [`flow.download.save`](/reference/native-browser-commands#downloads) |
| Clock control | [`flow.clock.install`](/reference/native-browser-commands#browser-clock), [`flow.clock.pauseAt`](/reference/native-browser-commands#browser-clock), [`flow.clock.resume`](/reference/native-browser-commands#browser-clock), [`flow.clock.runFor`](/reference/native-browser-commands#browser-clock), [`flow.clock.fastForward`](/reference/native-browser-commands#browser-clock), [`flow.clock.setFixedTime`](/reference/native-browser-commands#browser-clock), [`flow.clock.setSystemTime`](/reference/native-browser-commands#browser-clock) |
| Function spies and stubs | [`flow.stub.install`](/reference/native-browser-commands#function-spies-and-stubs), [`flow.stub.restore`](/reference/native-browser-commands#function-spies-and-stubs) |
| Trace evidence | [`flow.trace.start`](/reference/native-browser-commands#traces-and-har), [`flow.trace.stop`](/reference/native-browser-commands#traces-and-har) |
| HAR replay | [`flow.har.replay`](/reference/native-browser-commands#traces-and-har) |
| Components | [`flow.component.mount`](/reference/native-browser-commands#components), [`flow.component.update`](/reference/native-browser-commands#components), [`flow.component.unmount`](/reference/native-browser-commands#components) |

## Game commands

The built-in game module also uses objects. Declare `let game = "flowstride:game"` in the flow. The following commands work with the application’s canvas and, where needed, its game bridge.

| Task | Commands and examples |
| --- | --- |
| Canvas input | [`game.tap`, `game.drag`, `game.swipe` and `game.key`](/games/actions#input) |
| Capture or compare pixels | [`game.checkpoint` and `game.snapshot`](/games/actions#screens-and-pixel-comparisons), [`game.expectVisual`](/reference/assertions#game-expect-visual) |
| Read and save game state | [`game.state` and `game.snapshotState`](/games/state-and-fixtures#observe-then-assert) |
| Verify game state or persistence | [`game.expectState`](/reference/assertions#game-expect-state), [`game.expectPreserved`](/reference/assertions#game-expect-preserved) |
| Prepare test state and pick a Three.js object | [`game.fixture`](/games/state-and-fixtures#test-only-fixtures), [`game.select`](/games/threejs) |

## Related commands with keyword syntax

These additions use quoted values or keywords outside a JSON object. They can be combined with any structured workflow that uses the same runner or browser scope.

| Task | Commands and examples |
| --- | --- |
| Read a browser property or a captured response field | [`flow.extract property` and `flow.extract network`](/flow-language/flow-commands/flow.extract) |
| Record a failed check and continue | [`flow.soft`](/reference/assertions#continue-after-a-failed-assertion) |
| Set a delay, log a test note, pause or pace actions | [`flow.wait`, `flow.log`, `flow.pause` and `flow.pace`](/reference/data-and-run-control#execution-controls) |
| Press a key, clear or focus a control, and use pointer actions | [`flow.press`, `flow.clear`, `flow.focus`, `flow.blur`, `flow.doubleClick` and `flow.rightClick`](/reference/interaction-commands#keyboard-and-pointer) |
| Navigate browser history | [`flow.goBack`, `flow.goForward` and `flow.reload`](/reference/interaction-commands#browser-history) |
| Reproduce generated data | [`flow.data.seed`](/reference/data-and-run-control#seed-generated-values) |
| Reuse a command fragment | [`flow.call`](/reference/data-and-run-control#reuse-command-fragments) |
| Select scenarios from the CLI | [`Tags:` and `--tag`](/reference/data-and-run-control#select-scenarios-by-tag) |

The [browser](/reference/ui-commands) and [API](/reference/api-commands) indexes cover established keyword commands. Projects can also define their own object arguments through the [plugin SDK](/flow-language/getting-started/plugins).
