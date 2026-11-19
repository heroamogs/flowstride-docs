# flow.rejectDialog

Register handling to dismiss a subsequent browser dialog. Available in Flowstride and Flowstride Pro. Register **before** the action that triggers the dialog:

```flow
flow.rejectDialog;
flow.click button "Confirm choice";
flow.expect visible "Choice processed";
```

Adapt the trigger and expected outcome. An alert, confirm and prompt can lead to different application behavior. These commands register handling; they do not type an arbitrary prompt answer or interact with a custom HTML modal. Use the modal’s ordinary controls for an HTML dialog. For an application-specific interaction, a [page helper](/flow-language/getting-started/helpers) can use Playwright directly.

The configured default dialog behavior and CI dismissal also affect runs. Use explicit registration when that dialog's choice matters, then verify the application result. [Forms](/guide/forms-and-dates#dialogs-uploads-and-hover-menus) and [OTP](/guide/email-otp) show the ordering.
