# A team workflow for manual testing

The workspace can preserve a shared description of a case and synchronize eligible run records. It does not provide simultaneous canvas co-editing, issue assignment notifications or a formal approval engine.

## Agree on a review cycle

1. The author creates a focused design and links its requirement and fixtures.
2. A reviewer checks expected outcomes and executes the case once without verbal help.
3. The author saves a reviewed version.
4. The tester confirms the version, application build and environment before execution.
5. The tester submits the run, opens defects where needed, and verifies evidence access.
6. The owner reviews failures and blocked/skipped work; a later retest is a new run.

These are recommended team practices. Record approvals in your normal review or issue system; a template's author label is not an authenticated approval.

## Share the right package

For local collaboration, share the template/run and all referenced local media. For Cloud review, confirm the record synchronized, the teammate can access the intended workspace, and evidence URLs are actually available from their environment.

A localhost reference path cannot be opened by someone else's computer merely because it appears in a Cloud record. New Cloud defect attachments require authorization for the owning workspace. Older public evidence needs separate access review; do not assume updating the client changed every historical link. Review content and recipient access before sharing. [Evidence privacy](/security/evidence-and-replay).

## Avoid conflicting edits

Use one author at a time for a saved template and resolve JSON changes in your repository review process. Saving a design in two browser windows is not a merge workflow. Keep versions/backups before replacing a shared template.

## Assignees and identity

An assignee value is descriptive run data. It does not contact a person or grant access. Likewise, a local `testedBy`/updated-by label can be a client-provided/default value. Use authenticated Cloud audit information and your team's review record when identity matters; do not treat the local label as a signed audit trail.
