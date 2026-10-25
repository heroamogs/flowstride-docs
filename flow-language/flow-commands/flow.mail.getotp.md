# flow.mail.getOtp

**Cloud account required, including free accounts within workspace quotas.** Poll the supported test inbox through FlowMail and store the received code in a flow variable.

```flow
flow.mail.getOtp "@randomEmail@flowstridemail.com" into "otpCode";
flow.passcode input "Verification code" "@otpCode";
```

The example reuses an email generated during user setup; generate it first or use your supported test address. [API and UI in one flow](/guide/api-and-ui) shows the complete signup/login/OTP journey.

The address must belong to the supported test-mail workflow and the application must actually send a message. This is not arbitrary access to a Gmail/Outlook inbox. Quotas, authentication and service availability apply.

`into global "otpCode"` stores a process-global value. Use local scope unless sharing is intentional. OS does not include FlowMail retrieval. `$randomOtp` only generates a random test number and is not a replacement for retrieving a delivered OTP.

Do not expose the extracted code in shared logs or screenshots. See [Cloud authentication](/cloud/authentication).

[Email OTP from signup to login](/guide/email-otp) covers a complete API/UI journey, segmented `flow.passcode` inputs, polling, token/workspace diagnosis and the final authentication assertion. A received code is an intermediate result; verify the application accepts it.
