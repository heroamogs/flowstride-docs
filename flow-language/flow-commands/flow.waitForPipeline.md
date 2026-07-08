# flow.waitForPipeline

## Introduction

`flow.waitForPipeline` is a **Flow Command** that synchronizes a Scenario with the playback duration of an injected audio file.

Rather than relying on hardcoded delays, Flowstride calculates exactly how long the injected audio will play and pauses execution accordingly.

This ensures voice-driven applications receive the complete audio stream before the Scenario continues.

---

## The Problem It Solves

When testing audio-driven pipelines, such as AI voice assistants, speech-to-text systems, customer support bots, or WebRTC applications, automation engines execute commands much faster than audio can be played.

For example, if you inject a 10-second audio file and immediately stop the recording, the application may only receive a fraction of the audio. This results in incomplete transcripts, failed assertions, or unreliable AI responses.
Using fixed delays is equally problematic.

If the audio changes from 10 seconds to 5 seconds, the test unnecessarily waits an additional 5 seconds. If the audio becomes longer, the recording may stop before playback finishes.

`flow.waitForPipeline` eliminates this problem by dynamically calculating the playback duration of the injected audio file.

---

## How flow.waitForPipeline Works

Flowstride uses **Dynamic Byte-Rate Calculation** to determine the playback duration of the currently injected audio file.

Rather than relying on hardcoded wait times, the framework reads the audio file itself and mathematically calculates how long it will take to play.

### Header Extraction

Flowstride opens the injected `.wav` file and reads the first **44 bytes**, which represent the standard RIFF/WAVE header.

---

### Mathematical Duration Resolution

Using information stored within the header, Flowstride extracts the audio byte rate and calculates the playback duration.

This allows the framework to determine exactly how long the audio stream will take to complete.

---

### Smart Thread Suspension

Once the playback duration has been calculated, Flowstride pauses execution for the calculated duration, minus a small 500 ms buffer.

This gives the application sufficient time to receive the audio stream while allowing the Scenario to continue smoothly once playback is nearly complete.

---

## Syntax

```flow
flow.waitForPipeline;
```

---

## Parameters

This command does not accept any parameters.

---

## Example

### Wait for voice playback to complete

```flow
Feature: Voice Search

Scenario: Verify speech transcription

Given "Initialize the virtual microphone"
  flow.injectAudio "fixtures/customer-question.wav";

When "Open the voice search page"
  flow.open "/voice-search";

When "Start voice recording"
  flow.click button "Start Recording";

When "Wait for the injected audio to finish playing"
  flow.waitForPipeline;

Then "The spoken request is transcribed"
  flow.expect transcript contains "find nearby coffee shops";
```

---

## When to Use flow.waitForPipeline

Use `flow.waitForPipeline` immediately after the application begins listening for microphone input.

Typical examples include:

- Speech-to-text applications
- Voice authentication
- AI voice assistants
- Voice search
- Customer support bots
- WebRTC voice workflows

---

## Important Notes

::: warning flow.injectAudio must be executed first

`flow.waitForPipeline` calculates the playback duration of the currently injected audio file.

If no audio has been injected, Flowstride cannot determine the playback duration and the Scenario will fail.

:::

::: info WAV duration is calculated automatically

Flowstride reads the WAV header and computes the playback duration mathematically.

This allows execution to remain synchronized with the injected audio without requiring manual timing adjustments.

:::

---

## Common Mistakes

::: warning Do not stop recording immediately

Avoid stopping microphone recording immediately after starting it.

```flow
When "Start recording"
  flow.click button "Start Recording";

When "Stop recording"
  flow.click button "Stop";
```

Instead, wait for the injected audio to finish playing.

```flow
When "Start recording"
  flow.click button "Start Recording";

When "Wait for playback"
  flow.waitForPipeline;

Then "Verify the transcript"
  flow.expect transcript contains "find nearby coffee shops";
```

:::

::: warning Do not use with uninjected audio

`flow.waitForPipeline` only works with audio previously prepared using `flow.injectAudio`.

:::

---
