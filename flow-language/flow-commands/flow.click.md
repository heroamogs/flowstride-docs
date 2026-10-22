# flow.click

Click a target using a readable label, optional element qualifier, stable selector or spatial anchor.

## Example

```flow
flow.click button "Save" near "Profile";
```

## Behavior and limits

Use a distinct label or scope when the page contains several matches. Prefer a normal click before considering forceClick.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
