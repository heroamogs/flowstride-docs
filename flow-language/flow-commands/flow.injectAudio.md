# flow.injectAudio

## Introduction

`flow.injectAudio` is a **Flow Command** that prepares a prerecorded audio file for microphone-based testing.

It is designed for applications that rely on voice input, such as speech-to-text systems, AI assistants, voice search, WebRTC applications, and other microphone-driven experiences.

Rather than requiring a physical microphone during automation, Flowstride works with Chromium's fake media stream capabilities to provide a virtual microphone backed by a prerecorded audio file.

---

## The Problem It Solves

Testing voice-driven applications, such as AI voice assistants, customer service chatbots, voice search, or WebRTC applications, is one of the most challenging areas of UI automation.

When a web application requests microphone access, browsers normally expect input from a real hardware microphone.

Automation frameworks cannot physically speak into a microphone, making these workflows difficult to automate reliably.

`flow.injectAudio` provides a consistent way to prepare prerecorded audio for automated voice testing.

---

## How flow.injectAudio Works

Flowstride uses Chromium's built-in fake media stream capabilities to provide virtual microphone input.

However, because of how Chromium is architected, there is an important implementation detail that every Flowstride user should understand.

### Browser Launch Spoofing

During browser initialization, Flowstride launches Chromium with media stream flags that:

- Automatically grant microphone permission.
- Create a virtual microphone device.
- Configure Chromium to read audio from a prerecorded `.wav` file.

This allows voice-enabled applications to receive audio without requiring any physical recording hardware.

---

### Audio Validation

When `flow.injectAudio` executes, Flowstride safely resolves the supplied file path relative to the current working directory.

The framework then verifies that the audio file exists before continuing.

If the file cannot be found, execution immediately stops with a descriptive error, preventing silent failures later in the Scenario.

---

### Execution Telemetry

After validation succeeds, Flowstride records the active audio source for the current execution.

This provides clear execution telemetry and confirms which prerecorded audio asset is being used during the test run.

---

### Current Implementation

Chromium requires fake microphone audio to be configured **before the browser launches**.

Because of this browser limitation, the current implementation of `flow.injectAudio` primarily serves as a validation and telemetry command during Scenario execution.

The actual virtual microphone is configured during browser initialization.

---

## Syntax

```flow
flow.injectAudio "<audio-file>";
```

---

## Parameters

| Parameter  | Required | Description                                                                                                  |
| ---------- | :------: | ------------------------------------------------------------------------------------------------------------ |
| Audio File |    ✅    | Path to the prerecorded audio file. Audio assets should be stored inside the project's `fixtures` directory. |

---

## Examples

### Prepare a voice recording

```flow
Feature: Voice Search

Scenario: Search using voice input

Given "Initialize the virtual microphone"
  flow.injectAudio "fixtures/customer-question.wav";

When "Open the voice search page"
  flow.open "/voice-search";

When "Start voice recording"
  flow.click button "Start Recording";

When "Wait for the voice processing pipeline"
  flow.waitForPipeline;

Then "The spoken request is transcribed"
  flow.expect transcript contains "find nearby coffee shops";
```

---

### Prepare an audio file for voice authentication

```flow
Feature: Voice Authentication

Scenario: Authenticate using voice

Given "Load the authentication sample"
  flow.injectAudio "fixtures/voice-login.wav";

When "Open the authentication page"
  flow.open "/voice-auth";

When "Begin voice verification"
  flow.click button "Verify Voice";

When "Wait for processing"
  flow.waitForPipeline;

Then "Authentication succeeds"
  flow.expect visible "Authentication Successful";
```

---

## When to Use flow.injectAudio

Use `flow.injectAudio` whenever a Scenario requires microphone input from a prerecorded audio file.

Typical examples include:

- Voice authentication
- Speech-to-text applications
- AI voice assistants
- Voice search
- Customer support bots
- WebRTC voice workflows

---

## Important Notes

::: warning Initialize the virtual microphone early

`flow.injectAudio` should be one of the first commands executed in a Scenario.

This ensures the audio asset is validated before the application begins requesting microphone input.

:::

::: warning Store audio files in the `fixtures` directory

By convention, prerecorded audio assets should be stored inside your project's `fixtures` directory.

```flow
flow.injectAudio "fixtures/customer-question.wav";
```

This keeps test assets organized and portable across environments.

:::

::: info Current Implementation

The current implementation validates the audio file and records the active audio source during execution.

The virtual microphone itself is configured when Chromium is launched.

:::

::: warning Use compatible WAV files

Chromium's fake microphone feature is designed to work with `.wav` audio files.

For best compatibility, use standard PCM WAV files.

:::

---

## Common Mistakes

::: warning Do not initialize the microphone after recording starts

Always prepare the audio before interacting with controls that request microphone access.

Correct:

```flow
Given "Initialize the virtual microphone"
  flow.injectAudio "fixtures/customer-question.wav";

When "Start recording"
  flow.click button "Start Recording";
```

Incorrect:

```flow
When "Start recording"
  flow.click button "Start Recording";

When "Load the audio"
  flow.injectAudio "fixtures/customer-question.wav";
```

:::

::: warning Do not reference missing audio files

Flowstride validates the audio file before execution.

:::

---
