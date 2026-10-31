---
description: Report a suspected Flowstride security vulnerability without publishing credentials or sensitive reproduction details.
---
# Report a vulnerability

Please keep suspected security vulnerabilities private while they are assessed. Public documentation should explain safe usage and security boundaries; it should not expose a user's credentials, private data or an unpatched exploit.

## Find a private reporting route

For the [public OS repository](https://github.com/heroamogs/flowstride-os), check **Security → Report a vulnerability**. Use that route **if the repository offers it**. Availability is controlled by the repository; this documentation does not claim private reporting is enabled for every Flowstride repository.

If no private route or security contact is listed, ask the maintainer for a private channel without posting the vulnerability details. Do not use a public issue for an exploit, token, customer data or an attached private engine archive. [GitHub's private-reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately) explains this distinction.

## Prepare a useful report

Include:

- The affected component, installed public package version, operating system and browser where relevant.
- Expected and observed behavior, including who would need access for the issue to occur.
- Minimal reproduction steps using a disposable local project and synthetic data.
- The likely impact and a redacted error/log extract if needed.
- Whether you suspect real credentials or data were exposed, without including their values.

Distinguish an execution failure, an application defect and a possible Flowstride security boundary failure. You do not need to prove an issue against another person's workspace or data to report it.

Review all attachments first. Screens, saved sessions, traces and HAR files can contain secrets even when terminal output is redacted. If a token was exposed, revoke or rotate it promptly rather than waiting for a software fix.
