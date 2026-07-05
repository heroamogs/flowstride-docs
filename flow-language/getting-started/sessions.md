# Sessions

## Introduction

Modern applications rarely authenticate with a single cookie.

A successful login often establishes multiple pieces of state simultaneously. The browser may receive cookies, populate Local Storage, create Session Storage entries, and cache authentication data that future requests depend on.

Flowstride treats all of these as a single **Session**.

Instead of forcing you to repeat the login process before every Scenario, Flowstride allows you to capture the authenticated state once and restore it whenever you need it.

---

## Why Sessions Exist

Logging in repeatedly has several drawbacks.

- It slows down test execution.
- It introduces unnecessary points of failure.
- It increases network traffic.
- It makes Scenarios longer than necessary.
- It distracts from the business behaviour being tested.

Consider the following Scenario:

```flow
Scenario: Approve a loan

Given "Administrator is already authenticated";
  flow.use session "Admin";

When "Administrator approves the pending loan";
  ...

Then "Loan should become approved";
  ...
```

The Scenario immediately focuses on the business behaviour instead of spending several steps entering credentials and waiting for the application to authenticate.

This produces faster, cleaner, and easier-to-maintain automation.

---

## Browser + API Hybrid State

Unlike many automation frameworks, Flowstride treats a session as more than just browser cookies.

When a Session is captured, Flowstride stores the complete browser state required to continue execution without logging in again.

The current implementation captures:

- Browser cookies
- Local Storage
- Session Storage
- Browser fallback domain information

When that Session is restored, Flowstride injects the captured state back into the browser before execution continues.

Because Flowstride also provides first-class API automation, Sessions are designed to support hybrid UI and API workflows without changing the way your Scenarios are written.

---

## Session Lifecycle

Every Session follows the same predictable lifecycle.

```text
                 User logs in
                     │
                     ▼
       flow.save session "Admin"
                     │
                     ▼
        Flowstride captures state
        ├── Cookies
        ├── Local Storage
        ├── Session Storage
        └── Browser information
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
    Local Session         Global Session
          │                     │
          └──────────┬──────────┘
                     ▼
          persist keyword used?
                     │
          ┌──────────┴──────────┐
          │                     │
         No                    Yes
          │                     │
          ▼                     ▼
    Memory only         .flowstride/sessions/Admin.json
          │                     │
          └──────────┬──────────┘
                     ▼
        flow.use session "Admin"
                     │
                     ▼
     Browser state restored instantly
                     │
                     ▼
          Continue the Scenario
```

This lifecycle makes Session behaviour completely predictable.

Whether a Session exists only for the current Scenario, is shared across multiple Scenarios, or is persisted for future executions, the way you use it remains consistent throughout the Flowstride language.

---

## Saving Sessions

Once your application reaches an authenticated state, you can capture that state using the `flow.save session` command.

```flow
flow.save session "AdminLogin";
```

Flowstride records the current authenticated browser state and assigns it the name you provide.

That Session can later be restored using `flow.use session`, allowing future Scenarios to continue from the authenticated state instead of performing another login.

---

## Local Sessions

A local Session exists only for the lifetime of the current Flowstride execution.

For example:

```flow
When "Save the logged in session"
  flow.save session "AdminLogin";
```

The Session remains available while the current execution is running and can be reused by later Scenarios.

Local Sessions are ideal when:

- Multiple Scenarios share the same authenticated user.
- You want to avoid repeating login steps.
- The Session does not need to survive after execution completes.

---

## Global Sessions

Sometimes multiple Scenarios need to share the same authenticated state.

Flowstride supports global Sessions, allowing a Session to be reused across the current execution without creating duplicate login flows.

```flow
flow.save global session "AdminLogin";
```

Any subsequent Scenario executed during the same Flowstride run can restore the saved Session.

Global Sessions are particularly useful for large Feature files where many Scenarios operate on the same authenticated account.

---

## Persistent Sessions

If you want a Session to remain available even after Flowstride has finished executing, add the `persist` keyword.

```flow
flow.save session "AdminLogin" persist;
```

Flowstride stores the captured Session inside the project's runtime workspace.

```text
.flowstride/
└── sessions/
    └── AdminLogin.json
```

The Session can then be restored during future executions without requiring another login.

Persistent Sessions are useful when:

- Login is expensive or time-consuming.
- Multi-factor authentication is involved.
- A reusable authenticated state is shared across multiple test runs.

---

### Examples

## Saving a Browser Login

After successfully logging into the application, save the authenticated browser state.

```flow
When "Save the logged in session"
  flow.save session "AdminLogin" persist;
```

Later, another Feature or Scenario can restore the same persisted Session.

```flow
Given "Reuse the authenticated session"
  flow.use session "AdminLogin";
```

---

## Saving an API Authentication Session

Sessions are not limited to browser-driven authentication.

You can authenticate through the API, save the authenticated state, and continue directly into the UI.

```flow
Given "User authenticates via API"
  flow.post "/api/auth/login" with reqBody
  """
  {
      "email": "{{env.ADMIN_EMAIL}}",
      "password": "{{env.ADMIN_PW}}"
  }
  """

When "Save the authenticated session"
  flow.save session "AdminAuth";
```

A later Scenario can immediately reuse that Session.

```flow
Given "Jump directly to the dashboard"
  flow.use session "AdminAuth";

And "Open the admin dashboard"
  flow.open "/admin";
```

This allows Flowstride to combine fast API authentication with browser automation in a single, uninterrupted workflow.

---

## Best Practices

Sessions are most effective when they are used to eliminate unnecessary work while keeping your Scenarios independent and easy to understand.

The following practices are recommended for every Flowstride project.

---

## Avoid Repeated Logins

Once a Session has been captured, reuse it whenever possible.

Instead of logging in before every Scenario:

```flow
Scenario: View Dashboard

Given "User logs in"
  ...

Scenario: Approve Fund

Given "User logs in"
  ...

Scenario: Generate Report

Given "User logs in"
  ...
```

Save the authenticated state once:

```flow
flow.save session "AdminLogin" persist;
```

Then simply restore it whenever needed.

```flow
Scenario: View Dashboard

Given "Restore administrator session"
  flow.use session "AdminLogin";

Scenario: Approve Fund

Given "Restore administrator session"
  flow.use session "AdminLogin";

Scenario: Generate Report

Given "Restore administrator session"
  flow.use session "AdminLogin";
```

This makes your automation significantly faster while allowing each Scenario to focus solely on the business behaviour it is validating.

---

## Use Meaningful Session Names

Choose names that describe the authenticated state being stored.

Good examples:

```flow
flow.save session "AdminLogin";

flow.save session "CustomerLogin";

flow.save session "SupportAgent";
```

Avoid generic names such as:

```flow
flow.save session "Session1";

flow.save session "Test";

flow.save session "Login";
```

Clear names make large automation suites much easier to understand.

---

## Persist Only When Necessary

Use the `persist` keyword only for Sessions that need to survive future executions.

For temporary authentication used within the current execution, a regular Session is usually sufficient.

```flow
flow.save session "AdminLogin";
```

Persist only when the Session is intended to be reused across multiple Flowstride runs.

```flow
flow.save session "AdminLogin" persist;
```

---

## Common Mistakes

::: warning Avoid These Common Mistakes

## Saving the Session too early

Always save the Session **after** authentication has completed.

Incorrect:

```flow
flow.click button "Login";

flow.save session "Admin";
```

Correct:

```flow
flow.click button "Login";

flow.expect visible "Logout";

flow.save session "Admin";
```

Waiting until the application has fully authenticated ensures that the complete browser state is captured.

---

## Using different Session names

Flowstride restores Sessions by name.

If you save:

```flow
flow.save session "AdminLogin";
```

you must restore the same Session.

```flow
flow.use session "AdminLogin";
```

Using a different name will cause Flowstride to be unable to locate the saved Session.

---

## Logging in when a Session already exists

If a reusable authenticated Session is already available, restore it instead of repeating the login flow.

This keeps your automation faster, shorter, and easier to maintain.

:::

---
