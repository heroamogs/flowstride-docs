# flow.injectAudio

Select a local audio fixture for the browser fake microphone configuration.

## Example

```flow
flow.injectAudio "fixtures/voice.wav";
```

## Behavior and limits

Use a project-local WAV fixture. The worker pre-scans the flow and configures the browser before launch; this is not arbitrary hot-swapping of microphone audio. Validate your media/transcription app separately.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
