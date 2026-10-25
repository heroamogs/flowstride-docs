# flow.upload

Upload a project-local file through an input or file-chooser control.

## Example

```flow
flow.upload "fixtures/avatar.png" into "Upload avatar";
```

## Behavior and limits

The file and resolved symlink target must remain inside the project. Flowstride waits for the file chooser and observes its completion even if the initiating click is slow.

To receive and check a file from the application, use native [download arm/save/expect](/reference/native-browser-commands#downloads) instead.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.

After selecting the file, assert the application's accepted filename, preview or successful upload response. The chooser completing does not prove server-side validation accepted the file. Use project fixtures and an explicit result check; [failure diagnostics](/guide/assertions-and-diagnostics) retains chooser/path and underlying error details.
