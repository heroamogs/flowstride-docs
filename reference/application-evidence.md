# Console, live messages and visual evidence

Use these commands in both engines to check behavior beyond visible text. Keep a visible outcome assertion when the user-facing result is also part of the test.

## Console messages

`flow.console.arm` listens on the active tab for a message containing `contains`. Filter by `level` when the app emits messages at several levels. Supported values are `log`, `debug`, `info`, `warn` (or `warning`), `error`, `assert` and `pageerror`. `flow.console.expect` waits for a matching message and consumes the observer. Give the expectation a `timeout` in milliseconds when needed.

In this example, Save emits “Customer saved” through `console.info` and updates the page.

```flow
flow.console.arm {
  "name": "save-message",
  "level": "info",
  "contains": "Customer saved"
};
flow.click button "Save";
flow.console.expect { "name": "save-message" };
flow.expect visible "Profile updated";
```

For a deliberate negative test, `level: "pageerror"` watches for an uncaught browser exception. A passing expectation acknowledges the matching exception. Other uncaught errors retain the run’s normal browser-error policy. Use [`flow.log`](/reference/data-and-run-control#test-log) when the message should come from the test itself.

## Live channels

`flow.channel.arm` observes a named WebSocket or server-sent event (SSE) connection in the current tab. Arm before the application starts the connection. Match the URL with an absolute URL or a pattern such as `**/orders/socket`. Set `protocol` to `websocket` or `sse`.

`flow.channel.expect` waits for a message matching `contains`, `equals`, or a `path` with `equals`. A JSON field path supports dotted keys and array indices. Use `timeout` on the expectation. Each expectation consumes its observer. Arm separate names when one connection must supply several checks.

### WebSocket

A WebSocket keeps a connection open so the browser and server can send messages in both directions. Think of a chat where you can send a message and see a reply while staying on the same page.

The received direction is the default. Here Open order feed creates the socket, sends a JSON subscription with `topic: "orders"`, and receives an update with `order.confirmed: false`.

```flow
flow.channel.arm {
  "name": "order-subscription",
  "protocol": "websocket",
  "url": "**/orders/socket",
  "direction": "sent"
};
flow.channel.arm {
  "name": "order-updates",
  "protocol": "websocket",
  "url": "**/orders/socket"
};
flow.click button "Open order feed";
flow.channel.expect {
  "name": "order-subscription",
  "path": "topic",
  "equals": "orders"
};
flow.channel.expect {
  "name": "order-updates",
  "path": "order.confirmed",
  "equals": false
};
```

### Server-sent events

Server-sent events let the server push updates to an open page. For example, a tracking page can show **Delivered** as soon as the server reports it, while the customer stays on that page.

Here the browser creates an `EventSource` at `/orders/events`. The server emits an event named `order-status` whose JSON data has `state: "delivered"`. Omitting `event` watches the default `message` event.

```flow
flow.channel.arm {
  "name": "delivery-status",
  "protocol": "sse",
  "url": "**/orders/events",
  "event": "order-status"
};
flow.click button "Track delivery";
flow.channel.expect {
  "name": "delivery-status",
  "path": "state",
  "equals": "delivered"
};
flow.expect visible "Delivered";
```

SSE observes the page’s native `EventSource` messages. A custom fetch stream needs its own observable test surface. Observers keep a bounded buffer of text messages up to 64 KiB each. A failure reports message counts and the expected check while keeping payloads out of channel diagnostics.

## Visual comparison

An order total can contain the correct text while its price is cut off on screen. A visual check can catch that layout change even when a text assertion passes.

`flow.visual.capture` writes a named PNG for review. `flow.visual.match` compares the current screenshot with an approved project-local PNG called a baseline. This example masks a rotating order reference to exclude that changing label from the comparison.

```flow
flow.visual.capture {
  "name": "order-summary",
  "target": {
    "text": "Order summary",
    "inside": "Checkout"
  },
  "mask": ["Order reference"]
};
```

Review the PNG under `.flowstride/visual/` and copy it to `baselines/order-summary.png` if it represents the intended design. Use the same target and mask when comparing.

```flow
flow.visual.match {
  "target": {
    "text": "Order summary",
    "inside": "Checkout"
  },
  "mask": ["Order reference"],
  "baseline": "baselines/order-summary.png",
  "maxDiffRatio": 0.01,
  "pixelTolerance": 5
};
```

| Option | What it controls |
| --- | --- |
| `target` or `selector` | One element. Start with readable targeting. |
| `fullPage: true` | The complete page. Omit both target fields. |
| No target or `fullPage` | The current viewport. |
| `mask` | Up to 24 readable targets or selector objects for changing regions. |
| `maxDiffRatio` | The maximum fraction of pixels allowed to differ, from 0 to 1. The default is 0. |
| `pixelTolerance` | The per-channel color difference allowed before a pixel counts as changed, from 0 to 255. The default is 0. |
| `timeout` | The capture and comparison deadline in milliseconds. |

To capture and check the whole page, use the same `fullPage` option both times.

```flow
flow.visual.capture {
  "name": "orders-full",
  "fullPage": true
};
```

```flow
flow.visual.match {
  "baseline": "baselines/orders-full.png",
  "fullPage": true,
  "maxDiffRatio": 0
};
```

Use the same browser, viewport, device scale, fonts and fixture data for capture and comparison. Image dimensions must match, and images are limited to 4 megapixels and 4,096 pixels per side. A failure saves actual and diff images under `.flowstride/visual/`. Review the differences before replacing a baseline. [Visual assertion and diagnostics](/reference/assertions#flow-visual-match).
