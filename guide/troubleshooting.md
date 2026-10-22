# Troubleshooting

## Confirm what is running

Check `npx flowstride --version`, the engine banner, the Cloud host printed during authentication, and whether the run says CI or interactive mode. Confirm that you are running from the intended project and using the intended workspace.

## Browser executable is missing

Run `npx flowstride install` after updating Flowstride. On Linux use `install --with-deps`. Matching the browser to the installed package matters more than installing a separate global Playwright version.

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

## Replay fails or copied cURL contains secrets

Replay removes invalid HTTP/2 pseudo-headers and rebuilds transport metadata for the edited body. Check the local request error and target response separately.

The local Copy raw cURL action deliberately includes original request credentials. Do not paste that command into an issue or public log. Historical redacted records cannot recover the original data.

For manual design, execution, file and evidence problems, use the dedicated [manual troubleshooting guide](/manual-workspace/troubleshooting).
