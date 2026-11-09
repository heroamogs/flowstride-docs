# Structured assertions

Use this page to find every built-in assertion that accepts a JSON object in Flowstride OS and Cloud. A structured assertion has named settings inside `{ }`, such as the target, the condition and the expected value. `flow.expect` is the shorter [keyword-style assertion](/flow-language/flow-commands/flow.expect). Both styles can appear in the same scenario.

| What you want to verify | Where to look |
| --- | --- |
| Element state, text, attributes, browser properties, page or storage | [All `flow.assert.that` conditions](#flow-assert-that) |
| A value extracted from the browser, API, captured network event or fixture | [All `flow.assert.value` operators](#flow-assert-value) |
| Dialog details, network traffic, a downloaded file, a spy/stub, console output or live messages | [Events and files](#events-and-files) |
| API response shape or a job that changes state | [API contracts and polling](#api-contracts-and-polling) |
| Accessibility, ARIA trees or a visual baseline | [Accessibility and visuals](#accessibility-and-visuals) |
| Game state, persistence or canvas pixels | [Game assertions](#game-assertions) |

Start with the readable label or text and narrow it with an element type, a containing form or a spatial relationship. Keep an explicit selector available for cases where the application gives you no reliable readable target. [Targeting syntax and examples](/reference/structured-commands#readable-targeting).

Use `And` for an intermediate assertion block and put it before the final `Then`. Put several checks under one `Then` when they belong to the same outcome. Each file starts with one `Feature`, and only a new `Scenario` can start another block after that `Then`.

```flow
Feature: Checkout

Scenario: Submit a completed form
  Given "Checkout is open"
    flow.open "/checkout";

  When "The customer fills in Email"
    flow.type input "Email" "reader@example.test";

  And "The checkout button is available"
    flow.assert.that {
      "target": {
        "text": "Submit",
        "element": "button",
        "inside": "Checkout"
      },
      "condition": "enabled"
    };

  When "The customer submits"
    flow.click button "Submit" inside "Checkout";

  Then "The order was accepted"
    flow.expect visible "Order received";
    flow.assert.that {
      "condition": "url",
      "matches": "/orders/[^/]+$"
    };
```

## flow.assert.that {#flow-assert-that}

Checks one condition and retries the observation until it passes or the timeout expires. The preceding click, API call or other action runs separately. For element checks, choose one of `target`, `role` with optional exact accessible `name`, or `selector`. The page and storage checks need only their expected value or key. Use an [explicit frame scope](/reference/interaction-commands#frames) for a sequence inside an iframe. The optional `frame` field on element assertions scopes just that lookup.

Every condition supports `timeout` in milliseconds and `not` to invert its result. Use `value` for a typed expectation and `matches` with optional `flags` (`i`, `m`, `s`, `u`) for a regex on a text value. Supply only one expectation. Most element checks require exactly one match. `count`, `attached` and a missing target for `hidden` are described below.

Add a `message` to explain the intent, for example “Checkout should allow submission.” The terminal, dashboard and CI evidence can show target lookup, uniqueness and condition checks separately, with the expected and observed results where available. When lookup fails, a dependent condition can be marked as unevaluated. [Reading failure diagnostics](/guide/assertions-and-diagnostics).

| Group | Conditions |
| --- | --- |
| State | [`visible`](#visible), [`hidden`](#hidden), [`attached`](#attached), [`enabled`](#enabled), [`disabled`](#disabled), [`editable`](#editable), [`checked`](#checked), [`empty`](#empty), [`focused`](#focused), [`inViewport`](#inviewport) |
| Element content and metadata | [`text`](#text), [`containsText`](#containstext), [`value`](#value), [`values`](#values), [`count`](#count), [`attribute`](#attribute), [`css`](#css), [`id`](#id), [`property`](#property), [`accessibleName`](#accessiblename), [`accessibleDescription`](#accessibledescription) |
| Page and storage | [`url`](#url), [`title`](#title), [`localStorage`](#localstorage), [`sessionStorage`](#sessionstorage) |

The following snippets use an example checkout and orders app. Match the labels, field values and expected state to the application you are testing. Place each snippet inside the relevant scenario block.

### On-screen presence · `visible` {#visible}

Check that the Order summary is rendered and visible to the browser.

```flow
flow.assert.that {
  "target": "Order summary",
  "condition": "visible"
};
```

### Hidden or removed · `hidden` {#hidden}

Wait for the Loading orders indicator to disappear. This passes if the indicator is hidden or has been removed from the document.

```flow
flow.assert.that {
  "target": "Loading orders",
  "condition": "hidden"
};
```

### Present in the document · `attached` {#attached}

Check that the Order summary exists in the DOM. One or more matches satisfy this condition, including elements that are hidden.

```flow
flow.assert.that {
  "target": "Order summary",
  "condition": "attached"
};
```

### Enabled control · `enabled` {#enabled}

Check that the Submit button in the Checkout form can be used. `inside` selects the named form and `under` distinguishes the button by its position below Password.

```flow
flow.assert.that {
  "target": {
    "text": "Submit",
    "element": "button",
    "inside": "Checkout",
    "under": "Password"
  },
  "condition": "enabled",
  "message": "Checkout should allow submission"
};
```

### Disabled control · `disabled` {#disabled}

Check that the Place order button is disabled while payment details are incomplete.

```flow
flow.assert.that {
  "target": {
    "text": "Place order",
    "element": "button"
  },
  "condition": "disabled"
};
```

### Editable field · `editable` {#editable}

Check that the Email input accepts editing. A read-only field can be visible and enabled while still failing this check.

```flow
flow.assert.that {
  "target": {
    "text": "Email",
    "element": "input"
  },
  "condition": "editable"
};
```

### Selected checkbox or radio · `checked` {#checked}

Check that Express delivery is selected. Use `"not": true` to check that a checkbox or radio is cleared.

```flow
flow.assert.that {
  "target": "Express delivery",
  "condition": "checked"
};
```

### Empty input or content · `empty` {#empty}

Check that the Order notes field is blank. On inputs and textareas this reads the field value. On other elements it reads the text content, where whitespace counts as content.

```flow
flow.assert.that {
  "target": {
    "text": "Order notes",
    "element": "input"
  },
  "condition": "empty"
};
```

### Current keyboard focus · `focused` {#focused}

Check that focus moved to Email after a validation error or a keyboard action.

```flow
flow.assert.that {
  "target": {
    "text": "Email",
    "element": "input"
  },
  "condition": "focused"
};
```

### Intersects the viewport · `inViewport` {#inviewport}

Check that at least part of the Order summary intersects the current viewport. This compares the element’s bounds with the viewport. Use `visible` separately when you also need a visibility check.

```flow
flow.assert.that {
  "target": "Order summary",
  "condition": "inViewport"
};
```

### Exact text · `text` {#text}

Check that the element named Order status contains exactly Approved after whitespace is normalized. This example assumes the element has the accessible label Order status.

```flow
flow.assert.that {
  "target": "Order status",
  "condition": "text",
  "value": "Approved"
};
```

### Part of the text · `containsText` {#containstext}

Check that the labelled status contains part of its expected text. The string comparison is case-sensitive. For a pattern, use `matches` and optionally `flags`.

```flow
flow.assert.that {
  "target": "Order status",
  "condition": "containsText",
  "value": "prove"
};
```

### Current input or select value · `value` {#value}

Check the Email field’s current value after typing. A select returns the selected option’s value, which can differ from its displayed label.

```flow
flow.assert.that {
  "target": {
    "text": "Email",
    "element": "input"
  },
  "condition": "value",
  "value": "reader@example.test"
};
```

### Selected values in a multi-select · `values` {#values}

Check both selected values in a multi-select labelled Delivery options. The listbox role identifies the select itself. List the values in the order the options appear in the DOM.

```flow
flow.assert.that {
  "role": "listbox",
  "name": "Delivery options",
  "condition": "values",
  "value": [
    "standard",
    "express"
  ]
};
```

### Exact number of matches · `count` {#count}

Check that two buttons are labelled Invoice. A count of zero is also valid when checking that a match is absent.

```flow
flow.assert.that {
  "target": {
    "text": "Invoice",
    "element": "button"
  },
  "condition": "count",
  "value": 2
};
```

### HTML attribute · `attribute` {#attribute}

Check the literal `aria-expanded` value on the Details button. Omit `value` and `matches` to check whether the attribute exists. Attribute values are strings.

```flow
flow.assert.that {
  "target": {
    "text": "Details",
    "element": "button"
  },
  "condition": "attribute",
  "attribute": "aria-expanded",
  "value": "false"
};
```

### Computed CSS property · `css` {#css}

Check that the Order summary uses a grid layout. Use the CSS property name, such as `display` or `background-color`, and the browser’s computed value.

```flow
flow.assert.that {
  "target": "Order summary",
  "condition": "css",
  "property": "display",
  "value": "grid"
};
```

### Element ID · `id` {#id}

Find the Submit button by its readable label and check its actual `id` attribute.

```flow
flow.assert.that {
  "target": {
    "text": "Submit",
    "element": "button",
    "inside": "Checkout"
  },
  "condition": "id",
  "value": "checkout-submit"
};
```

### Browser property or nested state · `property` {#property}

Think of a browser property as something the browser knows about a control right now. For example, after you type into a field, its `value` property reflects what you typed. The browser can also tell you whether that value fits the field’s rules.

Type `samuel.me` into an HTML email input before this check. The browser sets `validity.typeMismatch` to the boolean `true`. Other native validity flags, such as `valueMissing` and `patternMismatch`, are read the same way on controls that define them. Use a safe data path such as `validity.typeMismatch`, with dot notation or numeric indices. Property reads support JSON-compatible values and exclude functions, browser globals and custom getters.

```flow
flow.assert.that {
  "target": {
    "text": "Email",
    "element": "input",
    "inside": "Checkout"
  },
  "condition": "property",
  "property": "validity.typeMismatch",
  "value": true,
  "message": "Email should be flagged as malformed"
};
```

### Computed accessible name · `accessibleName` {#accessiblename}

Check the name announced for a button whose visible label is Details and whose accessible name is Order details. Find it by the displayed text so the assertion can independently verify its accessible name.

```flow
flow.assert.that {
  "target": {
    "text": "Details",
    "element": "button"
  },
  "condition": "accessibleName",
  "value": "Order details"
};
```

### Computed accessible description · `accessibleDescription` {#accessibledescription}

Check the help text associated with the Order details button, for example via `aria-describedby`. This example locates it by accessible role and name.

```flow
flow.assert.that {
  "role": "button",
  "name": "Order details",
  "condition": "accessibleDescription",
  "value": "View order charges and delivery information."
};
```

### Active document URL · `url` {#url}

Check that the active page reached `/orders`. `matches` takes a regex pattern as a JSON string. The same check can use `value` for a full exact URL.

```flow
flow.assert.that {
  "condition": "url",
  "matches": "/orders$"
};
```

### Active document title · `title` {#title}

Check the title of the active document. No element target is needed.

```flow
flow.assert.that {
  "condition": "title",
  "value": "Orders | Example Shop"
};
```

### Origin’s persistent browser storage · `localStorage` {#localstorage}

Check a preference saved by the application as `theme=dark` in local storage. This reads the string `dark`.

```flow
flow.assert.that {
  "condition": "localStorage",
  "key": "theme",
  "value": "dark"
};
```

### Tab’s session storage · `sessionStorage` {#sessionstorage}

Check that checkout saved its current stage under `checkoutStep` in session storage. Use `"value": null` to check for a missing key in either storage area. Use harmless keys in examples and avoid reporting secret storage values.

```flow
flow.assert.that {
  "condition": "sessionStorage",
  "key": "checkoutStep",
  "value": "delivery"
};
```

## flow.assert.value {#flow-assert-value}

Compares values you already have. It checks them once and keeps their JSON types. Use a whole variable reference such as `"@quantity"` or `"@order.items[0].quantity"` to preserve the stored type. Interpolating a value into a larger string produces text. `message` can describe the purpose of any operator.

For the examples, assume a JSON response with `quantity` equal to 2, `status` equal to `"approved"` and `cities` containing Lagos and Abuja. Save the fields using [extraction](/flow-language/flow-commands/flow.extract). For `emailMismatch`, extract the browser property `validity.typeMismatch`.

| Comparison | Operators |
| --- | --- |
| Exact or partial match | [`equals`](#equals), [`notEquals`](#notequals), [`contains`](#contains) |
| Numeric bound | [`greaterThan`](#greaterthan), [`greaterThanOrEqual`](#greaterthanorequal), [`lessThan`](#lessthan), [`lessThanOrEqual`](#lessthanorequal) |
| JSON type | [`type`](#type) |

### `equals` {#equals}

Compare complete JSON values. For example, a quantity of `2` is a number, while `"2"` is text. This check compares the type as well as the value. Arrays must also have the same order.

```flow
flow.assert.value {
  "actual": "@quantity",
  "operator": "equals",
  "expected": 2
};
```

### `notEquals` {#notequals}

Check that the extracted status differs from `cancelled`.

```flow
flow.assert.value {
  "actual": "@status",
  "operator": "notEquals",
  "expected": "cancelled"
};
```

### `contains` {#contains}

Check for a substring in a string, one matching item in an array, or a subset of an object’s own keys and values. This example checks that the array contains the city Abuja.

```flow
flow.assert.value {
  "actual": "@cities",
  "operator": "contains",
  "expected": "Abuja"
};
```

### `greaterThan` {#greaterthan}

Check that an extracted quantity exceeds the minimum of one.

```flow
flow.assert.value {
  "actual": "@quantity",
  "operator": "greaterThan",
  "expected": 1
};
```

### `greaterThanOrEqual` {#greaterthanorequal}

Allow a quantity of one or more.

```flow
flow.assert.value {
  "actual": "@quantity",
  "operator": "greaterThanOrEqual",
  "expected": 1
};
```

### `lessThan` {#lessthan}

Check that the quantity is below ten.

```flow
flow.assert.value {
  "actual": "@quantity",
  "operator": "lessThan",
  "expected": 10
};
```

### `lessThanOrEqual` {#lessthanorequal}

Allow a quantity of ten or fewer.

```flow
flow.assert.value {
  "actual": "@quantity",
  "operator": "lessThanOrEqual",
  "expected": 10
};
```

### `type` {#type}

Check that a stored value has the expected JSON type. Accepted types are `string`, `number`, `boolean`, `array`, `object` and `null`.

```flow
flow.assert.value {
  "actual": "@emailMismatch",
  "operator": "type",
  "expected": "boolean"
};
```

## Events and files

Arm a named observer before the action that produces the event. For browser network traffic, wait for the capture before comparing its contents. For downloads, save the captured file before checking it. Use the same browser profile throughout the sequence.

### flow.dialog.expect {#flow-dialog-expect}

Checks that an armed browser dialog opened and was handled. Add `type` (`alert`, `confirm`, `prompt` or `beforeunload`), exact `message`, a message substring with `contains`, or the prompt’s initial `defaultValue`. In this example the Rename order button prompts with “Enter order name” and an initial value of “Order FS-102.” The armed action supplies the replacement.

```flow
flow.dialog.arm {
  "name": "rename-order",
  "action": "accept",
  "promptText": "Office supplies",
  "timeout": 5000
};
flow.click button "Rename order";
flow.dialog.expect {
  "name": "rename-order",
  "type": "prompt",
  "message": "Enter order name",
  "defaultValue": "Order FS-102"
};
```

### flow.network.expect {#flow-network-expect}

Checks a previously captured browser request or response. Here Load order makes a GET request and returns a JSON body with `order.status` set to `"approved"`. The status, method and body comparison are reported separately.

```flow
flow.network.arm {
  "name": "order-response",
  "url": "**/api/orders/FS-102",
  "method": "GET"
};
flow.click button "Load order";
flow.network.wait { "name": "order-response" };
flow.network.expect {
  "name": "order-response",
  "status": 200,
  "method": "GET",
  "path": "order.status",
  "equals": "approved"
};
```

Use `header` with `equals` or `contains` to compare a captured header. Omit `header` and `path` to compare the whole body. For an armed request, omit the response status check. [Routing, captures and extraction](/reference/structured-api#browser-network).

### flow.download.expect {#flow-download-expect}

Verifies a saved browser download. Here Export order downloads `order.json` with the body shown below. The example uses a fresh local filename and checks the filename suggested by the browser.

```flow
flow.download.arm { "name": "order-export" };
flow.click button "Export order";
flow.download.save {
  "name": "order-export",
  "file": "downloads/order-$uuid.json"
};
flow.download.expect {
  "name": "order-export",
  "filename": "order.json",
  "minSize": 1,
  "json": {
    "id": "FS-102",
    "status": "approved"
  }
};
```

Supply at least one of `filename`, exact byte `size`, `minSize`, text `contains`, exact `json`, or a lowercase 64-character `sha256` digest. All supplied checks must pass. [Download limits and paths](/reference/native-browser-commands#downloads).

### flow.stub.expect {#flow-stub-expect}

Checks calls observed by a spy or stub. In this example clicking Place order invokes a replaceable application function, `window.shopAnalytics.track("order-placed", "FS-102")`. The spy runs the real function and records the call.

```flow
flow.stub.install {
  "name": "order-events",
  "target": "shopAnalytics.track",
  "mode": "spy"
};
flow.click button "Place order";
flow.stub.expect {
  "name": "order-events",
  "count": 1,
  "args": ["order-placed", "FS-102"],
  "timeout": 3000
};
flow.stub.restore { "name": "order-events" };
```

Use `count` for the exact number of calls or `minCount` for a minimum. The `args` array must match one recorded call. Supply at least one expectation. A count can pass as soon as the observed count reaches it. If the application can call the function again later, wait for the workflow to finish before checking an exact count. [Spy and stub modes](/reference/native-browser-commands#function-spies-and-stubs).

### flow.console.expect {#flow-console-expect}

Waits for a browser message that matches an observer’s level and text. Here Save emits `console.info("Customer saved")`. Arm before clicking. The assertion consumes that observer and uses its own `timeout`.

```flow
flow.console.arm {
  "name": "save-message",
  "level": "info",
  "contains": "Customer saved"
};
flow.click button "Save";
flow.console.expect {
  "name": "save-message",
  "timeout": 5000
};
```

### flow.channel.expect {#flow-channel-expect}

Waits for a text message from an armed WebSocket or EventSource connection. This example checks the `event` property of a JSON WebSocket message. Use `contains` for a text fragment, `equals` alone for the whole message value, or neither to accept any captured text message.

```flow
flow.channel.arm {
  "name": "order-updates",
  "protocol": "websocket",
  "url": "**/orders/socket"
};
flow.click button "Open order feed";
flow.channel.expect {
  "name": "order-updates",
  "path": "event",
  "equals": "order.updated",
  "timeout": 5000
};
```

Arm before the connection opens. For SSE, `event` on the **arm** command selects the event name, while `path` on **expect** reads a field inside the data. [WebSocket and SSE examples](/reference/application-evidence#live-channels).

## API contracts and polling

### flow.api.expectSchema {#flow-api-expect-schema}

An API can return a success status and still send data your app cannot use. A schema is a set of rules for that data, such as “every order must have an ID and a quantity.” Use this check to catch a response that breaks those rules.

`flow.api.expectSchema` checks the active API context’s latest structured JSON response against a project-local JSON Schema. Save the example below as `fixtures/order.schema.json`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "quantity"],
  "properties": {
    "id": {
      "type": "string"
    },
    "quantity": {
      "type": "integer",
      "minimum": 1
    }
  }
}
```

If the endpoint returns an order with `id` equal to `"FS-102"` and a numeric `quantity` of 2, the schema passes. A string such as `"2"` fails the type rule at `/quantity`. Check the status separately.

```flow
flow.api.request { "url": "/api/orders/FS-102" };
flow.expect status "200";
flow.api.expectSchema {
  "file": "fixtures/order.schema.json",
  "timeout": 3000
};
```

Flowstride reports the first schema violation with its path and rule. Draft 7 and 2020-12 are supported. Schema references resolve within the same file. [Structured API requests](/reference/structured-api#requests).

### flow.api.poll {#flow-api-poll}

Repeatedly sends a GET until a successful JSON response has the requested value at `path`. The example assumes an earlier create request returned the job ID saved as `@jobId`. When the server moves the job to `"completed"`, the last response is available for further checks or extraction.

```flow
flow.api.poll {
  "url": "/api/jobs/@jobId",
  "path": "status",
  "equals": "completed",
  "interval": 500,
  "timeout": 15000
};
flow.expect status "200";
```

This command makes requests and reports the failing path and attempt count on timeout. Use it in `Given`, `When` or `Then`. [Polling controls and response behavior](/reference/structured-api#polling).

## Accessibility and visuals

Accessibility means making your app usable by people who interact with it in different ways, such as with a keyboard or a screen reader. In the commands below, `a11y` is short for accessibility. The two digits `11` count the letters between `a` and `y`.

The browser builds an **accessibility tree**, a description of what each part of the page is, what it is called, and its state. For example, it can describe a checkbox called **Express delivery** as checked. Tools such as screen readers use that information. An ARIA snapshot records the browser’s description in a text format you can review.

### flow.a11y.scan {#flow-a11y-scan}

Use a scan to catch common accessibility problems, such as a form field with no accessible label. The automated axe rules report violations, and the check passes when the number of entries is at or below `maxViolations` (default 0). This example scans checkout content inside `main`. Its report remains available on failure.

```flow
flow.a11y.scan {
  "name": "checkout",
  "include": ["main"],
  "maxViolations": 0
};
```

Optional fields include `exclude`, `tags`, `rules`, `disableRules` and `impacts` (`minor`, `moderate`, `serious`, `critical`). The threshold applies after impact filtering. An automated pass covers the rules that ran. Keyboard and assistive-technology journeys still need their own tests. [Accessibility settings](/reference/native-browser-commands#accessibility-and-aria).

### flow.a11y.match {#flow-a11y-match}

A screen reader can announce a labelled **Place order** button as “Place order, button.” Imagine replacing its text with an icon. The icon may still make sense on screen, but if the button loses its accessible name, a screen reader might announce only “button.” `flow.a11y.match` can catch that change by comparing how the browser describes the button with the description you expect.

The command retries an exact ARIA tree comparison against inline YAML. The example below checks that the only `h1` has the accessible name “Order history” and level 1. Use `flow.a11y.snapshot` first to see the complete tree for the region you want to check.

```flow
flow.a11y.match {
  "selector": "h1",
  "yaml": "- heading \"Order history\" [level=1]",
  "timeout": 5000
};
```

### flow.a11y.snapshot with a baseline {#flow-a11y-snapshot}

Take a snapshot to see how the browser describes a page today. A baseline is a copy you have reviewed and saved as the expected result for later runs.

The command captures the ARIA tree once and optionally compares it with a local YAML baseline. For the same heading, put `- heading "Order history" [level=1]` in `baselines/order-heading.aria.yml`. Omit `baseline` if you only need to inspect the captured evidence.

```flow
flow.a11y.snapshot {
  "name": "order-heading",
  "selector": "h1",
  "baseline": "baselines/order-heading.aria.yml"
};
```

Run the flow locally with `--update-baselines` when you intend to write or refresh the reference. Review the YAML before accepting a changed baseline. Use this command in `Given`, `When` or `Then`. [ARIA baseline workflow](/guide/native-browser-workflows#accessibility-and-aria-baselines).

### flow.visual.match {#flow-visual-match}

Compares a screenshot with a reviewed PNG. The example finds Order summary within Checkout. It requires the same image dimensions and allows up to 1% of pixels to differ. A failure saves the actual image and a diff.

```flow
flow.visual.match {
  "target": {
    "text": "Order summary",
    "inside": "Checkout"
  },
  "baseline": "baselines/order-summary.png",
  "maxDiffRatio": 0.01
};
```

Use a readable target for one region, omit the target for the viewport, or set `fullPage: true` for the complete page. Use `flow.visual.capture` to produce a candidate you can review and approve. [Capture, masking and tolerance](/reference/application-evidence#visual-comparison).

## Game assertions

Declare `let game = "flowstride:game"` at the top of your Feature or Scenario to use the built-in game commands. For state checks, expose the relevant values through the [game state bridge](/games/getting-started#register-observable-state).

### game.expectState {#game-expect-state}

Waits for the game to expose the expected value. This example checks that a successful move increased the player’s score to the number 1. Supply a dotted `path` to check one field or omit it to compare the whole exposed state.

```flow
game.expectState {
  "path": "player.score",
  "equals": 1
};
```

### game.expectPreserved {#game-expect-preserved}

Compares the current game state with a named state snapshot. This example records the current campaign, reloads a game that persists it, and checks that the campaign is still present with the same values.

```flow
game.snapshotState {
  "name": "saved-campaign",
  "path": "campaign"
};
flow.reload;
game.expectPreserved { "name": "saved-campaign" };
```

### game.expectVisual {#game-expect-visual}

Checks the fraction of changed pixels on a canvas against a named snapshot or a project-local PNG baseline. This example captures a board, performs one move in the center and expects at least 0.1% of pixels to change. The canvas needs the same dimensions for both captures.

```flow
game.snapshot {
  "name": "before-move",
  "canvas": "#board"
};
game.tap {
  "canvas": "#board",
  "x": 0.5,
  "y": 0.5
};
game.expectVisual {
  "name": "before-move",
  "canvas": "#board",
  "minChange": 0.001
};
```

Use `maxChange` to bound the difference or `baseline` to compare with a saved PNG. [Game canvas examples](/games/actions#screens-and-pixel-comparisons).

## Continue after a failed assertion

If the Email field is read-only and the Password field is missing, soft assertions can report both problems in one run. Flowstride records each failure, continues to the next step, and still marks the scenario as failed.

Use `flow.soft` with `expect`, `assert.that`, `assert.value`, `dialog.expect`, `network.expect`, `download.expect`, `stub.expect`, `a11y.scan`, `a11y.match`, `api.expectSchema`, `console.expect`, `channel.expect` or `visual.match`. These are also the built-in assertion commands accepted in an `And` block.

```flow
flow.soft assert.that {
  "target": {
    "text": "Email",
    "element": "input"
  },
  "condition": "editable",
  "message": "A customer should be able to correct their email"
};
flow.soft expect visible "Password";
```

Use [`flow.try`](/flow-language/flow-commands/flow.try) when an optional action may be skipped. For reporting and examples of both outcomes, see [run control](/reference/data-and-run-control#execution-controls).
