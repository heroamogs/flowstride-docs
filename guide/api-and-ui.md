# API and UI in one flow

A single `.flow` scenario can create test data through an API, extract identifiers, approve or update that data through another API call, and continue through the browser. Generated credentials and extracted values can be reused throughout the file.

This is native in OS and Cloud. You do not need separate API/UI runner files. The example below also uses FlowMail OTP retrieval, which requires Cloud access within your workspace limits.

## Configure the test environment

Install Flowstride through the [normal npm setup](/guide/getting-started), then set project-root `.env` values for your application:

```dotenv
BASE_URL=https://app.example.test
SIGNUP=https://app.example.test/api/signup
NEW_USER_APPROVAL=https://app.example.test/api/admin/approve
ADMIN_API_TOKEN=replace-with-an-authorized-test-token
```

These endpoints, fields, statuses and UI labels are illustrative. Your application must provide them. Use an authorized test environment and supply administrative credentials only where your API requires them. Do not commit `.env` or enable test-only approval endpoints in a public production application.

For the FlowMail step, connect your Cloud workspace with `npx flowstride login`. Creating a generated email string alone does not create a mailbox; the application must send its OTP through the supported FlowMail test-address workflow.

## Create, approve and sign in

```flow
Feature: Approve a newly registered user

Scenario: API preparation followed by UI login and OTP verification

Given "A new user signs up through the API"
  flow.post "{{env.SIGNUP}}" with reqBody
  """
  {
    "firstName": "Mike",
    "lastName": "Doe",
    "dob": "1995-05-10",
    "sex": "male",
    "email": "$randomEmail@flowstridemail.com",
    "password": "$randomPassword"
  }
  """
  flow.expect status "201";
  flow.expect resBody "userId" not.empty;
  flow.extract resBody "userId" as "newUserId";

When "An authorized administrator approves the user through the API"
  flow.post "{{env.NEW_USER_APPROVAL}}" with reqHeader "Authorization" "Bearer {{env.ADMIN_API_TOKEN}}" with reqBody
  """
  { "userId": "@newUserId" }
  """

And "The approval succeeds"
  flow.expect status "200";
  flow.expect resBody "message" equals "User approved successfully";
  flow.expect resBody "user.status" equals "active";

When "The new user signs in through the website"
  flow.open "/";
  flow.click "Log in" near "Sign up";
  flow.type "Email" "@randomEmail@flowstridemail.com";
  flow.type "Password" "@randomPassword";
  flow.click button "Login";

When "The received OTP is entered"
  flow.mail.getOtp "@randomEmail@flowstridemail.com" into "myOtp";
  flow.type input "Enter 6-digit OTP" "@myOtp";
  flow.acceptDialog;
  flow.click button "Verify OTP";

Then "The authenticated account is visible"
  flow.expect visible "Logout";
```

Save it as `flows/approval.flow`, adapt the application contract, then run:

```sh
npx flowstride run flows/approval.flow
npx flowstride run flows/approval.flow --ci
```

## What carries across the journey?

| Value | Created by | Reused by |
| --- | --- | --- |
| Email | `$randomEmail@flowstridemail.com` in signup | `@randomEmail@flowstridemail.com` in the browser and FlowMail |
| Password | `$randomPassword` in signup | `@randomPassword` in browser login |
| User ID | `flow.extract resBody "userId"` | `@newUserId` in the approval body |
| Received OTP | `flow.mail.getOtp ... into "myOtp"` | `@myOtp` in the OTP input |

Use `$` once when a fresh generated value is needed and `@` to reuse it. Generating again produces another value. Assert a response before extracting or relying on its data. Each API assertion examines the most recent direct API response.

## Shared values are not automatic shared authentication

The browser and direct API adapter are separate clients. Reusing an email/password is explicit data reuse; it does not automatically transfer every API cookie or token to the browser. Use verified UI login or an explicit [session save/use workflow](/flow-language/getting-started/sessions).

For simultaneous customer/admin browser users, use [named profiles](/guide/native-browser-workflows#separate-users-in-one-test). For ordinary API-to-UI setup, no additional profile is required.

Browser network mocks do not intercept direct API commands. [Network routes and waits](/guide/native-browser-workflows#mock-requests-and-wait-for-network-events) control browser traffic. Without FlowMail, the same API/UI pattern works in OS with an application-appropriate login or test-OTP mechanism.
