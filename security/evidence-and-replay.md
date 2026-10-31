---
description: Configure evidence capture and understand redaction, masked cURL copy and one-off manual API Replay in OS and Cloud.
---
# Evidence and Replay privacy

Evidence can contain the same data as the application you test. A passing test and a redacted terminal log do not establish that a screenshot or diagnostic archive is safe to share. The following behavior applies to OS and Cloud engines.

## What masking covers

| Surface | Protection and limits |
| --- | --- |
| Terminal and structured diagnostics | Known credential fields and known secret values are masked; arbitrary application prose still needs review |
| Request/response inspection | Sensitive fields are masked; verification flags such as `emailVerified` retain their real value and type |
| Replay templates and copied cURL | Captured emails, passwords, tokens and cookies are masked; originals are not silently reinserted |
| Portable JSON and Cloud automated logs | Local debugger-only request captures and inline evidence are excluded; normal structured diagnostics remain |
| JUnit | Failure diagnostics are redacted; separate evidence files still require review |
| Screenshots, videos and PDF exports | Visible application data can remain; no guarantee of pixel sanitization |
| HAR and browser traces | Raw diagnostic archives that can contain headers, cookies, bodies and page snapshots |
| DOM/ARIA snapshots and accessibility reports | Can contain page text and identifiers; captured DOM is presented as inert text in the debugger |
| Downloads and explicit attachments | Application/project files; inspect their contents before distributing them |

A field such as `emailVerified: false` describes verification status; it is not an email credential and must remain a boolean. Masking diagnostic output does not change the actual values used internally by automated API requests and assertions.

## Copy cURL

The dashboard's cURL view and **Copy** produce a masked request template. Copy is not an action to reveal original credentials. For example, a captured JSON login body is represented as:

```json
{
  "email": "[REDACTED]",
  "password": "[REDACTED]",
  "authMode": "cookie"
}
```

`authMode` is an example application field, not a field Flowstride adds to requests. Flowstride preserves the application's non-sensitive payload fields.

The generated command shell-quotes request values and omits HTTP/2 pseudo-headers and transport-only metadata. The HTTP client handles values such as body length for the edited request. This is a usable request template, not a byte-for-byte reproduction of a browser connection.

If you edit that command outside Flowstride to add real credentials, it becomes sensitive again. Your shell, terminal history, editor or destination tool may retain it. Flowstride does not control external cURL commands or prevent you running a masked placeholder in a separate terminal.

## Send a request manually with Replay

1. Select the intended request in **Logs**, then open **Replay**.
2. Review the method, URL, headers and body. Repeating a request can create or change application data.
3. Replace every required `[REDACTED]` placeholder with an appropriate test value, or remove an optional field/header if the target API permits it.
4. Click **Send**. Both the dashboard and worker reject unresolved placeholders before issuing a request.
5. Read the live response separately from a local request error. A target HTTP error is different from an invalid request that was never sent.

Entered credentials are one-off input and are re-masked after Send. Response/error diagnostics also mask the supplied credential values. They are not retained as an automatic credential store for later resends.

Use the authentication mechanism the application expects. A login endpoint that requires email/password cannot generally be replayed by substituting a token; a protected resource may instead accept a bearer token or session cookie. Flowstride does not invent or convert between these application contracts.

Older redacted records cannot recover credentials. Raw capture fields in an imported historical log are not a supported way to reveal them. [Dashboard guide](/reporting/dashboard#logs-and-replay).

## Reduce capture

For a sensitive test environment, this `flowstride.config.json` disables automatic recordings and diagnostic capture in both engines:

```json
{
  "recordVideo": false,
  "trace": false,
  "har": false,
  "domSnapshots": false,
  "security": {
    "evidence": {
      "screenshots": false,
      "cloudVideo": false
    }
  }
}
```

| Setting | Effect |
| --- | --- |
| `recordVideo: false` | Do not record automatic browser video |
| `trace: false`, `har: false`, `domSnapshots: false` | Do not enable those automatic diagnostic captures |
| `security.evidence.screenshots: false` | Disable automatic step screenshots **and live dashboard frames** |
| `security.evidence.cloudVideo: false` | Block automatic Cloud video upload while eligible metrics reporting can continue |

Omitting these settings retains the normal defaults. With screenshots disabled, the dashboard cannot show frames that were not captured. Explicit trace commands, game visual assertions/checkpoints, downloads and attachments still request their own evidence. Disabling automatic video upload does not block a manual attachment you explicitly upload.

CI Cloud reporting remains opt-in with `cloudSync: true`. That CI switch is not a universal offline control for interactive/manual workspace operations. [Cloud evidence](/guide/cloud-evidence) explains those separate delivery paths.

## Before sharing evidence

Review screenshots and videos visually. Inspect HAR/trace archives and downloaded files locally. Redact unnecessary personal/business data from manual documents and defect descriptions. Use synthetic data for reusable examples and keep only the evidence needed to diagnose the issue.

Local evidence permissions restrict filesystem access; they do not encrypt files or govern a copy uploaded to CI or another tool. Set access and retention at every destination. [CI and safe sharing](/security/ci-and-sharing).
