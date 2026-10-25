# flow.close

Dismiss a visible modal identified by its text. Available in OS and Cloud.

```flow
flow.close "Voice Recordings";
flow.assert.that {
  "selector": "[role='dialog']",
  "condition": "hidden"
};
```

The helper locates a visible modal region and uses a close candidate or supported top-right geometry. Give it text unique to the intended modal, and adapt the hidden assertion to your markup. Nested dialogs, unusual close controls and repeated modal text can require a more explicit action.

Command completion is not proof that every overlay disappeared; assert the outcome. This is not a tab-close command. [Audio-to-text](/guide/audio-to-text#a-login-recording-and-transcript-review-journey) shows its use in a complete recording review.
