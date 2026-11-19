# Run the included workflow examples

Learn Flowstride (FS) 2.0 against a small local application before adapting the commands to your own project. Install through npm; the examples come with the package.

## Bundled practice app

After `npx flowstride init` in a fresh project, run the starter with `npx flowstride run`. FS starts the bundled app on a free localhost port and opens the live dashboard. It runs the catalog and seeded sign-in flows under `flows/examples/starter`. In an existing Flowstride project, run `npx flowstride init --practice` and change into `.flowstride/practice` first.

Run all advanced examples with this command.

```sh
npx flowstride run flows/examples/advanced
```

| File | What it covers |
| --- | --- |
| `check-catalog-prices.flow` | Use a TS helper to check all 50 displayed cars against the API, including discounts and four delivery options |
| `admin-creates-user.flow` | Create an account, grant Booking approver, and retry after the practice app deliberately rejects the first role save |
| `new-user-signs-in.flow` | Wait for the admin flow, sign in as the new user, and verify the account ID and role |

Run `npx flowstride run flows/examples/advanced/new-user-signs-in.flow` to see just the handoff. Flowstride includes the admin flow automatically. The user row shows **Waiting for admin-creates-user.flow** and starts after the admin passes. Cleanup removes the temporary account after the user test. [Fixtures and handoffs](/flow-language/getting-started/fixtures-and-handoffs)

Add `--ci` for a headless run with saved results. Close the dashboard or press Ctrl+C to stop an interactive practice session.

### Read the helpers or combine API and UI

Open `helpers/practice/catalog.ts` alongside `check-catalog-prices.flow` to trace one API response through two helper calls. To write your own version, follow [Test a 50-car catalog with JavaScript and TypeScript](/guide/complex-tests).

For a single scenario that creates and approves the account through the API, then signs in through the UI, run:

```sh
npx flowstride run flows/examples/api-and-ui/approve-user-and-sign-in.flow
```

The browser verifies the same user ID returned by the API and the permission **Can approve bookings**. This bundled example runs entirely on localhost without email setup.

## Install and copy the workflow examples

Use Node.js 22.12 or newer. In a new folder:

```sh
npm init -y
npm i flowstride
npx flowstride init
npx flowstride install chromium
cp -R node_modules/flowstride/examples/native-workflows workflow-examples
```

On PowerShell, replace the last command with:

```powershell
Copy-Item -Recurse node_modules/flowstride/examples/native-workflows workflow-examples
```

Use a new destination and keep your existing configuration. Create a project-root `.env`:

```dotenv
BASE_URL=http://127.0.0.1:4107
EXAMPLE_LABEL="Workflow fixture"
```

Start the shared application in another terminal and leave it running:

```sh
node workflow-examples/shared/server.mjs
```

It stores disposable demo data in memory and listens on loopback. Restarting the server clears those users and changes. Keep the same process running for session-save/session-restore checks.

## Choose a chapter

All paths below are relative to `workflow-examples/`. Each chapter's included `README.md` explains setup, expected outcomes and limitations.

| Chapter | Passing target | Intentional failure |
| --- | --- | --- |
| API + UI | `api-and-ui/flows/api-and-ui.flow` | `api-and-ui/negative/wrong-backend-state.flow` |
| Readable iframe | `iframes/flows/readable-frame.flow` | `iframes/negative/wrong-frame-result.flow` |
| Exact iframe action through a plugin | `iframes/flows/explicit-frame-plugin.flow` | Same wrong-result check |
| Table search and reuse | `tables-and-cells/flows/search-extract-reuse.flow` | `tables-and-cells/negative/wrong-cell-value.flow` |
| Table coordinates | `tables-and-cells/flows/coordinates.flow` | Same wrong-cell-value check |
| Variables across sequential files | `variables-and-reuse/flows` | `variables-and-reuse/negative/wrong-reused-value.flow` |
| Saved sessions | `variables-and-reuse/sessions/save.flow`, then `sessions/restore.flow` | Restore without preparing the saved account |
| Microphone and transcript assertions | `audio-to-text/flows/microphone-demo.flow` | `audio-to-text/negative/wrong-transcript.flow` |
| Manual design | `manual-testing/fixtures/profile-review.json` | Review `profile-review-mismatch.json` against the application |

Run an exact file so unrelated starter flows and deliberate failures are not included:

```sh
npx flowstride run workflow-examples/api-and-ui/flows/api-and-ui.flow
npx flowstride run workflow-examples/api-and-ui/flows/api-and-ui.flow --ci
npx flowstride run workflow-examples/api-and-ui/negative/wrong-backend-state.flow --ci
```

The first two should pass. The last should fail, exit nonzero and retain the failed step's diagnostic evidence. Read the step-level error in `flowstride-artifacts/summary.json`, not just aggregate counts.

Use `--workers 1` for the cross-file variable example: its explicit global extraction belongs to one process. Run the session-saving file before the restore file, in separate CLI invocations.

## Flowstride, Flowstride Pro and browsers {#os-cloud-and-browsers}

FS requires no login. To use Cloud, run `npx flowstride login`, accept the authenticated engine installation and use the same commands. Shared local examples do not need a paid account.

API/UI, table, iframe and variable examples work with the supported browser engines. Install and choose one explicitly:

```sh
npx flowstride install chromium firefox webkit
npx flowstride run workflow-examples/api-and-ui/flows/api-and-ui.flow --browser firefox --ci
npx flowstride run workflow-examples/api-and-ui/flows/api-and-ui.flow --browser webkit --ci
```

Microphone file injection requires Chromium. The demo simulates transcript display to verify the recording and assertion lifecycle; it does not perform speech recognition or deliver email. The `api-ui-otp/templates` and `audio-to-text/templates` chapters explain real service requirements.

## Let CI start the application

Stop the manually started server, then configure:

```json
{
  "testDir": "workflow-examples/api-and-ui/flows",
  "timeout": 10000,
  "cloudSync": false,
  "webServer": {
    "command": "node workflow-examples/shared/server.mjs",
    "url": "http://127.0.0.1:4107",
    "timeout": 10000
  }
}
```

Keep `BASE_URL` configured. Flowstride owns this server's startup, readiness check and shutdown. Keep `negative/` and unconfigured service templates outside the passing CI target. [Generate the GitHub workflow](/guide/native-ci-games) once the named example passes locally.

For a separate seven-check canvas example, see [the packaged game walkthrough](/games/getting-started#run-the-included-canvas-game).
