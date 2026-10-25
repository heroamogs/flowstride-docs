# Tabs, windows and iframes

Flowstride supports browser tab switching and readable actions inside child frames in OS and Cloud. Tabs are separate pages within one browser profile. An iframe is a document embedded inside a page.

## Open a tab and return

This public sandbox opens a new page from its **Click Here** link:

```flow
Feature: Multi-tab context verification

  Scenario: Switch to a new window and back
    Given "The windows sandbox is open"
      flow.open "https://the-internet.herokuapp.com/windows";

    When "Open and select the new window"
      flow.click "Click Here";
      flow.switchTo "next";

    And "The new page is selected"
      flow.expect text "New Window" inside "h3";

    When "Return to the original window"
      flow.switchTo "previous";

    Then "The original page is selected"
      flow.expect text "Opening a new window" inside "h3";
```

Run it with `npx flowstride run flows/windows.flow`. The external sandbox must be reachable and retain those labels. For offline practice, use a popup in your own local app with the same sequence.

`next` can wait for a newly opened page. `previous` selects an earlier page in creation order; it is not browser Back. You can also pass a matching page title or URL fragment, for example `flow.switchTo "receipt";`. Matching is within the active profile; avoid ambiguous title fragments.

Tabs in one profile share that profile's cookies and storage rules. Use [named profiles](/guide/native-browser-workflows#separate-users-in-one-test) when customer and administrator need isolated logins. `flow.close` dismisses a modal; it does not close a browser tab. `flow.browser.close` closes a named profile and its pages.

## Interact with an embedded frame

The included local `/frames` demo has a uniquely named button inside `#profile-frame`:

```flow
Feature: Embedded profile

  Scenario: Change a result inside an iframe
    Given "The frame demonstration is open"
      flow.open "/frames";

    When "Click the child-frame control"
      flow.click "Frame action";

    Then "The frame shows the result"
      flow.assert.that {
        "frame": "#profile-frame",
        "selector": "#frame-result",
        "condition": "text",
        "value": "Clicked in frame"
      };
```

[Start the included local application](/guide/working-examples), then run `workflow-examples/iframes/flows/readable-frame.flow`. The readable action can discover a target in a child frame when it is absent from the main page. The assertion's `frame` explicitly chooses the iframe.

## An exact action in a particular frame

For repeated controls across frames or a CSS-only target, use a small plugin rather than assuming raw selectors search all child documents:

```ts
export async function click(sdk: any, args: { frame: string; selector: string }) {
  if (!args.frame || !args.selector) {
    throw new Error('A frame selector and target selector are required.');
  }
  await sdk.browser.page().frameLocator(args.frame).locator(args.selector).click();
}
```

Save it as `plugins/frame-actions.ts`, register `let frames = "frame-actions"` in the Feature, then call:

```flow
frames.click {
  "frame": "#profile-frame",
  "selector": "#frame-only"
};
```

The packaged `explicit-frame-plugin.flow` provides the complete example. [Plugin registration and SDK contracts](/flow-language/getting-started/plugins) explain how it runs through the normal Flowstride lifecycle.

Qualify your own nested, cross-origin, sandboxed or dynamically replaced frames. A frame-scoped assertion cannot repair a frame that failed to load. A target found in the parent page can take precedence over readable fallback, so use explicit scope when identity matters.
