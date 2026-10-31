---
description: Use Flowstride safely in CI, protect secrets and artifacts, and review exports before sharing.
---
# CI and safe sharing

Use the same reviewed `.flow` suite in local runs and CI. Security also depends on the workflow, runner account, dependencies and artifact platform around Flowstride.

## Trust the code before providing secrets

Tests, plugins, dependency installation and configured server commands run with the runner's privileges. Plugins are project code, not a sandbox. Do not provide Cloud tokens or application credentials to untrusted pull-request code.

Use a separate trusted workflow/environment for jobs needing secrets. Public OS execution does not need a Cloud account. Do not change a pull-request workflow to run unreviewed code with elevated credentials just to make authentication available.

## Review the generated workflow

`npx flowstride ci init github` creates a small workflow for you to review. It uses read-only repository permissions, pinned action commit hashes, locked npm installation, matching browser dependencies and an always-run artifact upload. The hashes identify action source revisions; they are not secret keys.

Commit the lockfile. Review workflow and dependency changes as code. Pinning a revision makes it stable, but does not remove the need to review updates or audit dependencies. [Native CI](/guide/native-ci-games) explains setup, browser matrices and the optional npm safeguard against automatic package installation.

For Cloud jobs, install project dependencies first, connect using the CI secret, then install matching browsers and run the suite. Avoid printing tokens or placing them in YAML or command-line arguments. Prefer the masked login or the supported environment credential source.

## Choose what leaves the runner

CI reports to Cloud only when `cloudSync: true` and suitable credentials are supplied. The CI artifact-upload step is a **separate** destination: it can upload your output even when Cloud reporting is disabled.

Review the paths collected by that step. Never upload `.env`, `.flowstride/credentials.json`, persisted sessions or an entire working directory merely to collect reports. Custom artifact locations need their own Git exclusions and upload review.

The generated GitHub workflow requests **14 days** of artifact retention. Set retention and artifact access for your repository and organization; other CI services use their own rules. Flowstride does not erase evidence already downloaded by a reviewer.

## Review content, not just filenames

| Before sharing | Check |
| --- | --- |
| JSON/JUnit and terminal extracts | Failure text, URLs, application identifiers and arbitrary values that may not match a sensitive-field rule |
| Screenshots, videos and PDFs | Visible records, credentials, personal information and unrelated windows |
| HAR and traces | Request/response bodies, cookies, headers and page snapshots |
| Manual templates and runs | Private prose, defect descriptions, local paths and embedded links |
| Test project ZIP | Credentials, `.env`, saved sessions, caches and generated evidence accidentally included |
| Cloud report or attachment | Intended workspace and the recipient's access; older links may have different access rules |

Use [capture controls](/security/evidence-and-replay#reduce-capture) before running a sensitive suite. Review and minimize the data before sending a report to another person or service, including an AI tool.

## If a credential was exposed

Revoke or rotate it at the system that issued it, replace the value in each legitimate consumer, and remove unnecessary copies according to that system's incident process. Deleting a log message does not invalidate the credential. Dashboard logout, developer-token revocation and application-session revocation are separate actions.

For a suspected Flowstride vulnerability, use [private reporting guidance](/security/reporting-vulnerabilities) and keep the reproduction free of production secrets.
