# Fixtures and handoffs

In Flowstride (FS), a fixture is a named JS or TS function that sets up a resource and registers its cleanup with Flowstride. Its first argument is a fixture context. Use the context's `signal` for setup, and the signal given to the cleanup callback for cleanup.

## Choose the fixture lifetime

| Command | Setup and cleanup |
| --- | --- |
| `flow.fixture.use createAccount() as "account"` | Sets up a fresh resource for each scenario attempt. Cleanup runs before a retry, after the scenario, or on cooperative cancellation. |
| `flow.fixture.worker loadCatalog() as "catalog"` | Reuses a resource in the same worker for the same helper and arguments. A successfully initialized resource is released when the worker finishes. Its binding belongs to the current attempt. |

Place fixture calls in `Given` and import their named functions under `Feature`. Capture results with `as "account"` and read values like `@account.id`. Scenario fixtures receive a one-based `attempt` number. Worker fixtures suit shared read-only resources. Use scenario fixtures for mutable accounts and independent browser profiles.

Register each cleanup with `defer` as soon as the resource is acquired. Flowstride runs callbacks in reverse order. This also releases resources already acquired when setup fails partway through. A fixture can declare an independent browser profile with `profile("admin")` and switch to it with `flow.browser.use`.

## Follow an admin-to-user handoff

Initialize the bundled practice project and run the dependent example.

```sh
npx flowstride init
npx flowstride run flows/examples/advanced/new-user-signs-in.flow
```

FS includes `admin-creates-user.flow` automatically. The user test shows **Waiting for admin-creates-user.flow** throughout the first attempt and retry. The fixture generates test details and registers cleanup. The admin fills the form, clicks **Create user**, selects **Booking approver** for that user and clicks **Assign role**. The practice app deliberately rejects the first role save. Flowstride removes that account and retries with a fresh one. The user signs in with the successful account in a separate browser session, verifies its identity and approval permission, then Flowstride removes the account.

The practice scenario allows one retry by default. Set `"retries": 0` in its configuration to see **Blocked** when the admin fails. Add `--ci` to save headless results, including each attempt and its cleanup records. [Practice app setup](/guide/working-examples#bundled-practice-app)

## Publish and receive in separate files

In the producer, place the handoff after the setup and permission changes. Flowstride stages the output until the producer file passes.

```flow
flow.handoff.publish {
  "name": "approvedMember",
  "value": {
    "id": "@account.id",
    "email": "@account.email"
  },
  "credentials": {
    "password": "@account.password"
  }
};
```

In the consumer, receive the handoff in `Given`. Use the data and credentials through separate bindings.

```flow
Feature: A new member can approve bookings

Scenario: Sign in after the admin grants access
  Given "Wait for the approved account"
    flow.handoff.receive {
      "name": "approvedMember",
      "as": "member",
      "credentialsAs": "login"
    };
    flow.open "/login";
  When "Sign in as the new member"
    flow.type input "Email" "@member.email";
    flow.passcode input "Password" "@login.password";
    flow.click button "Sign in";
  Then "Confirm access"
    flow.expect visible "Can approve bookings";
```

The producer fixture can defer deletion with `defer(deleteAccount, { handoff: "approvedMember" })`. Failed attempts still clean up immediately. The successful attempt keeps the account until the run finishes, including any retries of its consumer.

Each handoff has one producer. The scheduler checks for missing or duplicate producers and dependency cycles. Connected files stay together in one CI shard. Keep passwords in `credentials` and use `flow.passcode` for entry. In your own protected handoff runs FS masks credential values and suppresses automatic capture and persisted sessions. The unmodified bundled practice demo allows local frames and step screenshots of its synthetic form data, with passwords masked. Recordings, traces and DOM snapshots are still suppressed for the protected handoff. Editing the protected examples or their trusted helpers restores the standard capture restrictions.
