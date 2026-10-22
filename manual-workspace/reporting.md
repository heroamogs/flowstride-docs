# Review and report manual results

Start with the submitted run, not only its top-line pass count. The record should explain what was tested, what was skipped or blocked, and what evidence supports each failure.

## Review in layers

| Layer | Review question |
| --- | --- |
| Context | Correct design version, test plan, build, environment and data? |
| Completeness | Any Pending, Current, Blocked or Skipped steps? |
| Correctness | Does each Passed step have an actually observed expected result? |
| Defects | Is the mismatch reproducible and linked to its step? |
| Evidence | Can the intended reviewer open the referenced images/clips? |
| Delivery | Was the run saved locally, synchronized to Cloud, or both? |

The local and Cloud aggregate logic counts all statuses other than Passed and Failed under pending. Inspect the per-step report when explaining incomplete coverage.

## Preserve the narrative

A useful handoff states: “Checkout v1.0 on staging build B-123: 2 passed, 1 failed; confirmation ID differs from history; defect ORDER-17; run and clip attached.” Include blocked/skipped reasons instead of presenting only a percentage.

The saved JSON includes the canvas, metadata and execution report. Cloud's manual flow review provides another presentation when synchronization and permissions allow it. Neither automatically establishes a formal approval or compliance certification.

## PDF boundary

The automated runner's **TestCase → Export PDF** action exports automated case data. This documentation does not promise a native formal PDF export of the manual canvas/run. Use your team's approved reporting method for a manual stakeholder document, and attach/link the preserved run and evidence.

## Retention

Agree how long to retain failed runs, passing retests and their media. Deleting a template should not be assumed to delete every historical run or remote object. Keep the record and its evidence together for as long as the team needs to reproduce and review the result.
