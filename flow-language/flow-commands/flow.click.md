# flow.click

Click a target using a readable label, optional element qualifier, stable selector or spatial anchor.

## Example

```flow
flow.click button "Save" near "Profile";
```

## Behavior and limits

Use a distinct label or scope when the page contains several matches. A normal click uses browser action waiting; it does not repeatedly click while a later assertion polls. Prefer a normal click before considering forceClick. [Waiting behavior](/guide/waiting-and-retries).

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
