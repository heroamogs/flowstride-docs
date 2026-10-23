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

Captured body fields belong to the application. For example, `authMode: "cookie"` in an original login payload is not a field Flowstride adds to your API.

## Copy raw cURL

The displayed cURL stays `[REDACTED]`. The explicit copy action uses original headers and body held separately in **local interactive memory**. Treat the copied command as a secret if it includes passwords, cookies or bearer tokens.

CI and Cloud reports keep redaction. Already-redacted historical data cannot be reversed. Screenshots and videos may still contain visible application secrets.

## Reports and TestCase

Reports groups execution results by file and scenario. TestCase presents automated steps and provides the **Export PDF** action. These views concern the automated run; do not assume they generate a formal PDF from a manual canvas.

The local runner binds to loopback and restricts dashboard origins. Keep it local; do not proxy it onto a public URL to share raw debugging data. For retained results, use [CI artifacts](/reporting/artifacts) and [Cloud evidence](/guide/cloud-evidence).
