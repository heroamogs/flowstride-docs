# flow.switchTo

Switch the active browser page by direction or a title/URL fragment.

## Example

```flow
flow.switchTo "next";
flow.switchTo "previous";
```

## Behavior and limits

This changes a page in the current browser context. It is not a native multi-user browser-context API.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
