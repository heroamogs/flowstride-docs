# flow.type

Enter text into an input resolved by its label, placeholder or selector.

## Example

```flow
flow.type input "Email" "{{env.TEST_EMAIL}}";
```

## Behavior and limits

Use environment secrets for passwords and generated values for disposable data. Confirm the resulting value when it matters.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.

## Verify format-sensitive values

The adapter can retry typing and tolerate application formatting such as punctuation removal. Pair typing with an exact value check when masks or punctuation matter:

```flow
flow.type "input[name='reference']" "12-34";
flow.assert.that {
  "selector": "input[name='reference']",
  "condition": "value",
  "value": "12-34"
};
```

If the application stores `1234`, the exact assertion fails even if the typing action completed. [Targeting](/guide/targeting) explains explicit placeholders and readable versus raw selector paths.
