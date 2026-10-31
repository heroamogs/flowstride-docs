---
description: Understand Flowstride security boundaries, local data, Cloud access, evidence privacy and safe CI usage.
---
# Security and privacy

Flowstride runs browser and API tests on your computer or your CI runner. OS works without an account. Cloud adds authenticated workspace services, including features available to free accounts. Connecting Cloud does not move your tests to a hosted execution machine.

Security depends on what you test, what you capture, who can access your machine and workspace, and how you share the results. This section explains the controls and the decisions you still need to make.

## Where your data goes

| Data | Where it is used or kept | What to review |
| --- | --- | --- |
| Test inputs and application credentials | Your project environment and requests to your application | Use test accounts; exclude real secrets from Git |
| Flowstride login and saved browser sessions | Private local state under `.flowstride`; global login has a separate user-level location | Trust the machine account and protect backups |
| Screens, recordings and diagnostic archives | Local evidence; CI artifacts if your workflow uploads them | Capture only what you need and review before sharing |
| Automated Cloud results | Eligible interactive reporting, or explicitly enabled CI reporting | Workspace access, reporting status and retention |
| Automated Cloud videos | Eligible uploads unless automatic Cloud video is disabled | Upload status and authenticated playback |
| Manual templates, runs and evidence | Local `manual_flows` files; eligible synchronization and explicit attachment upload | A local save does not prove remote delivery; local reference files do not travel automatically |
| Hosted workspace environment secrets | The selected Cloud workspace | Authorized editors, rotation and deployment/migration status |

[Evidence and Replay](/security/evidence-and-replay) explains exactly which formats can contain sensitive content.

## Understand the boundaries

| Boundary | Flowstride provides | Your responsibility |
| --- | --- | --- |
| Local state | Restricted filesystem permissions, guarded paths and atomic private-state replacement | Trusted machine/users, disk protection and backup controls |
| Local dashboard | Loopback binding and local request checks | Keep it local; avoid public proxies, tunnels and shared browser sessions |
| Cloud access | Authentication, workspace authorization and separate browser/machine credentials | Select the right workspace, limit membership and revoke exposed keys |
| Installation | Authenticated Cloud engine delivery, archive checks and failure rollback | Use the intended service and review project dependencies |
| Logs and manual resend | Known-secret masking and masked Replay/cURL templates | Review arbitrary text and enter only the credentials needed for that resend |
| Capture and sharing | Configurable evidence capture and controlled new Cloud media access | Review images/archives, historical links and your artifact platform's permissions |

These controls do not make untrusted `.flow` files, plugins or project dependencies safe to execute. Run reviewed code on a machine or CI runner appropriate for that project.

## Start with a safe setup

1. Use synthetic customer records and disposable test accounts.
2. Keep `.env`, credentials, persisted sessions and generated evidence out of Git. Commit a placeholder `.env.example` instead.
3. Run the default local dashboard without exposing its port. Headed application windows are optional.
4. Choose [evidence capture settings](/security/evidence-and-replay#reduce-capture) before testing sensitive screens.
5. Connect only the Cloud workspace and CI secrets you need. Verify the intended recipient can access a report before sharing it.
6. Review exports and set retention in each place you keep them: local disk, CI and Cloud.

## What these controls do not establish

Restricted local files are not encrypted by Flowstride. Redacted logs do not guarantee sanitized pixels, HAR files, traces or arbitrary application text. Private new uploads do not prove all historical attachments have been migrated. Removing a local file does not erase copies in backups or CI artifacts.

This documentation describes product behavior, not a security certification, an independent penetration-test report or a guarantee that a particular deployment meets your organization's requirements. For regulated data, review the actual deployment, access controls, contracts and retention with your security team before using it.

## Continue

- [Local data and installation](/security/local-data): credentials, saved state, permissions and transport.
- [Evidence and Replay](/security/evidence-and-replay): capture controls, masked cURL and manual resends.
- [Cloud access and storage](/security/cloud-and-access): tokens, sessions, workspaces, attachments and retention.
- [CI and safe sharing](/security/ci-and-sharing): trusted jobs, artifacts and practical review.
- [Report a vulnerability](/security/reporting-vulnerabilities): share sensitive findings privately.
