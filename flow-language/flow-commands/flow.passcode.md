# flow.passcode

Enter an already obtained passcode into a single field or a supported segmented OTP control. Available in OS and Cloud.

```flow
flow.passcode input "Verification code" "@myOtp";
```

For a container holding individual digit boxes:

```flow
flow.passcode "OTP verification" "@myOtp";
flow.click button "Verify";
flow.expect visible "My account";
```

Replace the field/container label with the application's actual target. The helper supports a single input, split inputs within a matching container and its supported OTP-input fallback. It does not retrieve a code or establish its validity; the application validates the submitted code.

Use [FlowMail](/guide/email-otp) for delivered OTP retrieval with an eligible Cloud account, or your application's authorized test-code source. `$randomOtp` is generated test data, not the code a service issued.
