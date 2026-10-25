# Email OTP from signup to verified login

Flowstride can generate an email/password, prepare an account through APIs, sign in through the browser, retrieve an OTP from FlowMail and verify the resulting login in one `.flow` scenario.

Browser and API composition is available in OS and Cloud. Delivered FlowMail OTP retrieval requires a valid Cloud login, an eligible workspace and a supported test inbox address. A free Cloud account can use the features included in its workspace limits.

## The full journey

Follow [API + UI in one flow](/guide/api-and-ui) for the complete signup → authorized approval → browser login → received OTP example, including `.env` setup and reuse of generated credentials. It uses:

```flow
flow.mail.getOtp "@randomEmail@flowstridemail.com" into "myOtp";
flow.type input "Enter 6-digit OTP" "@myOtp";
flow.acceptDialog;
flow.click button "Verify OTP";
```

Register the dialog handler before the action that opens the dialog. Finish with an assertion such as `flow.expect visible "Logout";` that proves the application accepted the code.

`$randomEmail@flowstridemail.com` creates a test-address string. `@randomEmail@flowstridemail.com` reuses it. The application still has to send the actual OTP to that address through the supported service path. Generating `$randomOtp` creates a random string, not the code the application issued.

## A single field or split digit boxes

For a normal input, use `flow.type`. For a segmented OTP control, `flow.passcode` can distribute the characters across its fields:

```flow
flow.mail.getOtp "@randomEmail@flowstridemail.com" into "myOtp";
flow.passcode "Verification code" "@myOtp";
flow.click button "Verify";
flow.expect visible "My account";
```

Replace `Verification code` with the input/container your page exposes. The helper supports a single input, a matching container of split inputs and its supported OTP-input fallback. It enters an already obtained value; the application decides whether it is valid.

## Polling and failures

The Cloud worker polls the secure inbox, up to ten attempts with delays. Receiving a code ends inbox polling; it does not establish successful login. Always assert the application's final authenticated state.

| Symptom | Diagnosis |
| --- | --- |
| 401 or rejected token | Run `npx flowstride status`; replace an expired/revoked secret and authenticate again |
| 403 or permission error | Check selected workspace, token scope and FlowMail access/limits |
| No delivered code before timeout | Confirm exact generated address, that the app sent an email and that its supported inbox/service is available |
| Code received but login fails | Check expiry, single-use behavior, correct account and the application's OTP response |
| Code goes into the wrong fields | Qualify the OTP container or use a unique input selector |

Do not paste tokens or real OTPs into issues or screenshots. Local `.flowstride` credentials and CI secrets are separate sources; an old `FLOWSTRIDE_TOKEN` overrides saved project credentials.

## Practice and service requirements

The npm package includes `workflow-examples/api-ui-otp/templates` after [copying the examples](/guide/working-examples). Adapt the endpoints, credentials and labels to an authorized application. The shared local demo does not deliver real email; it supplies other browser/API fixtures.

For existing-account OTP, reuse the supplied existing-account template instead of creating unnecessary accounts. Without FlowMail, OS can still automate your application's own authorized test-code mechanism and browser verification.
