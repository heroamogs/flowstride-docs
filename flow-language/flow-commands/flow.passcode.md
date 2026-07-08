# flow.passcode

## Introduction

`flow.passcode` is a **Flow Command** designed specifically for entering passcodes, One-Time Passwords (OTP), verification codes, PINs, and other segmented authentication codes.

Unlike `flow.type`, which enters an entire value into a single input field, `flow.passcode` automatically detects whether the application uses a single input or multiple input boxes and enters the value using the appropriate strategy.

This allows the same Flow script to work across different UI implementations without modification.

---

## The Problem It Solves

Modern web applications frequently implement OTP and verification screens using multiple input fields.

For example, instead of a single input, a six-digit verification code may be rendered as:

```
┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐
│ │ │ │ │ │ │ │ │ │ │ │
└─┘ └─┘ └─┘ └─┘ └─┘ └─┘
```

A traditional typing command attempts to insert the entire value into the first input, causing the verification flow to fail.

`flow.passcode` was created specifically to solve this problem.

---

## Syntax

```flow
flow.passcode "<value>";
```

```flow
flow.passcode <element> "<locator>" "<value>";
```

---

## Parameters

| Parameter | Required | Description                                                                                                  |
| --------- | :------: | ------------------------------------------------------------------------------------------------------------ |
| Element   | Optional | Narrows the search to a specific Flow Element such as `div` or `field`.                                      |
| Locator   | Optional | Identifies the container or passcode input group.                                                            |
| Value     |    ✅    | The passcode to enter. Supports plain text, Environment Variables, Runtime Variables, and Dynamic Variables. |

---

## How flow.passcode Works

When executed, Flowstride intelligently determines how the passcode should be entered.

### 1. Locate the target

If an Element and locator are supplied, Flowstride first locates the matching container or input.

For example:

```flow
flow.passcode div "OTP Container" "123456";
```

---

### 2. Scan for passcode inputs

Flowstride automatically scans inside the located container for input fields.

If no matching inputs are found, it performs heuristic searches for common OTP patterns used by modern frameworks, including fields such as:

- `input[maxlength="1"]`
- `input[inputmode="numeric"]`
- `input[autocomplete="one-time-code"]`

This allows Flowstride to work across many different UI implementations without requiring custom selectors.

---

### 3. Detect the input layout

Once the inputs have been discovered, Flowstride counts how many are available.

#### Single input

If only one input exists, the complete value is entered as a normal form field while ensuring the appropriate browser events are dispatched so frameworks such as React and Vue correctly detect the change.

#### Multiple inputs

If multiple input fields exist, Flowstride automatically splits the passcode into individual characters.

Each character is then entered into its corresponding input field one at a time.

For every field, Flowstride:

- Focuses the input.
- Enters a single character.
- Dispatches the required browser events.
- Waits briefly before moving to the next input.

The entire process happens automatically.

---

## Examples

### Enter a static passcode

```flow
Feature: Two-Factor Authentication

Scenario: Login using a development OTP

Given "Open the verification page"
  flow.open "/verify"

When "Enter the bypass code"
  flow.passcode div "OTP Container" "123456"

Then "Verify login"
  flow.expect visible "Welcome back"
```

---

### Enter an Environment Variable

```flow
flow.passcode "{{env.OTP}}";
```

---

### Enter a Dynamic Variable

```flow
flow.passcode "$randomOtp";
```

---

### Using the Enterprise FlowMail Engine (Dynamic OTP)

This is where flow.passcode truly shines. You can intercept a real email, extract the OTP, save it to a local variable (@myCode), and pass that variable directly into flow.passcode.

```flow
Feature: Secure Registration

Scenario: Verify email address

Given "Retrieve the verification code"
  flow.mail.getotp "testuser@flowstridemail.com" into "Otp"

When "Enter the verification code"
  flow.passcode div "Verification Form" "@Otp"

Then "Verify the account"
  flow.click button "Verify Account"
```

---

## Why It Is Resilient

One of the biggest advantages of `flow.passcode` is that it adapts automatically to the application's implementation.

If developers later change the UI from six separate OTP inputs to a single input field or vice versa, the Flow script does not need to change.

Flowstride determines the input structure at runtime and automatically chooses the appropriate entry strategy.

This makes OTP automation significantly more stable and reduces maintenance as applications evolve.

---

## Supported Values

`flow.passcode` accepts any valid value, including:

```flow
- Plain text
- Environment Variables (`{{env.*}}`)
- Runtime Variables (`@...`)
- Dynamic Variables (`$...`)
- FlowMail Extracted Variables
```

---

## Common Use Cases

Use `flow.passcode` for:

- One-Time Password (OTP) verification
- Email verification
- SMS verification
- Two-factor authentication (2FA)
- Multi-factor authentication (MFA)
- PIN entry
- Password reset verification

---

## Common Mistakes

::: warning Do not use `flow.type` for segmented OTP inputs

The following may fail on applications that split the passcode into multiple input fields.

```flow
flow.type "OTP" "123456";
```

Instead, use:

```flow
flow.passcode div "OTP Container" "123456";
```

:::

::: warning Prefer Runtime Variables for intercepted codes

If the verification code is retrieved during execution, reuse the extracted value.

```flow
flow.mail.getotp "testuser@flowstridemail.com" into "Otp";

flow.passcode input "Enter OTP" "@Otp";
```

This keeps the Scenario dynamic and avoids hard-coded verification codes.

:::

---
