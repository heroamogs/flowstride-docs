# flow.acceptDialog

Register handling to accept a subsequent browser dialog. Available in OS and Cloud. Register **before** the action that triggers the dialog:

```flow
flow.acceptDialog;
flow.click button "Confirm choice";
flow.expect visible "Choice processed";
```

Adapt the trigger and expected outcome. An alert, confirm and prompt can lead to different application behavior. These commands register handling; they do not type an arbitrary prompt answer or interact with a custom HTML modal. Use ordinary modal controls or a focused plugin for another contract.

The configured default dialog behavior and CI dismissal also affect runs. Use explicit registration when that dialog's choice matters, then verify the application result. [Forms](/guide/forms-and-dates#dialogs-uploads-and-hover-menus) and [OTP](/guide/email-otp) show the ordering.
