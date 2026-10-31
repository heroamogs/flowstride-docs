# Manual capabilities and current boundaries

Use this guide to plan manual testing around the capabilities available in OS and Cloud modes of the local workspace. Cloud includes free accounts; connected services remain subject to workspace limits.

| Area | Current behavior | Practical boundary |
| --- | --- | --- |
| Canvas | Steps, groups, text, connections, zoom, selection, undo/redo and internal clipboard | In-memory editing history is not backup/version control |
| Case details | Descriptions, steps, expected results, references, priority and flow metadata | No dedicated typed field for every test-management concept |
| Execution | Human judgment, connected-path progression, six step states | Not conditional branching or automated application control |
| Storage | Local templates, submitted run JSON and media directories | Save confirmation matters; local files are editable |
| OS save | Server persistence; an additional toolbar export path depends on the hosting bridge | Download wrapper is not the same format as a submitted run |
| Cloud mode history | Saved report review with historical editing/toolbar locks | Not a resumable or cryptographically immutable run |
| Cloud | Authenticated run synchronization where eligible | Not live collaborative canvas editing |
| Assignees | Descriptive values attached to defects | No notification, directory validation or issue creation |
| Evidence | Local reference/defect media; remote defect upload when available | New Cloud attachments require workspace access; historical links need separate review; local references do not travel automatically |
| Reports | Saved step-level report and eligible Cloud review | Automated TestCase PDF is not a promised manual PDF export |
| Automation | A manual case can guide `.flow` authoring | No native one-click converter |

## Edition-specific launch behavior

The OS `open` command launches the local workspace without authentication. Cloud mode checks the account session before opening the local workspace. Open the workspace from your project:

```sh
npx flowstride open
```

Both have local project APIs. Credentials available to a manual server can enable synchronization; this is separate from native CI's `cloudSync` switch. Do not assume that setting the automated CI option disables every manual-server Cloud request.

## Plan around current limits

Execution follows the first outgoing connection, starting with the lowest internal node ID. Use separate linear flows rather than conditional branches or loops. Display numbers do not reorder internal IDs.

The defect chooser advertises a larger video limit than the local upload server accepts. The effective request cap is 40 MiB. Aggregate pending counts include Blocked and Skipped work. Client-provided author/tester labels do not prove identity.

Keep these limits in mind when planning coverage and reviewing saved outcomes.

## Local access and safe sharing

The current manual server binds to loopback by default and validates local request origins/hosts. Imported content and save payloads are validated and rich HTML is sanitized. These controls do not turn the server into a public team-hosting endpoint. Keep it local and share reviewed run files or eligible Cloud records through their documented channels.

For a complete exercise with a real local application, a passing run and a deliberate mismatch, use [the profile-review walkthrough](/manual-workspace/practical-walkthrough).
