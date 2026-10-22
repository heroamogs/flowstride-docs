# flow.waitForPipeline

Wait using the active audio fixture duration.

## Example

```flow
flow.waitForPipeline;
```

## Behavior and limits

Requires an active audio fixture. Duration waiting is not proof that a remote transcription or audio-processing service completed; assert the actual resulting UI/state.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
