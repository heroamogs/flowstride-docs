# flow.passcode

Enter a passcode, including forms that use segmented OTP inputs.

## Example

```flow
flow.passcode input "Verification code" "@otpCode";
```

## Behavior and limits

The value must already exist. This command enters a code; it does not retrieve or validate an OTP service.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
