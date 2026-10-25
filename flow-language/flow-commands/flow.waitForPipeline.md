# flow.waitForPipeline

Estimate a recording wait using the active audio fixture's duration. Available in OS and Cloud alongside Chromium [audio injection](/flow-language/flow-commands/flow.injectAudio).

## Example

```flow
flow.waitForPipeline;
flow.click button "Stop recording";
flow.expect transcript contains "Hello Flowstride. Your order is ready.";
```

## Behavior and limits

Requires an active audio fixture. The helper reads a conventional 44-byte WAV header and estimates the duration from its byte rate and file size, with a half-second allowance. Use an uncompressed PCM WAV fixture with that layout; it is not a general MP3 or extended-header media decoder.

This wait does not observe playback, stop your recorder or establish that a transcription service has finished. Check recording timing against your application, click its stop control if required, then assert the actual transcript. See the [complete audio-to-text example](/guide/audio-to-text).

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
