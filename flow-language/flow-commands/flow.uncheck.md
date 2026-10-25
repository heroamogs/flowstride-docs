# flow.uncheck

Uncheck a target checkbox.

## Example

```flow
flow.uncheck "Email updates";
```

## Behavior and limits

Radio groups and custom widgets can have different semantics. Use an explicit final-state assertion.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.

Use an exact `checked` assertion with `not: true` to prove the state changed. Custom controls may expose `aria-checked` or another application attribute instead. For radio groups, choose another option rather than expecting arbitrary unchecking. [Examples](/guide/forms-and-dates#checkboxes-and-custom-toggles).
