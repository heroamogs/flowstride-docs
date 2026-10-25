# Save and restore browser sessions

A saved session is a snapshot of the currently selected browser profile. OS and Cloud can retain cookies, localStorage and sessionStorage, then restore them for a later scenario or CLI invocation.

## Save after a verified login

```flow
flow.open "/login";
flow.type input "Email" "{{env.TEST_EMAIL}}";
flow.type input "Password" "{{env.TEST_PASSWORD}}";
flow.click button "Sign in";
flow.expect visible "My account";
flow.save session "reader-login" persist;
```

Put these actions under `Given`/`When` in a complete scenario, with a final outcome assertion under `Then`. Save after verifying the application's authenticated state. Persisted data belongs under the project's `.flowstride/sessions/`; keep it outside Git and public artifacts.

In another run:

```flow
Feature: Restore the reader account

  Scenario: Open the account without signing in again
    Given "The saved browser state is restored"
      flow.use session "reader-login";

    When "The account page is opened"
      flow.open "/account";

    Then "The account remains authenticated"
      flow.expect visible "My account";
```

The application must still accept that session and retain its backend account/data. An expired cookie or restarted in-memory demo server can invalidate the login even when the snapshot loads correctly.

## Scope and lifetime

| Command | Lifetime |
| --- | --- |
| `flow.save session "name";` | Current file's local runner memory |
| `flow.save global session "name";` | Current process's global session memory |
| `flow.save session "name" persist;` | Also writes a local snapshot for later invocations |
| `flow.use session "name";` | Load a local in-memory or persisted snapshot |
| `flow.use global session "name";` | Load a process-global or persisted snapshot |

Use simple project-safe names. Process globals do not cross parallel worker processes or CI machines. Avoid several workers writing the same persisted name at once.

## Browser storage and origins

The snapshot records the active origin. Both Web Storage types are restored only for the matching top-level HTTP(S) origin and seed once. They are not injected into an unrelated page's iframe, and later application changes/clears survive reloads. Saved keys merge with existing storage rather than clearing all unrelated keys.

A matching origin includes scheme, host and port. `http://localhost:3000` and `http://127.0.0.1:3000` are different origins. Legacy snapshots without origin metadata prefer the configured application base URL, then an available current application page. Configure the intended `BASE_URL` before using an older record.

The snapshot does not capture IndexedDB, arbitrary JavaScript memory, every tab or the application's database. The worker can also incorporate compatible cookies from its latest API response; see [API cookie login](/guide/api-testing#cookie-api-login-followed-by-a-browser-session).

## Customer and administrator at the same time

Saved names and live profiles solve different problems. Create a `customer` profile, verify its login and save `customer-login`. Create an `admin` profile, verify its login and save `admin-login`. Use `flow.browser.use` to switch between their live pages; use `flow.use session` to restore a saved snapshot into the selected profile.

```flow
flow.browser.create {
  "name": "customer"
};
flow.use session "customer-login";
flow.open "/account";
flow.browser.create {
  "name": "admin"
};
flow.use session "admin-login";
flow.open "/admin";
flow.browser.use {
  "name": "customer"
};
```

This fragment assumes both persisted snapshots already exist. [Named profiles](/guide/native-browser-workflows#separate-users-in-one-test) explains isolation. Sequential customer/admin scenarios also remain valid when simultaneous live logins are unnecessary.

## Try the local example

[Copy the included examples](/guide/working-examples), then run the session-saving flow followed by its restore flow in a new process while the same demo server remains active. The restore asserts cookies and both storage types before application startup reads them.

Cloud provides [local cleanup commands](/cloud/advanced-workflows#clear-local-runner-data) for saved sessions. Removing browser state does not revoke a Cloud developer token or delete an application account.
