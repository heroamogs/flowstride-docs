# Troubleshooting

## Confirm what is running

Check `npx flowstride --version`, the engine banner, the Cloud host printed during authentication, and whether the run says CI or interactive mode. Confirm that you are running from the intended project and using the intended workspace.

## Browser executable is missing

Run `npx flowstride install` after updating Flowstride for Chromium, or `npx flowstride install firefox webkit` for those engines. On Linux add `--with-deps`. Matching the browser to the installed package matters more than installing a separate global Playwright version.

## Firefox/WebKit was installed but the test still uses Chromium

Installation downloads binaries; it does not change the default. Use `npx flowstride run flows --browser firefox` or select WebKit explicitly. Check the terminal's launched browser/version and **Test browser** in the dashboard. An open dashboard tab is separate from the tested application. [Browser selection](/guide/browser-compatibility).

## An explicit locale or offline HAR check differs by browser

Chromium currently has a custom-locale override limitation. Firefox/WebKit can reject navigation when forced browser-offline mode is combined with HAR playback. For HAR acceptance, keep that flag unset, stop the server and use `notFound: "abort"`. [Current compatibility limits](/guide/browser-compatibility#feature-and-platform-boundaries).

## A retry passed but CI failed

Check `failOnFlaky`. With that policy enabled, a recovered scenario fails the overall run even though its final-step metrics pass. Earlier attempts remain in `summary.json`. A retry repeats the scenario; assertion polling only rereads the condition. [Waiting and retries](/guide/waiting-and-retries).

## A network wait or download times out

Arm the event before clicking its trigger. Confirm URL/method/status filters and the active profile. Browser routes do not intercept direct API calls; service workers can bypass route handling unless blocked. A timeout begins when the event is armed. [Network/download reference](/reference/native-browser-commands#network-routes-and-events).

## A downloaded file already exists

Native download saving rejects an existing destination. Use a fresh project-local name, for example `downloads/report-$uuid.json`, and assert the saved event's content. Do not treat a rejected overwrite as a failed download event.

## A component will not mount

Install the project's required React/React DOM or Vue packages, check the project-local module/export path and provide required application providers through a wrapper. Flowstride's harness does not automatically load your app's Vite configuration or backend. [Component guide](/guide/native-browser-workflows#component-tests).

## A run has finished but the command stays open

Interactive mode keeps its dashboard available for debugging. Press Ctrl+C when finished. Use `run --ci` for an automated process that should exit after writing reports.

## A test tab has no screenshot

API-only steps and records without captured browser frames have an explicit empty state. A completed flow should show its own last captured step, not another flow's screen. Select an earlier step to change that file's history cursor. [Dashboard guide](/reporting/dashboard).

## Cloud reporting returns 401 or 403

A 401 means authentication was rejected; it does not establish expiry unless the server supplies an expiry-specific reason. Inspect the Developer Tokens page, revoke/replace invalid credentials, and sign in again. A 403 can indicate permissions or workspace entitlement.

A successful browser/API test can still have failed reporting. Check `.flowstride/cloud-sync.json` and the summary's Cloud status. Local evidence remains available.

## Cloud unexpectedly falls back to OS

Check the token and workspace access, then run `npx flowstride login` after installing project dependencies. Read the engine banner on the next run. See [engine selection and fallback](/guide/editions#engine-selection-and-fallback).

## Attribute assertions pass on one machine and fail on another

Confirm that both machines use the same application, test data and configuration. Attribute checks compare the DOM attribute exactly unless `contains` is specified. An absent attribute is different from an empty attribute. Review the [assertion syntax](/flow-language/flow-commands/flow.expect).

## A saved session does not restore temporary state

New snapshots record the source origin. Old snapshots with session storage but no origin need the application open or an explicit `baseUrl`. Keep the same scheme, host and port. IndexedDB and arbitrary application memory are not part of this snapshot. [Session guide](/flow-language/getting-started/sessions).

## Replay refuses to send a masked request

Replay removes invalid HTTP/2 pseudo-headers and rebuilds transport metadata for the edited body. Check the local request error and target response separately.

Both Replay and cURL Copy use masked templates. Replace required `[REDACTED]` fields with test values before a manual resend; remove optional fields only when the target API permits it. The dashboard and worker reject unresolved placeholders, and entered credentials are re-masked after Send. The original captured credentials are not silently reused. `emailVerified` remains its actual value/type. [Replay privacy](/security/evidence-and-replay#send-a-request-manually-with-replay).

A copied command edited outside Flowstride can contain secrets again; review it before sharing. Historical redacted data cannot recover originals.

## Private state or a Cloud installation is rejected

Use an owned project folder and supported filesystem permissions. Do not replace private files with symbolic links or loosen permissions to bypass an error. A shared drive or ACL failure needs investigation on the actual machine. [Local data protection](/security/local-data#filesystem-protection).

Cloud installs require the authenticated final service URL and a valid archive checksum. A rejected checksum or unsafe archive is not a successful update; keep the existing installation and report the redacted error. Do not disable verification or manually rename an archive to work around it. [Installation checks](/security/local-data#cloud-connections-and-installation).

For manual design, execution, file and evidence problems, use the dedicated [manual troubleshooting guide](/manual-workspace/troubleshooting).
