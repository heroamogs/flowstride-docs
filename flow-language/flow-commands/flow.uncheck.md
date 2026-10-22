# flow.uncheck

Uncheck a target checkbox.

## Example

```flow
flow.uncheck "Email updates";
```

## Behavior and limits

Radio groups and custom widgets can have different semantics. Use an explicit final-state assertion.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
