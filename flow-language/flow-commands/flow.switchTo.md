# flow.switchTo

Select a page/tab in the current browser profile. Available in OS and Cloud.

```flow
flow.click "Open receipt";
flow.switchTo "next";
flow.expect text "Receipt" inside "h1";
flow.switchTo "previous";
flow.expect visible "Order summary";
```

`next` can wait for a newly opened page. `previous` moves through page creation order, not browsing history. A title/URL fragment such as `flow.switchTo "receipt";` chooses the first matching page; keep fragments unique.

Tabs share their profile's cookies/storage rules. [Named profiles](/guide/native-browser-workflows#separate-users-in-one-test) keep independently authenticated users separate. This command does not enter an iframe. `flow.close` dismisses a modal, while `flow.browser.close` closes a named profile and its pages.

[Tabs, windows and iframes](/guide/tabs-and-iframes) includes a complete popup-and-return scenario and frame-scoped assertions.
