# flow.acceptDialog

Register acceptance for a subsequent native browser alert or confirmation.

## Example

```flow
flow.acceptDialog;
flow.click button "Delete";
```

## Behavior and limits

Register the handler before the action that opens the dialog. DOM modals use ordinary browser commands. Unhandled dialogs use configured defaultDialogBehavior.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
