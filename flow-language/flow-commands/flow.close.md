# flow.close

Find and activate a close control associated with a target region/modal.

## Example

```flow
flow.close "Account settings";
```

## Behavior and limits

This is a modal/region interaction, not a general command to close a BrowserContext or every browser tab.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
