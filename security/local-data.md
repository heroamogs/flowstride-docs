---
description: Protect Flowstride credentials, saved browser sessions and local evidence, and understand Cloud installation checks.
---
# Local data and installation

OS and Cloud both execute with the permissions of the account running Flowstride. Protect that account and review the project before executing its tests, plugins, package scripts or dependencies.

## Credentials and saved state

| Local data | Purpose | Security implication |
| --- | --- | --- |
| Project `.flowstride/credentials.json` | Connect that project to a Cloud workspace | Anyone who obtains a usable token can act within its scope until expiry or revocation |
| User-level `.flowstride` credentials | Optional global login | Can affect projects that use global credentials |
| `.flowstride/sessions` | Persisted browser cookies and storage | Can restore an application login while the application still accepts it |
| Local saved values | Reusable test values, where supported | Can contain application identifiers or credentials |
| Artifact and report directories | Execution evidence and exports | Can contain private application content |

Project and global credentials are separate. `FLOWSTRIDE_TOKEN` takes precedence over saved credentials. [Authentication](/cloud/authentication) explains how to select and rotate the credential in use.

## Filesystem protection

Private state uses owner-only filesystem access. On Linux/macOS, private directories use `0700` and files use `0600`. Existing owned files are tightened when read or replaced. Windows uses protected owner access through filesystem ACLs; an unsupported or unverifiable protection operation fails rather than silently storing private state with weaker access.

Guarded private-state paths reject symbolic links, hard-linked files, special files and foreign ownership. Private-state writes use a temporary private file and atomic replacement; a failed replacement preserves the previous record.

These are access controls, **not encryption at rest**. Other programs running as the same user, administrators and copies made by backup software can still access the data. Use an appropriate machine account, disk encryption and backup policy for your environment. Test permissions on the actual operating system and filesystem you intend to use; a successful check on one platform does not qualify every shared drive or ACL configuration.

## Keep local data out of Git

`flowstride init` adds exclusions for private state and default generated evidence. Check your project's `.gitignore` yourself, including `.env` files and any custom output directories:

```text
node_modules/
.env
.env.*
!.env.example
.flowstride/
flowstride-artifacts/
```

Add custom report/export paths too. Review manual templates and fixtures before committing them; a template may contain private text even when it contains no password field. Do not include credentials in a ZIP of a test project.

If a secret was already committed, adding an ignore rule does not remove its history. Revoke or rotate it and follow your repository's incident process.

## Saved sessions and cleanup

Persisted sessions retain cookies, localStorage and sessionStorage for the recorded application origin. Treat them as login material and use separate names for separate accounts. [Sessions](/flow-language/getting-started/sessions) explains scope and restoration limits.

Cloud's [local cleanup commands](/cloud/advanced-workflows#clear-local-runner-data) can remove saved values or sessions. They do not revoke developer tokens, delete application accounts or securely erase disk snapshots/backups. Delete disposable evidence deliberately when you no longer need it; Flowstride does not apply a new age-based deletion policy to local files.

## Cloud connections and installation

Remote connections made by Flowstride's Cloud clients require HTTPS. Loopback HTTP remains available for local development. Your **application** can still use an HTTP `BASE_URL`, including a localhost test app; this transport rule concerns the Flowstride service connection.

Credential-bearing Cloud clients reject redirects. Configure the final HTTPS service URL instead of a redirecting address. Existing Cloud host overrides remain supported; changing the host changes where you send credentials, so use only a service you trust.

Cloud engine installation uses the authenticated private channel. The installer verifies the archive checksum before installation, checks package identity and archive paths, enforces size limits and disables package lifecycle scripts for that installation. Missing or mismatched checks stop the update, preserving the existing engine and launcher/fallback path.

The checksum checks consistency with the authenticated service's response. It is not independent publisher signing or protection against a compromised publisher/service. [OS and Cloud selection](/guide/editions#engine-selection-and-fallback) explains normal installation and fallback.
