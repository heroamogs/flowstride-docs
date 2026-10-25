# flow.injectAudio

Supply a local audio fixture as Chromium's microphone input. This command is available in OS and Cloud; your application performs any speech-to-text processing. Follow the [audio-to-text guide](/guide/audio-to-text) for a complete recording and transcript example.

## Example

```flow
flow.injectAudio "fixtures/greeting.wav";
```

## Behavior and limits

Use Chromium with a project-local, uncompressed PCM WAV fixture. Firefox/WebKit audio-file injection is not supported by this command. Paths are relative to the project root, including when the flow lives in `flows/`.

The worker pre-scans the batch for the first literal audio path and configures the browser before launch. Flow variables and environment placeholders in this filename are not expanded by that scan. The command does not start the application's recorder or hot-swap files in a running browser. Run different fixtures in separate invocations.

```sh
npx flowstride install chromium
npx flowstride run flows/audio-to-text.flow --browser chromium
```

Use your application's start/stop controls and microphone permission, then assert its result with [transcript or scoped text checks](/guide/audio-to-text#how-transcript-comparison-works). When using `flow.waitForPipeline`, the WAV fixture must also suit that helper's duration calculation.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
