# flow.mail.getotp

## Introduction

`flow.mail.getotp` is a **Flow Command** that retrieves a One-Time Password (OTP) sent to a Flowstride email address and stores it in a Flowstride variable.

Unlike traditional automation frameworks that require engineers to integrate third-party mailbox services, configure IMAP connections, or write custom email parsing logic, `flow.mail.getotp` is built directly into the Flowstride ecosystem.

When executed, the command securely communicates with **Flowstride Cloud**, which automatically retrieves the latest verification code from Flowstride's managed mail infrastructure and returns it to your running Scenario.

---

## The Problem It Solves

Automating registration, password reset, email verification, and Two-Factor Authentication (2FA) workflows is traditionally one of the most difficult parts of end-to-end testing.

Most automation frameworks require engineers to:

- Integrate external email providers
- Configure IMAP mailboxes
- Continuously poll for incoming emails
- Parse HTML email bodies
- Write regular expressions to extract verification codes
- Handle retries and timeout logic

`flow.mail.getotp` eliminates this complexity.

Instead of writing mailbox integration code or relying on external email services, Flowstride retrieves the verification code on your behalf and makes it immediately available as a Flowstride variable.

---

## How flow.mail.getotp Works

`flow.mail.getotp` combines the Flowstride parser, runtime, Flowstride Cloud, and Flowstride's managed mail infrastructure into a single seamless workflow.

### 1. Syntax Parsing

The parser recognises the command and extracts:

- The target email address
- The destination variable
- Whether the variable should be stored locally or globally

The parser supports both the `into` and `as` keywords.

---

### 2. Cloud Authentication

When execution reaches the `getOtp` action, Flowstride first authenticates the current workspace using your Flowstride Cloud machine token.

The runtime automatically retrieves your authenticated session before sending the request to Flowstride Cloud.

---

### 3. Automatic OTP Polling

Flowstride Cloud securely proxies the request to Flowstride's managed mail infrastructure.

Rather than expecting the verification email to already exist, the runtime automatically polls for the OTP.

The polling process:

- Attempts retrieval up to **10 times**
- Waits **3 seconds** between attempts
- Automatically stops once the OTP is found
- Times out after approximately **30 seconds** if no email arrives

No additional waiting logic or retry loops are required in your script.

---

### 4. Variable Assignment

Once the verification code is successfully retrieved, Flowstride stores it in the variable specified by your script.

The value can then be used immediately by subsequent Flow Commands such as `flow.passcode` or `flow.type`.

---

## Syntax

Store the OTP in a local variable.

```flow
flow.mail.getotp "john.doe@flowstridemail.com" into "loginOtp";
```

Store the OTP using the `as` keyword.

```flow
flow.mail.getotp "john.doe@flowstridemail.com" as "loginOtp";
```

Store the OTP as a global variable.

```flow
flow.mail.getotp "john.doe@flowstridemail.com" into global "loginOtp";
```

---

## Parameters

| Parameter     | Required | Description                                                             |
| ------------- | :------: | ----------------------------------------------------------------------- |
| Email Address |    ✅    | The `@flowstridemail.com` mailbox that receives the verification email. |
| `into` / `as` |    ✅    | Specifies how the extracted OTP should be assigned.                     |
| `global`      | Optional | Stores the OTP as a global variable instead of a local variable.        |
| Variable Name |    ✅    | The variable that receives the extracted OTP.                           |

---

## Examples

### Retrieve a verification code during login

Generate a unique Flowstride email address, retrieve the verification code, and continue the login process without integrating any external email provider.

```flow
Feature: User Login

Scenario: Login using email verification

Given "User lands on the login page"
  flow.open "/";

When "User enters login credentials"
  flow.type input "Email" "@randomEmail@flowstridemail.com";
  flow.type input "Password" "@randomPassword";

When "User clicks the Login button"
  flow.click button "Login";

When "Retrieve the verification code"
  flow.mail.getotp "@randomEmail@flowstridemail.com" into "myOtp";

When "Enter the verification code"
  flow.type input "Enter 6-digit OTP" "@myOtp";

When "Verify the account"
  flow.click button "Verify OTP";

Then "User is successfully logged in"
  flow.expect visible "Logout";
```

---

### Store the verification code globally

Global variables allow the OTP to be reused across multiple Scenarios or Flow files.

```flow
Feature: User Registration

Scenario: Capture the registration verification code

Given "A verification email has been sent"
  flow.click button "Send Verification Email";

When "Retrieve the verification code"
  flow.mail.getotp "@randomEmail@flowstridemail.com" into global "registrationOtp";

Then "The verification screen is displayed"
  flow.expect visible "Enter your verification code";
```

---

## When to Use flow.mail.getotp

Use `flow.mail.getotp` whenever your application sends verification codes by email, including:

- User registration
- Email verification
- Password reset
- Two-Factor Authentication (2FA)
- Secure login workflows

---

## Important Notes

::: info Flowstride Cloud

`flow.mail.getotp` is a **Flowstride Cloud** feature.

Before using this command, authenticate your workspace by signing in to Flowstride Cloud.

The runtime securely communicates with Flowstride Cloud to retrieve the verification code on your behalf.

:::

::: info Automatic polling

Flowstride automatically waits for the verification email to arrive.

The runtime polls Flowstride Cloud until the verification code becomes available or the timeout is reached.

You do not need to add manual delays or retry loops to your Scenario.

:::

::: warning Use a Flowstride email address

`flow.mail.getotp` only retrieves verification codes sent to email addresses ending with the **`@flowstridemail.com`** domain.

For example:

```flow
flow.mail.getotp "john.doe@flowstridemail.com" into "otp";
```

Using any other email domain is not supported.

:::

::: info Variable assignment

The retrieved OTP can be assigned to either:

- a local variable
- a global variable

using either the `into` or `as` keywords.

:::

---

## Common Mistakes

::: warning Don't use personal email providers

The following will **not** work:

```flow
flow.mail.getotp "john@gmail.com" into "otp";
```

Instead, use a Flowstride mailbox:

```flow
flow.mail.getotp "@randomEmail@flowstridemail.com" into "otp";
```

Every mailbox used with `flow.mail.getotp` **must** end with the `@flowstridemail.com` domain.

:::

::: warning Don't add manual waiting logic

The runtime already performs automatic polling for incoming verification emails.

Avoid adding commands such as long waits before calling `flow.mail.getotp`.

Instead, retrieve the OTP immediately after triggering the email.

:::

::: warning Use the returned variable

Avoid hardcoding verification codes.

Instead of:

```flow
flow.type input "Enter 6-digit OTP" "123456";
```

use:

```flow
flow.type input "Enter 6-digit OTP" "@myOtp";
```

This allows your Scenario to work with live verification codes generated by your application.

:::

---
