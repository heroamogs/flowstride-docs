# The interactive dashboard

Run `flowstride run` without CI mode and follow the localhost URL printed in the terminal. The dashboard is a local debugging workspace for the active run.

## Per-test screens and history

The test tabs identify discovered `.flow` files. A completed test opens at its own last captured step. Selecting an earlier step preserves a separate history cursor for that file. Selecting a sidebar step also selects its owning file.

**Return to Live** applies to the selected file. A rerun clears previous cursors and screens. A step with no screenshot shows an empty state rather than borrowing another file's view. Console/network panels follow the selected file; the full Logs view retains suite-wide records.

## Profiles and retry attempts

History records the selected browser profile as well as the test file. Customer/admin profiles can have different screens at the same step description. Use **History attempt** to inspect a failed attempt and its later success; selecting the successful attempt does not remove the earlier evidence. Optional **Read DOM snapshot** opens inert diagnostic text.

The **Test browser** label identifies the engine that tested the application. The dashboard window is a separate debugging surface. [Browser compatibility](/guide/browser-compatibility) explains headed application windows and browser selection.

## Logs and Replay

Select a network entry to inspect headers, payload, response and step context. Replay lets you edit a captured request and send it again through the local runner. It can change application data, so choose a suitable test environment.

The current implementation filters HTTP/2 pseudo-headers such as `:authority` and recalculates transport headers for an edited body. A malformed request shows a request error; an application error response is a separate result.

Replay preserves non-sensitive application fields for editing; it does not add authentication modes or other business fields. Captured emails, passwords, tokens and cookies are masked. Verification flags such as `emailVerified` keep their actual value and type.

Replace required `[REDACTED]` placeholders with test credentials before **Send**. Both the dashboard and worker reject unresolved placeholders. Credentials entered for that resend are re-masked afterward; the original captured credentials are not silently reused. This does not change how automated `.flow` requests use their configured credentials.

## Copy cURL

The displayed command and **Copy** both use a masked request template. Copy does not reveal the original credentials. The command omits invalid HTTP/2 pseudo-headers and transport-only metadata, and shell-quotes the remaining values.

If you add real credentials to a copied command outside Flowstride, treat that edited command as sensitive. Historical redaction cannot be reversed. [Evidence and Replay privacy](/security/evidence-and-replay) explains manual resends, exported diagnostics and capture limits. Screenshots, videos, traces and HAR files can still contain application secrets.

## Reports and TestCase

Reports groups execution results by file and scenario. TestCase presents automated steps and provides the **Export PDF** action. These views concern the automated run; do not assume they generate a formal PDF from a manual canvas.

The local runner binds to loopback and restricts dashboard origins. Keep it local; do not proxy it onto a public URL to share raw debugging data. For retained results, use [CI artifacts](/reporting/artifacts) and [Cloud evidence](/guide/cloud-evidence).

## A worked debugging journey

1. Select the failing file, then expand its scenario/step. The selected file owns the screen history and its console/network panel.
2. Read the exact failed command and its file/line. For a native assertion, inspect which target checks passed and which condition failed.
3. Open **Logs**. **ALL** shows the available suite records; **REST**, **ACTION**, **ASSERT** and **ERROR** narrow by record type. Groups identify the source flow. Browser traffic and direct API calls can both appear; use their method/type/context to distinguish them.
4. Select the relevant request and inspect the detail tabs below. A nearby request is context, not automatically proof that it belongs to the exact failing action.
5. Use **Watch** on the flow group to review its retained video where available. Drag the detail-pane divider when a payload or call log needs more room.
6. Use Replay only when repeating that request is appropriate for the test environment, then assert the application result in the flow rather than relying on a manual replay as permanent coverage.

| Detail tab | What to read |
| --- | --- |
| Overview | URL/method/status, timing and available step context |
| Headers | Captured request and response headers |
| Payload | Captured request body/details |
| cURL | Masked request template in both the display and Copy; no automatic credential recovery |
| Response | Captured response body |
| Step Context | Description identifying the relevant execution context |
| Replay | Editable request and separate live response/request error |

Interactive history is available while the local process is alive. Retained CI/Cloud artifacts are separate records; local debugger-only request templates are excluded from portable reports and Cloud automation logs. Do not expect captured credentials to be recoverable later.

## Read report status and export PDF

Reports, TestCase and exported automated PDFs distinguish passed, failed, skipped, not tested and incomplete work. Generated expected/actual prose helps review; it is not independent proof. Reports can show the latest available API record for a file, so confirm the request and timestamp before treating it as evidence for a selected step.

TestCase PDF export uses **Chromium**, even when Firefox or WebKit tested the application. Install matching Chromium with `npx flowstride install chromium` if needed. The local server writes `Flowstride_Test_Log_<timestamp>.pdf` under `.flowstride/artifacts` and sends the browser download. Confirm the success message/file when diagnosing export problems. Native CI JSON/JUnit and manual run reports have their own lifecycles.

## Current visual controls

Use the documented working controls above. The flow-search box, Network text filter, browser navigation/device/camera icons and WS-labelled view do not establish a working interactive browser-control or WebSocket-frame inspection feature. Assertions/Session/TestData mock panels are not a supported live inspection workflow. Use the real history, logs, profile commands and evidence records for diagnosis.
