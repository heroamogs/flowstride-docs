# Test audio-to-text workflows

Flowstride can feed a prerecorded audio file into the browser's microphone input, interact with your recording controls, and check the transcript your application displays. The same commands are available in **OS and Cloud**. Audio-file microphone injection requires **Chromium**.

Your application's speech-to-text system performs the transcription. Flowstride supplies repeatable input and checks the outcome, so your test can cover the recording UI and the connected transcription service together.

## 1. Prepare the application and audio

Install Flowstride through the [normal npm setup](/guide/getting-started), including `npx flowstride init`, then install its matching Chromium:

```sh
npx flowstride install chromium
```

Use an application that requests microphone access and displays the resulting transcript as page text. The example below assumes:

| Application detail | Example |
| --- | --- |
| Recording page | `/transcribe` |
| Start button | Start recording |
| Stop button | Stop recording |
| Spoken phrase | Hello Flowstride. Your order is ready. |
| Result | The recognized phrase appears as text on the page |

Replace the route, button labels and phrase with your own application's details. These controls and a transcription service are application prerequisites; installing Flowstride does not create them. If recording requires authentication, complete your normal login or restore a [saved session](/flow-language/getting-started/sessions) first.

Create a project-root `.env` file with your application's test URL:

```dotenv
BASE_URL=http://127.0.0.1:3000
```

For a local application, start its normal server in a separate terminal and leave it running. Hosted test applications can use their HTTPS URL instead. Microphone access needs a browser-trusted origin, such as localhost or HTTPS.

Place a short, uncompressed PCM WAV recording containing the example phrase at `fixtures/greeting.wav`. Use a real recording with known words; renaming an MP3 to `.wav` does not convert it. The duration helper assumes a conventional 44-byte WAV header, so use a fixture with that layout rather than a compressed or extended-header file.

## 2. Record and check the transcript

Save this as `flows/audio-to-text.flow`:

```flow
Feature: Speech-to-text recording

  Scenario: Recognize a known spoken phrase
    Given "A known audio fixture and the recording page"
      flow.injectAudio "fixtures/greeting.wav";
      flow.browser.permissions {
        "permissions": ["microphone"]
      };
      flow.open "/transcribe";

    When "Start recording the microphone input"
      flow.click button "Start recording";

    When "Finish recording the audio fixture"
      flow.waitForPipeline;
      flow.click button "Stop recording";

    Then "The application displays the recognized words"
      flow.expect transcript contains "Hello Flowstride. Your order is ready.";
```

The worker finds the literal audio path before launching Chromium and configures its fake microphone with that file. Paths are relative to the project root and must stay inside the project. Use a literal path here; the pre-launch scan does not resolve flow variables or environment placeholders in the filename.

The commands have distinct roles:

| Command | What it does |
| --- | --- |
| `flow.injectAudio` | Supplies the fixture for browser microphone input; your application's recording control still starts capture |
| `flow.browser.permissions` | Grants microphone permission to the current browser profile |
| `flow.waitForPipeline` | Estimates a wait from the fixture's WAV header; it does not wait for a server-side transcription job |
| `flow.expect transcript contains` | Polls the page's text for the expected phrase until the configured timeout |

`flow.waitForPipeline` waits approximately the clip's duration, with a half-second allowance. Check your application's recording timing if the last word is clipped. Use a deliberate test recording and verify the captured result; the duration helper does not observe actual playback or guarantee recording completion.

## 3. Run in OS or Cloud

Run just the audio example, explicitly selecting Chromium:

```sh
npx flowstride run flows/audio-to-text.flow --browser chromium
```

For headless execution and retained reports:

```sh
npx flowstride run flows/audio-to-text.flow --browser chromium --ci
```

The test passes when the application renders the expected phrase before timeout. A missing or different transcript must fail. As a negative check, temporarily replace the expected phrase with an unrelated sentence and confirm the run fails, then restore it.

OS runs this test without an account. To use Cloud, [connect your account](/cloud/authentication), accept the engine installation when offered, and run the same command. Cloud includes free accounts; these audio commands do not require a paid subscription. The application may independently require credentials or access to its transcription provider.

Firefox and WebKit cannot run `flow.injectAudio`. Keep these tests in their own Chromium run rather than including them in a browser matrix for every engine.

## How transcript comparison works

The assertion reads the page body's rendered text, converts it to lowercase, removes punctuation and collapses repeated whitespace before checking for the phrase. For this example, `HELLO FLOWSTRIDE, your order is ready!` can match despite different capitalization and punctuation.

The current normalizer keeps ASCII word characters and whitespace. Use a suitable exact or regex [native text assertion](/reference/native-browser-commands#retrying-assertions) for accented or non-Latin text; this transcript helper is not a language-aware transcription-quality metric.

The helper searches the whole page body. Keep the expected phrase out of instructions, sample text or earlier transcripts, or those could satisfy the assertion. For a specific result element, use a scoped check instead:

```flow
flow.assert.that {
  "selector": "#transcript",
  "condition": "text",
  "value": "Hello Flowstride. Your order is ready.",
  "timeout": 60000
};
```

Replace `#transcript` with the actual result selector. This check compares the element's text without the transcript helper's punctuation normalization. If the transcript is an input or textarea value, use `"condition": "value"` with its selector instead.

## Timing and troubleshooting

| Symptom | What to check |
| --- | --- |
| Audio fixture not found before launch | Run from the project root and check the literal `fixtures/greeting.wav` path |
| Audio injection requires Chromium | Add `--browser chromium` and install the matching engine |
| Microphone unavailable | Check the origin, microphone permission and the application's recording state |
| Recording misses words | Check fixture format, leading/trailing silence, and when your app actually starts or stops capturing |
| Transcript takes longer than expected | Increase the project's `timeout`, or set a longer timeout on a scoped native assertion |
| Test passes without a new transcription | Clear old results and scope the assertion to the new transcript rather than matching static page text |
| Unexpected duration | Use a conventional PCM WAV fixture; the duration helper is not a general media decoder |

An optional `flowstride.config.json` can extend the default assertion timeout:

```json
{
  "timeout": 60000
}
```

The worker selects the first audio fixture it finds in its batch before browser launch. `flow.injectAudio` does not hot-swap microphone files during an active browser session. Run different audio fixtures in separate invocations rather than switching files midway through a scenario or sharing several clips in one batch.

For CI, retain the normal [reports and evidence](/reporting/artifacts), and make sure the runner can reach your application's transcription service. Browser video is not proof that the microphone input was recognized; assert the transcript or other application result.

Related references: [injectAudio](/flow-language/flow-commands/flow.injectAudio), [waitForPipeline](/flow-language/flow-commands/flow.waitForPipeline), [expect](/flow-language/flow-commands/flow.expect), and [browser compatibility](/guide/browser-compatibility).

## A login, recording and transcript-review journey

The following application contract mirrors a real recording workflow: login, open a work item, assert active recording, wait for the fixture, stop, open recordings, check the transcript and dismiss the modal. Set `BASE_URL`, `EMAIL` and `PASSWORD` in `.env` and adapt its labels/routes.

```flow
Feature: Record and review a voice note

  Scenario: A signed-in user records known spoken words
    Given "The virtual microphone has a known audio file"
      flow.injectAudio "fixtures/voiceNote.wav";
      flow.open "/login";

    When "The test account signs in"
      flow.type input "Enter your email" "{{env.EMAIL}}";
      flow.type input "Enter your password" "{{env.PASSWORD}}";
      flow.click button "Sign In";
      flow.expect visible "My SOAPs";

    When "The target work item is opened"
      flow.click "My SOAPs" rightOf "My Appointments";
      flow.click "TEST2 [0]" under "SOAP not Started";

    When "Recording starts"
      flow.click "Start Recording";
      flow.expect visible "Recording:";

    When "The audio finishes and the recording is stopped"
      flow.waitForPipeline;
      flow.click "Recording:";
      flow.click "Recordings";

    And "The expected words appear in the transcript"
      flow.expect transcript contains "vomiting since yesterday";

    When "The recording review is dismissed"
      flow.close "Voice Recordings";

    Then "The recording modal is closed"
      flow.assert.that {
        "selector": "[role='dialog']",
        "condition": "hidden"
      };
```

The quoted work-item name is literal application text, not a generic fixture Flowstride creates. Adapt the final modal selector when your application uses different markup. Prefer a scoped transcript assertion when the page can contain old transcripts or the expected words elsewhere.

`flow.browser.permissions` is a real native command in both engines. It is useful for an explicit origin/profile permission setup, but it is not an additional mandatory line for every existing Chromium fake-microphone flow. The recording and service assertions remain the evidence of success.

[The included microphone example](/guide/working-examples) supplies a PCM tone and a simulated transcript display to exercise capture, timing and assertion behavior. Use a spoken fixture plus your authorized real service to assess speech recognition; the demo's simulated phrase is not proof of provider accuracy.
