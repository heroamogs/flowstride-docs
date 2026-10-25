# Assertions and useful failure reports

An action performs work. An assertion proves a specific outcome. Use both: clicking Login is useful, but the authenticated account appearing establishes that login succeeded.

## Choose the assertion form

| Need | Use |
| --- | --- |
| Readable visible text, an exact input value, a DOM attribute or an API response | `flow.expect` |
| Exact target state, CSS/property, count, accessibility name, URL/title or browser storage | `flow.assert.that` |
| A captured browser request/response | `flow.network.expect` |
| A downloaded file | `flow.download.expect` |
| Function calls/arguments | `flow.stub.expect` |
| Accessibility violations or an ARIA tree | `flow.a11y.scan`, `flow.a11y.match`, or baseline comparison |
| Game rules or rendering | `game.expectState`, `game.expectPreserved`, `game.expectVisual` |

Both main assertion styles work in OS and Cloud. Use an intermediate `And` for checks before the final `Then`. Put all final checks inside the same `Then`; no `And` or other execution block can follow it. Final actions may also belong to `Then`. [Core concepts](/guide/core-concepts) defines the scenario rules.

## Check each intended outcome

```flow
Feature: Ready login form

  Scenario: Inputs and submit button are usable
    Given "The login page is open"
      flow.open "/login";

    When "The test account is entered"
      flow.type input "Email" "{{env.TEST_EMAIL}}";
      flow.type input "Password" "{{env.TEST_PASSWORD}}";

    Then "The email is preserved and the Login button is ready"
      flow.assert.that {
        "selector": "input[name='email']",
        "condition": "value",
        "value": "{{env.TEST_EMAIL}}"
      };

      flow.assert.that {
        "role": "button",
        "name": "Login",
        "condition": "enabled",
        "timeout": 10000
      };
```

`role` and `name` identify the exact accessible target. `condition` states what must be true. Use multiple assertion objects to check multiple independent outcomes; one object does not accept an arbitrary list of conditions.

## Read the individual checks

A condition failure keeps successful target-resolution results. For example:

```text
✖ flow.assert.that
    ✔ Target found: button named "Login"
       ✔ role: button
       ✔ name: Login
    ✔ Exactly one matching target
    ✖ condition: enabled
       Expected: enabled
       Actual: disabled
    Timeout: 10000 ms
    Location: login.flow:24
```

The button exists and is uniquely identified; its enabled condition failed. If no target exists, the lookup fails and dependent checks are not evaluated. A timeout is diagnostic context, not a separate assertion about whether ten seconds is correct.

The terminal, dashboard and retained CI JSON/JUnit preserve these details. Child diagnostics do not inflate the number of executed steps. Password-like values and known secrets are redacted; do not weaken redaction to investigate a failure.

## Waiting and deadlines

Native assertions poll until the selected condition holds or their timeout expires. An explicit assertion timeout controls its supported command deadline, including a value longer than the project default. Without it, the configured default applies. Polling does not repeat the click, API mutation or recording action that preceded the check.

For asynchronous application work, assert the result rather than adding arbitrary sleeps. Use a [network waiter](/guide/native-browser-workflows#mock-requests-and-wait-for-network-events) when the request itself matters. [Scenario retries](/guide/waiting-and-retries) repeat a larger journey and have separate side effects.

## Diagnose failures across features

All command failures carry relevant command/target or resource details, file/line and the underlying error where available. Nested causes and browser call logs are preserved subject to redaction. The framework reports what it observed; a timeout alone cannot prove which backend dependency failed.

| Failure | Inspect next |
| --- | --- |
| Target absent or ambiguous | Label/selector, active tab/profile/frame, visibility and repeated records |
| Actual value differs | The received value, latest API state and the application's business rule |
| API HTTP or network failure | Endpoint, status, response, connectivity and authentication |
| Variable/environment failure | The named missing value, generation/extraction order and scope |
| Session failure | Saved name, origin, expiry and whether backend data still exists |
| Upload/download failure | Fixture path, chooser/armed event, file limits and resulting application state |
| Plugin failure | Alias/export, arguments, thrown cause and public SDK method |
| Game failure | Canvas bounds, occlusion, exposed state and fixture registration |
| Audio/OTP failure | Fixture/service prerequisites, application state and delivery/processing timing |

## Read the run honestly

A failed required step fails its attempt. Later steps in that attempt are **not tested**; they are not successes. A `flow.try` failure is **skipped**, and a debug stop leaves work incomplete. Successful retries retain the earlier failure and report a flaky outcome.

In `summary.json`, read overall `status`, errors, final steps, attempts and evidence paths. A failed step can contain the useful error even if the suite-level errors array is empty. Cloud reporting/upload status is separate from the test outcome. [Dashboard review](/reporting/dashboard) and [CI evidence](/reporting/artifacts) show where to find each record.

To validate an assertion, deliberately expect a value your fixture never produces, confirm the failure and its diagnostic cause, then restore the correct expectation. Keep negative examples out of a passing CI target.
