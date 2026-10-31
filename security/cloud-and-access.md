---
description: Understand Flowstride Cloud workspace access, developer tokens, browser sessions, private media and storage limits.
---
# Cloud access and storage

Cloud includes free accounts. Access to a particular service depends on the account, workspace membership, credential scope and plan limits. Tests continue to run on your own computer or CI runner.

## Workspace authorization

Run details, associated video playback and protected manual attachments require authorization for the owning workspace. Knowing a run ID or holding a report link does not by itself grant workspace membership.

Select the intended workspace before generating credentials or submitting results. Review membership when someone joins, changes role or leaves. A name typed into a local manual report is descriptive data; it is not an authenticated approval or a grant of access.

Downloading a report or sending someone a file creates another copy. Cloud membership cannot control that copy after you distribute it.

## Browser sessions and developer tokens

| Credential | Used for | How to end its access |
| --- | --- | --- |
| Browser session | Signed-in Cloud dashboard | Sign out; use **Logout all sessions** to invalidate previous browser sessions |
| Developer/machine token | CLI and CI access within its scope/workspace | Revoke that token or let it expire; replace it in consumers when rotating |
| Saved application session | Your application's browser login | Revoke/end it in the application and remove the local snapshot as appropriate |

Cloud browser session cookies are HttpOnly, use Secure in production and use SameSite Strict. **Logout all sessions** invalidates earlier dashboard sessions; it does not revoke developer keys used by the CLI or CI. Revoke exposed machine keys separately.

Developer Tokens shows creation, expiry and last use. Logging in again with the same token does not renew it. `FLOWSTRIDE_TOKEN` can override the local saved login. Use [authentication and rotation](/cloud/authentication) to troubleshoot the actual credential source.

Account authentication and verification have request/attempt limits. If a response asks you to retry later, wait rather than repeatedly resending. A temporary service error is not evidence that credentials were accepted. These controls do not replace infrastructure-level availability protection.

Role demotion or removal revokes that member's machine keys in the affected workspace. If a permission change reports a failure, an administrator should investigate and retry it; do not assume an unsuccessful response completed revocation.

## Hosted environment secrets

New hosted workspace secret values use authenticated encryption with dedicated versioned encryption keys. Encryption binds the stored value to its workspace and variable key. The listing returns names/timestamps, not plaintext secret values.

This applies to that hosted secret store. It does not mean local `.env` files, session snapshots, arbitrary reports or every database field are encrypted by Flowstride. Historical records require reviewed migration, and key access/recovery remain deployment responsibilities. A code change alone does not establish that every old record or backup has been migrated.

## New videos and manual attachments

Automated video upload requires bounded, workspace-scoped authorization. The product's automated video maximum is **50 MiB**; hosting limits, workspace eligibility or media policy may impose a lower limit. Playback requires an authorized workspace session. Upload permission does not make a file generally public.

New manual defect uploads use private, workspace-authorized attachment references. Cloud reviewers need access to the owning workspace. The local editor can fetch eligible attachments through its authenticated loopback server without putting a machine token into the image URL.

Short-lived media upload/read links are temporary access capabilities. Keep them out of public issues and transcripts; a copied temporary link can remain usable until it expires. Do not substitute an arbitrary storage URL for a protected attachment reference.

**Older public attachments require separate migration and access review.** Normalizing an old reference in a report does not itself make an already-public object private. Do not assume historical links have changed access merely because the client was updated.

Design reference images under `manual_flows/media` remain local unless you deliberately distribute them. [Manual evidence](/manual-workspace/defects-and-evidence) explains local preservation, limits and remote delivery.

## Retention and deletion

Cloud retention follows workspace policy and depends on a configured, monitored cleanup service and successful storage deletion. Cleanup protects against silently discarding retry information when object deletion fails. An expiry time is not a promise that every copy disappears at that exact instant.

A removed link, deleted local cache or successful run submission is not proof of deletion from Cloud objects, exported reports, CI, recipients or backups. Historical data and older public links need their own review. Keep a controlled copy only when you need it, and apply your team's retention policy at every destination.

Flowstride's local tests do not establish production backup restoration, historical media migration or an organization's compliance requirements. Review the deployed service and your data policy before submitting sensitive information.
