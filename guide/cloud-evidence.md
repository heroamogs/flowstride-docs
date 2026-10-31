# Cloud reports and evidence

Flowstride Cloud provides authenticated workspaces, account-connected features and result review. Free accounts include workspace services within their plan limits. Tests execute on your computer or your CI runner.

## Automated runs

Interactive authenticated runs can report to Cloud where allowed. Native CI requires explicit `cloudSync: true` and valid credentials. Cloud delivery is separate from execution status. `security.evidence.cloudVideo: false` blocks automatic video upload while eligible result reporting can continue; it does not block an explicit manual attachment upload.

Automated video uploads use short-lived workspace authorization with bounded file size and media type. The automated video maximum is **50 MiB**. Eligibility depends on the workspace and service. Playback requires authentication and workspace membership.

Trace ZIPs, HAR, DOM/accessibility snapshots and downloaded files stay in local/CI evidence; they are not automatically uploaded by the automated video path. Retain those artifacts explicitly when you need them. [Evidence formats](/reporting/artifacts#attempts-profiles-and-diagnostic-files).

## Manual runs

Submitting a manual run saves its local record first, then attempts Cloud synchronization when credentials are available. A synchronization warning does not erase the local run.

New manual defect uploads use **private, workspace-authorized attachment references**. A reviewer needs access to the owning workspace; the local editor can resolve eligible attachments through its authenticated local server. Older public attachments require separate migration and access review; a client update does not establish that all historical objects are private. Reference images in `manual_flows/media` stay local and may not be visible to a remote reviewer. [Manual evidence](/manual-workspace/defects-and-evidence) explains both.

## Authentication and access

Developer Tokens shows creation, expiration and last-use information. Replace expired or revoked tokens and authenticate again. Logging in with the same token does not renew its expiry.

Never include tokens in documentation, committed workflows, manual templates or copied bug reports. For connection steps, use [Cloud authentication](/cloud/authentication).

## Keep evidence you need

Run and evidence retention follows workspace policy and depends on successful cleanup in the deployed service. An expiry time does not guarantee immediate deletion of every copy. Keep a controlled local copy only when needed, and check access before sharing a report. [Cloud access and storage](/security/cloud-and-access) covers browser sessions, developer tokens, encrypted workspace secrets and historical media limits.

A successful test can have failed Cloud delivery. Review the run's reporting status separately from its pass/fail result; [reports and artifacts](/reporting/artifacts) explains where to find local evidence.
