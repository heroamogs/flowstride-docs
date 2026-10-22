# Cloud reports and evidence

Flowstride Cloud provides authenticated workspaces, account-connected features and result review. Free accounts include workspace services within their plan limits. Tests execute on your computer or your CI runner.

## Automated runs

Interactive authenticated runs can report to Cloud where allowed. Native CI requires explicit `cloudSync: true` and valid credentials. Cloud delivery is separate from execution status.

Automated video uploads use short-lived workspace authorization with bounded file size and media type. The automated video maximum is **50 MiB**. Eligibility depends on the workspace and service. Playback requires authentication and workspace membership.

## Manual runs

Submitting a manual run saves its local record first, then attempts Cloud synchronization when credentials are available. A synchronization warning does not erase the local run.

Manual defect evidence uses **shareable public URLs**. Treat those links as shareable evidence rather than private authenticated playback. Reference images in `manual_flows/media` stay local and may not be visible to a remote reviewer. [Manual evidence](/manual-workspace/defects-and-evidence) explains both.

## Authentication and access

Developer Tokens shows creation, expiration and last-use information. Replace expired or revoked tokens and authenticate again. Logging in with the same token does not renew its expiry.

Never include tokens in documentation, committed workflows, manual templates or copied bug reports. For connection steps, use [Cloud authentication](/cloud/authentication).

## Keep evidence you need

Run and evidence retention follows workspace policy. Keep a local copy when you need a longer-lived record, and check access before sharing a report with another person.

A successful test can have failed Cloud delivery. Review the run's reporting status separately from its pass/fail result; [reports and artifacts](/reporting/artifacts) explains where to find local evidence.
