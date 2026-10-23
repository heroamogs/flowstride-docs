# flow.switchTo

Switch the active browser page by direction or a title/URL fragment.

## Example

```flow
flow.switchTo "next";
flow.switchTo "previous";
```

## Behavior and limits

This changes a page in the current browser context. Use [named browser profiles](/guide/native-browser-workflows#separate-users-in-one-test) to keep independent users logged in at the same time.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
