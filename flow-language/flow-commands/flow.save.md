# flow.save

## Introduction

`flow.save` is a **Flow Command** that captures the current browser session and stores it for later reuse.

Rather than forcing every Scenario to repeatedly authenticate, `flow.save` allows Flowstride to preserve the current authentication state (including browser storage and cookies) so it can later be restored using its companion command, `flow.use`.

The command supports local sessions, global sessions, and optional disk persistence.

---

## The Problem It Solves

A massive pain point in UI automation is authentication fatigue. If you have 50 tests that require a logged-in user, navigating to the login page, typing credentials, and waiting for the dashboard to load 50 times takes forever.

Worse, doing this repeatedly can trigger anti-bot systems, authentication throttling, or rate limits, causing otherwise healthy tests to fail.

Traditional browser automation frameworks often require complex setup code to manually export cookies and browser storage before injecting them into future browser contexts.

`flow.save` removes this complexity by allowing the current session to be captured with a single Flow Command.

---

## How flow.save Works

`flow.save` automatically captures and stores the current browser session using a hybrid session model and a tiered storage system.

### 1. Hybrid State Extraction

When executed, Flowstride captures the current browser state from the Web Adapter, including:

- Browser cookies
- Local Storage
- Session Storage

It also retrieves any HTTP cookies captured by the API Adapter from previous API requests.

These browser and API states are merged into a single hybrid session profile before being stored.

---

### 2. Tiered Session Storage

Flowstride supports multiple storage scopes.

#### Local Session (Default)

```flow
flow.save session "user_session";
```

The session is stored in the current execution's local session store.

It can later be restored using `flow.use session`.

---

#### Global Session

```flow
flow.save global session "admin_session";
```

Adding the `global` modifier stores the session in Flowstride's global session store, making it available throughout the current batch execution.

---

### 3. Persistent Sessions

Adding the `persist` modifier writes the captured session to disk.

```flow
flow.save session "user_session" persist;
```

or

```flow
flow.save global session "admin_session" persist;
```

Flowstride automatically creates the session directory if it does not already exist and stores the session as:

```text
.flowstride/
└── sessions/
    └── <session-name>.json
```

Persisted sessions can later be restored without performing another login.

---

## Syntax

```flow
flow.save session "<session-name>";
```

```flow
flow.save global session "<session-name>";
```

```flow
flow.save session "<session-name>" persist;
```

```flow
flow.save global session "<session-name>" persist;
```

---

## Parameters

| Parameter    | Required | Description                                               |
| ------------ | :------: | --------------------------------------------------------- |
| `global`     | Optional | Saves the session into Flowstride's global session store. |
| `session`    |    ✅    | Indicates that a browser session should be captured.      |
| Session Name |    ✅    | The unique name used to identify the saved session.       |
| `persist`    | Optional | Writes the session to disk for future executions.         |

---

## Examples

### Save a local browser session

Use a local session when subsequent Scenarios in the current execution need to reuse the same authenticated user.

```flow
Feature: User Settings

Scenario: Capture the authenticated session

Given "Open the login page"
  flow.open "/login";

When "Authenticate the user"
  flow.type input "Email" "$env.TEST_EMAIL";
  flow.type input "Password" "$env.TEST_PASSWORD";
  flow.click button "Sign In";

When "Save the authenticated session"
  flow.save session "user_session";

Then "The dashboard is displayed"
  flow.expect visible "Welcome back";
```

---

### Save a persistent global session

Global persistent sessions are useful for setup scripts that prepare authenticated environments for other test suites.

```flow
Feature: Environment Setup

Scenario: Create a reusable administrator session

Given "Open the administrator login page"
  flow.open "/admin/login";

When "Authenticate the administrator"
  flow.type input "Username" "$env.ADMIN_USERNAME";
  flow.type input "Password" "$env.ADMIN_PASSWORD";
  flow.click button "Sign In";

When "Save the session globally and persist it"
  flow.save global session "administrator_session" persist;

Then "The administrator dashboard is displayed"
  flow.expect visible "Administrator Dashboard";
```

---

## When to Use flow.save

Use `flow.save` whenever you want to preserve the current browser session for later reuse.

Typical scenarios include:

- Avoiding repeated logins
- Reusing authenticated sessions
- Speeding up large test suites
- Reducing authentication overhead
- Preparing reusable setup environments
- Creating persistent sessions for CI/CD pipelines

---

## Important Notes

::: info Companion command

`flow.save` and `flow.use` are designed to work together.

Use `flow.save` to capture a session and `flow.use` to restore it later.

:::

::: info Hybrid session capture

A saved session includes:

- Browser cookies
- API cookies
- Local Storage
- Session Storage

These are combined into a single session profile before being stored.

:::

::: info Persistent storage

When the `persist` modifier is used, Flowstride writes the session to:

```text
.flowstride/sessions/<session-name>.json
```

If the directory does not already exist, it is created automatically.

:::

---

## Common Mistakes

::: warning Saving before authentication

Saving a session before completing authentication simply stores the browser's current state.

Always authenticate first, then capture the session.

:::

::: warning Forgetting to restore the session

Saving a session alone does not affect future Scenarios.

Use the companion command `flow.use` whenever you want to restore a previously saved session.

:::

::: warning Reusing session names unintentionally

Saving another session using the same name replaces the previously stored session.

Use descriptive session names when managing multiple authenticated users.

:::

---
