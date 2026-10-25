# flow.check

Check a target checkbox or radio-style control.

## Example

```flow
flow.check "Accept terms";
```

## Behavior and limits

Confirm the control is the intended one. For a custom component, verify the final state in the application.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.

Check/uncheck aim to establish the requested state rather than invert it blindly. Custom ARIA/class-driven controls need a result assertion matching their markup. A radio choice normally cannot be independently unchecked. [Forms and dates](/guide/forms-and-dates#checkboxes-and-custom-toggles) gives a complete check/uncheck example.
