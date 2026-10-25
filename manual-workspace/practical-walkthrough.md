# A complete local manual test

Practice the entire manual lifecycle against a small profile page: design review, human execution, evidence, saved results, history and a retest. This works in OS and Cloud.

## Prepare the application and template

Follow [included example setup](/guide/working-examples), leaving the shared demo server running. In the project:

```sh
mkdir -p manual_flows/templates
cp workflow-examples/manual-testing/fixtures/profile-review.json \
  "manual_flows/templates/Profile review.json"
npx flowstride open
```

Use a new template filename if one already exists. On PowerShell:

```powershell
New-Item -ItemType Directory -Force manual_flows/templates
Copy-Item workflow-examples/manual-testing/fixtures/profile-review.json `
  "manual_flows/templates/Profile review.json"
npx flowstride open
```

Choose **Profile review** from the workspace's template selector. Inspect its title, Test Plan identifier, environment, three connected steps and expected outcomes. Save the design and wait for confirmation.

## Perform and record a passing run

Open `http://127.0.0.1:4107/profile` in a separate tab/window, then enter Execution Mode in the workspace. The person performs each action in the application and returns to Flowstride to record the outcome.

| Step | Action in the application | Expected result |
| --- | --- | --- |
| Open profile | Navigate to `/profile` | Display name field is visible |
| Change the name | Enter `Lola Idowu` and click Save profile | `Saved as Lola Idowu` appears |
| Check persistence | Reload the application page | Display name still contains `Lola Idowu` |

After verifying each step, focus the canvas and press **Enter** to record Passed. The demo server keeps the changed value in memory; restarting it resets that state.

Click **Save** in OS or **Submit Run** in Cloud. Wait for confirmation and find the new record under **Runs**. Expected: three Passed steps and a PASS summary. Saving the template and saving the execution record are different operations.

## Practice failure and evidence

Copy `profile-review-mismatch.json` from the same fixture folder under a separate template name. It intentionally expects `Saved as A Different Person` after entering `Lola Idowu`.

Record the first step Passed. At the second, inspect the real result and mark Failed with **Delete/Backspace** while the canvas is focused. Mark the final follow-up Skipped with **Escape** for this exercise.

In Failure Details, record:

- Expected: `Saved as A Different Person`.
- Actual: `Saved as Lola Idowu`.
- Reproduction: the entered value, Save profile action and observed confirmation.
- Context: local demo, chosen template version and any useful screenshot.

Save the defect form with **Save Data**, then save/submit the run. Expected: one Passed, one Failed, one Skipped and an overall FAIL. Skipped work is not verified success.

## Review and retest

Open the saved run and verify its title, outcomes and defect. Historical results are evidence for that run; use the saved execution report when reviewing it. Return to the correct reusable template for another execution instead of trying to resume the historical canvas.

Preserve the failed run, correct the deliberately wrong expectation in the design, and perform a fresh run. Retesting creates a new result; it does not erase the earlier mismatch. Back up JSON and referenced media together.

[Canvas controls](/manual-workspace/canvas-and-controls), [defect evidence](/manual-workspace/defects-and-evidence), [outcome semantics](/manual-workspace/execution), and [team review](/manual-workspace/collaboration) explain each part in depth.
