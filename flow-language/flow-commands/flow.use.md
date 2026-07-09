# flow.use

## Introduction

`flow.use` is a **Flow Command** that restores a previously saved browser session.

Rather than repeatedly logging into an application, `flow.use` injects a saved session back into the browser, allowing your Scenario to continue from an already authenticated state.

It is the companion command to `flow.save` and supports local sessions, global sessions, and persisted sessions stored on disk.

---

## The Problem It Solves

If `flow.save` is how you capture an authenticated state to avoid repetitive logins, `flow.use` is how you restore that state into a new browser context.

When running hundreds of UI tests in parallel, repeatedly logging in through the UI wastes execution time and can trigger authentication throttling, rate limits, or anti-bot protections.

`flow.use` eliminates this overhead by restoring an existing authenticated session, allowing your tests to navigate directly to protected areas of the application.

---

## How flow.use Works

`flow.use` acts as a session restoration engine.

When executed, Flowstride locates the requested session and injects it into the browser before your application is loaded.

### 1. Tiered Session Resolution

Flowstride first searches for the requested session in memory.

If the command specifies a global session:

```flow
flow.use global session "administrator_session";
```

the framework checks the global session store.

Otherwise, it searches the current execution's local session store.

---

### 2. Disk Fallback (Auto-Hydration)

If the session cannot be found in memory, Flowstride automatically searches the persisted session directory:

```text
.flowstride/
└── sessions/
    └── <session-name>.json
```

When a matching session file is found, Flowstride:

1. Loads the session from disk.
2. Restores it into memory.
3. Continues execution using the loaded session.

This allows persisted sessions to be reused across separate test executions without requiring another login.

---

### 3. Context Injection

Once the session has been resolved, Flowstride passes the captured session to the Web Adapter.

The browser context is restored by rehydrating:

- Browser cookies
- API authentication cookies
- Local Storage
- Session Storage

The restored browser context is then ready for your next navigation, allowing the application to resume the previously authenticated session.

---

## Syntax

```flow
flow.use session "<session-name>";
```

```flow
flow.use global session "<session-name>";
```

---

## Parameters

| Parameter    | Required | Description                                                |
| ------------ | :------: | ---------------------------------------------------------- |
| `global`     | Optional | Restores a session from the global session store.          |
| `session`    |    ✅    | Indicates that a saved browser session should be restored. |
| Session Name |    ✅    | The name of the previously saved session.                  |

---

## Examples

### Restore a local session

Use a local session when another Scenario in the current execution has already authenticated the user.

```flow
Feature: Profile Settings

Scenario: Edit profile information

Given "Restore the authenticated user session"
  flow.use session "user_session";

When "Open the profile page"
  flow.open "/settings/profile";

Then "The profile page loads without authentication"
  flow.expect visible "Your Profile Settings";
```

---

### Restore a persisted global session

Persisted global sessions are ideal for setup scripts that prepare authenticated environments for large test suites.

```flow
Feature: Administrator Management

Scenario: Access the administrator dashboard

Given "Restore the administrator session"
  flow.use global session "administrator_session";

When "Open the administrator dashboard"
  flow.open "/admin/users";

Then "The administrator dashboard is displayed"
  flow.expect visible "Manage Active Users";
```

---

## When to Use flow.use

Use `flow.use` whenever you want to restore a previously captured browser session.

Typical scenarios include:

- Skipping repetitive login flows
- Restoring authenticated users
- Running large UI test suites
- Sharing authentication between Scenarios
- Restoring persisted sessions in CI/CD pipelines

For best results, place `flow.use` at the beginning of a Scenario—typically inside a `Given` block—before navigating to protected pages with `flow.open`.

---

## Important Notes

::: info Companion command

`flow.use` restores sessions previously created with `flow.save`.

The two commands are designed to work together throughout the session lifecycle.

:::

::: info Automatic session resolution

Flowstride searches for sessions using the following order:

1. Local session store
2. Global session store (when `global` is specified)
3. Persisted session files stored on disk

If a persisted session is found, it is automatically loaded back into memory before being restored.

:::

::: info Browser state restoration

A restored session rehydrates:

- Browser cookies
- API cookies
- Local Storage
- Session Storage

This allows the browser to resume the previously authenticated session without performing another login.

:::

---

## Common Mistakes

::: warning Restore the session before navigation

Always restore the session before opening protected pages.

Instead of:

```flow
flow.open "/dashboard";
flow.use session "user_session";
```

use:

```flow
flow.use session "user_session";

flow.open "/dashboard";
```

This ensures the browser is already authenticated before the application loads.

:::

::: warning Use the correct session name

`flow.use` can only restore sessions that were previously created with `flow.save`.

Ensure the session name exactly matches the saved session.

:::

::: warning Remember to persist reusable sessions

If you intend to reuse a session across multiple test executions, save it using the `persist` modifier.

Otherwise, the session exists only for the current execution.

:::

---
