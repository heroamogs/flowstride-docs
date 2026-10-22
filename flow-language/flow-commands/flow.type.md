# flow.type

Enter text into an input resolved by its label, placeholder or selector.

## Example

```flow
flow.type input "Email" "{{env.TEST_EMAIL}}";
```

## Behavior and limits

Use environment secrets for passwords and generated values for disposable data. Confirm the resulting value when it matters.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
