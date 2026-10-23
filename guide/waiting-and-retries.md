# Waiting, assertions and scenario retries

Flowstride has three distinct behaviors. Understanding which one is happening makes a failure easier to diagnose.

| Behavior | What repeats or waits? | Example |
| --- | --- | --- |
| Browser action waiting | A supported action waits for its target to become usable within its timeout | A button appears, becomes enabled, then receives one click |
| Retrying assertion | The assertion reads the current condition repeatedly | An order status changes from Processing to Approved |
| Scenario retry | The whole failed scenario runs again, up to the configured limit | Login/setup/actions/assertions repeat after an attempt fails |

These are execution controls, not a guarantee that an application is ready after every network request. Assert the result the user or API should actually observe.

## Wait for the visible result

This example assumes your application provides a **Submit order** button, `#order-status` and `#submission-count`. Its click handler updates the result asynchronously and counts submissions:

```flow
Feature: Order submission

Scenario: One submission eventually becomes approved

Given "The order page is open"
  flow.open "/orders/new";

When "The customer submits once"
  flow.click button "Submit order";

Then "The result becomes approved without another submission"
  flow.assert.that {
    "selector": "#order-status",
    "condition": "text",
    "value": "Approved",
    "timeout": 10000
  };
  flow.assert.that {
    "selector": "#submission-count",
    "condition": "text",
    "value": "1"
  };
```

The click is not rerun while the status assertion polls. Use a normal action first; `forceClick` deliberately bypasses some actionability checks. A passing count assertion is useful when an accidental second submission would be a defect.

To prove the assertion works, change `Approved` to a value the application never shows. The assertion should time out and the scenario should fail. Restore the expectation after checking this failure path.

## Configure scenario retries explicitly

Retries are disabled by default. In `flowstride.config.json`:

```json
{
  "retries": 1,
  "failOnFlaky": false,
  "trace": true,
  "recordVideo": true
}
```

One retry allows at most two attempts. `retries` accepts integers from 0 through 10. It applies to failed scenarios, not only their last failed step. Each file's earlier successful scenarios are not rerun just because a later scenario retries.

Before a retry, Flowstride restores the scenario's starting browser profiles/storage, saved variables, in-memory sessions and API adapter state and cleans up native routes, waiters, function doubles and component harnesses. It does not restore arbitrary JavaScript heap state or undo backend writes, messages, persistent files or external services. Returning to a starting page can itself make requests.

Generated data is not a seeded replay and is not a promise to regenerate identical values on another attempt. Use isolated test data and repeatable setup. A fixture that fails once must keep its attempt counter outside the restored browser state. Prepare it separately so retrying the scenario does not reset it to its first failure again.

## Interpret the result

| Attempts | `failOnFlaky` | CI outcome |
| --- | --- | --- |
| First attempt passes | Either | Passed |
| First fails, later attempt passes | `false` | Passed, with the recovered scenario marked flaky |
| First fails, later attempt passes | `true` | Failed due to the flaky policy |
| Every permitted attempt fails | Either | Failed |
| Run is interrupted or incomplete | Either | Nonzero exit; inspect the recorded status |

A strict flaky failure can have all final step metrics passing. Read the overall status and errors as well as the counts. `--bail` takes effect after the scenario's final failed attempt; it does not disable its permitted retries.

## Review both attempts

In the interactive dashboard, select the relevant step and use **History attempt** to choose an earlier failure or the later success. Each flow tab has its own history cursor, profile and evidence. **Return to Live** changes the selected file's view; it does not replay a browser action.

In CI, inspect `summary.json` for `attempts`, final `steps`, errors and evidence paths. Trace/video retention preserves earlier attempts; traces show browser operations while the JSON records Flowstride assertion outcomes. Screenshots and DOM evidence show what was captured, not a rewind of the application's backend.

See [reports and evidence](/reporting/artifacts), [dashboard history](/reporting/dashboard) and the [native assertion reference](/reference/native-browser-commands#retrying-assertions).
