# flow.forceClick

Force a click when ordinary actionability checks intentionally do not apply.

## Example

```flow
flow.forceClick button "Continue";
```

## Behavior and limits

This can bypass user-interaction checks. It is not a guarantee of CAPTCHA or anti-bot bypass, and should not mask a real usability defect.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
