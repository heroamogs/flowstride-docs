# flow.set

Set a target field value directly, useful for controls such as date fields.

## Example

```flow
flow.set input "Date of birth" to "1995-05-10";
```

## Behavior and limits

Direct setting is different from a real sequence of keystrokes. Verify that application validation and the resulting state behave as intended.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
