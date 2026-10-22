# flow.upload

Upload a project-local file through an input or file-chooser control.

## Example

```flow
flow.upload "fixtures/avatar.png" into "Upload avatar";
```

## Behavior and limits

The file and resolved symlink target must remain inside the project. Flowstride waits for the file chooser and observes its completion even if the initiating click is slow.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
