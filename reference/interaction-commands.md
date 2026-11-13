# Browser interactions, tabs and frames

Use these commands in both engines with the browser selected for the run. The snippets assume a page with the controls named in each example. Start with readable labels, then add element types, containers or spatial cues. [Targeting syntax](/reference/structured-commands#readable-targeting).

## Keyboard and pointer

### Press a key or shortcut

`flow.press` focuses the named element and sends the key. For example, pressing Enter in Search can submit a search form. `ControlOrMeta+A` selects its contents using the platform’s modifier. Other supported keys include `Tab`, `Escape`, `Backspace`, `ArrowDown` and `Shift+Tab`.

```flow
flow.press "ControlOrMeta+A" on input "Search" inside "Customer search";
flow.press "Backspace" on input "Search" inside "Customer search";
flow.type input "Search" "Abuja";
flow.press "Enter" on input "Search" inside "Customer search";
flow.expect visible "Results for Abuja";
```

### Clear an input

`flow.clear` empties an editable field. Check for an empty value when clearing the field is the outcome you want to prove.

```flow
flow.clear input "Search" inside "Customer search";
flow.assert.that {
  "target": {
    "text": "Search",
    "element": "input",
    "inside": "Customer search"
  },
  "condition": "empty"
};
```

### Focus an element

`flow.focus` gives keyboard focus to an enabled, focusable control. Use it to exercise focus behavior or prepare a keyboard interaction.

```flow
flow.focus input "Search";
flow.assert.that {
  "target": {
    "text": "Search",
    "element": "input"
  },
  "condition": "focused"
};
```

### Blur an element

`flow.blur` removes focus. Here the application validates a typed email when the field loses focus. Configure typing to keep focus so the explicit blur is what triggers the validation.

```flow
flow.input.type {
  "target": {
    "text": "Email",
    "element": "input"
  },
  "text": "samuel.me",
  "blur": false
};
flow.blur input "Email";
flow.expect visible "Enter a valid email";
```

### Double-click

`flow.doubleClick` performs a browser double-click. This example opens the invoice using the app’s double-click handler.

```flow
flow.doubleClick button "Invoice";
flow.expect visible "Invoice details";
```

### Right-click

`flow.rightClick` sends a right-button click. If the app draws its own context menu, assert that the menu appears in the page.

```flow
flow.rightClick button "Invoice";
flow.expect visible "Download PDF";
```

## Configurable typing

`flow.input.type` accepts `target` or `selector`, the `text` to type and an optional `timeout`. It replaces text by default (`clear: true`), uses a 30 ms delay between characters and blurs when it finishes. Set `clear: false` to append or `blur: false` to leave focus in the control. Use `delay: 0` to remove the added delay.

This app’s Search field starts with “Lagos”. The command appends “ to Abuja” and leaves focus in the field.

```flow
flow.input.type {
  "target": {
    "text": "Search",
    "element": "input",
    "inside": "Customer search"
  },
  "text": " to Abuja",
  "clear": false,
  "delay": 50,
  "blur": false
};
flow.expect value input "Search" "Lagos to Abuja";
```

## Scrolling

`flow.scroll` with just a target brings it into view. Add signed `x` and/or `y` distances in pixels to scroll that container. Distances without a target scroll the active document. Positive `y` scrolls down and negative `y` scrolls up.

```flow
flow.scroll { "target": "Order history" };
flow.scroll {
  "target": "Customer records",
  "y": 240
};
flow.scroll { "y": -200 };
```

The middle command assumes Customer records names a scrollable container. Use `selector` if it has no readable identifier. A supplied `timeout` bounds target resolution and the operation.

## Browser history

After navigating from Orders to Invoice details, `flow.goBack` returns to Orders, `flow.goForward` returns to the invoice, and `flow.reload` refreshes that document. Check the page after navigation to confirm the intended history entry.

```flow
flow.click link "Open invoice";
flow.expect visible "Invoice details";
flow.goBack;
flow.expect visible "Orders";
flow.goForward;
flow.expect visible "Invoice details";
flow.reload;
flow.expect visible "Invoice details";
```

## Named tabs

Name the starting tab with `flow.tab.name`. Use `flow.tab.arm` to watch for the current tab’s next popup before clicking the trigger. `flow.tab.use` waits for an armed popup or switches to an already named tab. `flow.tab.close` closes a captured tab by name.

```flow
flow.tab.name { "name": "orders" };
flow.tab.arm {
  "name": "receipt",
  "timeout": 5000
};
flow.click button "Open receipt tab";
flow.tab.use { "name": "receipt" };
flow.expect visible "Receipt FS-102";
flow.tab.use { "name": "orders" };
flow.tab.close { "name": "receipt" };
```

Tab names belong to the current browser profile. Use a captured tab before closing it. The original [relative tab switching](/flow-language/flow-commands/flow.switchTo) remains available for `"next"` and `"previous"`.

## Frames

An iframe is a page embedded inside another page. Imagine your checkout has an embedded delivery form. Enter that frame to fill its **Postcode** field, then return to checkout to inspect the order summary.

`flow.frame.use` selects an iframe by readable title or explicit selector. Subsequent scoped browser operations look inside that frame. To select a nested frame, call it again from the parent frame. `flow.frame.main {}` returns to the top document.

```flow
flow.frame.use {
  "target": {
    "text": "Delivery details",
    "element": "iframe"
  }
};
flow.type input "Postcode" "100001";
flow.expect value input "Postcode" "100001";
flow.frame.main {};
flow.expect visible "Order summary";
```

Use `timeout` to allow a frame time to load. A browser clock change or whole-page accessibility scan requires the main document. [Iframe workflows](/guide/tabs-and-iframes).

## Dialogs

`flow.dialog.arm` tells the browser how to handle its next dialog on the current tab. Set `action` to `accept` or `dismiss`. Use `promptText` with `accept` to supply a prompt response. Arm before the click. The timeout starts when the observer is armed.

```flow
flow.dialog.arm {
  "name": "delete-confirmation",
  "action": "dismiss",
  "timeout": 5000
};
flow.click button "Delete order";
flow.dialog.expect {
  "name": "delete-confirmation",
  "type": "confirm",
  "contains": "Delete this order?"
};
flow.expect visible "Order FS-102";
```

`flow.dialog.expect` verifies the dialog that actually opened. Its [assertion reference](/reference/assertions#flow-dialog-expect) includes exact message and prompt default checks. For a dialog styled as page content, use regular element actions and assertions.
