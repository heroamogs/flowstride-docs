# Manual workspace troubleshooting

## The workspace will not open

Run from the intended project and follow the printed localhost URL. Keep the terminal process running. If the private CLI says authentication is required, sign in with a valid workspace token or explicitly use the public OS launcher for local OS behavior.

## The canvas is blank

Wait for the workspace engine to initialize. Confirm that you selected a template, that its `nodes` collection is present, and that imported files are valid JSON. Use zoom/navigation controls to check whether entities are outside the visible region. Do not save a blank canvas over your only good copy while investigating.

## Keyboard shortcuts seem broken

Click back into the canvas and leave input/rich-text editors. Check the mode: Delete removes selected entities in Design Mode but marks the current step Failed in Execution Mode. Tab marks Blocked during execution instead of ordinary keyboard navigation.

## Execution ends early or follows an unexpected step

Check internal creation order and outgoing arrows. The lowest internal node ID starts the run, then the engine uses the first outgoing connection. A displayed step number does not override that graph. Connect every intended step, avoid branches/cycles, and review the entire report for untouched nodes.

## A mode change reset my results

Entering Execution Mode initializes a new execution state. Submit the current run before switching back to Design. Historical records are for review; use the original template for a new retest rather than expecting to resume the historical engine state.

## Save appeared to download a file

The OS toolbar contains a browser-export path as well as the project save callback; the export depends on the hosting engine bridge. Check the save confirmation and `manual_flows/templates` or `manual_flows/runs`. A browser download alone is not proof a run was submitted successfully.

## A clip under the UI's 100 MB limit is rejected

The current manual server accepts up to 40 MiB per defect upload. Compress or trim the clip below that cap. Images should be below 5 MiB. Keep template/run JSON under 2 MiB and attach media separately.

## A teammate cannot open an image

A `/media/...` or `/defect_media/...` URL may be local to your project. Share the corresponding files through an appropriate artifact system, or confirm the run's remote evidence upload completed. Manual remote defect URLs are shareable links, not the automated private-playback route.

## Cloud synchronization failed after a local save

The local run can still be present. Check its file and evidence, then check credentials, expiry, workspace access and the Cloud host. A client update alone does not update the Cloud deployment. There is no documented automatic offline synchronization queue; do not assume it will retry later without verification.

## The overall result is incomplete although no step failed

Blocked, Skipped, Pending and Current are not Passed. Inspect the individual states and their reasons. Keep a clear explanation for release review rather than treating “no failures” as complete coverage.
