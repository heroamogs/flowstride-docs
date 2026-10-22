# flow.rejectDialog

Register dismissal for a subsequent native browser dialog.

## Example

```flow
flow.rejectDialog;
flow.click button "Delete";
```

## Behavior and limits

Set the handler before triggering the dialog. A prompt-text input API is not provided by this command.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
