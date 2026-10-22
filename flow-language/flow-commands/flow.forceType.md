# flow.forceType

Fill an input with forced actionability behavior.

## Example

```flow
flow.forceType input "Email" "reader@example.test";
```

## Behavior and limits

Use normal type for ordinary user journeys. Forced entry may not reproduce every application interaction.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
