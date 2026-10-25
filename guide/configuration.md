# Configuration and environments

Flowstride supports a project `.env` file and an optional `flowstride.config.json` file. Both OS and Cloud load `.env` when you run a flow.

## Set the base URL in .env

Create `.env` in the project root:

```dotenv
BASE_URL=http://127.0.0.1:3000
```

This is enough to set the base URL; no JSON configuration file is required. Relative browser and API URLs use it. For example, `flow.open "/login";` opens `http://127.0.0.1:3000/login`, and `flow.get "/api/health";` requests `http://127.0.0.1:3000/api/health`.

Use a local or hosted test URL for your application. `BASE_URL` takes precedence over `baseUrl` in a configuration file. Other environment variable names, such as `API_URL`, are available through explicit references like `flow.get "{{env.API_URL}}/health";`; they do not automatically replace the base URL.

## Optional configuration file

Create `flowstride.config.json` in the project root when you want to customize execution settings or store the base URL there instead. JSON must be an object, without comments.

```json
{
  "testDir": "flows",
  "baseUrl": "http://127.0.0.1:3000",
  "timeout": 30000,
  "headless": true,
  "device": "desktop",
  "artifactsDir": "flowstride-artifacts",
  "recordVideo": true,
  "browserErrors": "fail",
  "cloudSync": false
}
```

## Core fields

| Field | Default | Meaning |
| --- | --- | --- |
| `testDir` | `flows` | Folder discovered when no target is supplied |
| `baseUrl` | No configured value | Base for relative browser/API URLs; use an explicit HTTP(S) URL |
| `timeout` | `30000` | Positive integer timeout in milliseconds |
| `headless` | `true` | Browser visibility; CI forces `true` |
| `device` | `desktop` | Desktop, phone or landscape emulation; [browser limits apply](/guide/browser-compatibility) |
| `browser` | `chromium` | `chromium`, `firefox` or `webkit`; CLI `--browser` takes precedence |
| `browserOptions` | Empty object | Validated context settings for the default profile |
| `viewport` | Profile viewport | Object with positive integer `width` and `height` |
| `pluginsDir` | `plugins` at runtime | Folder containing project TypeScript plugins |
| `artifactsDir` | `flowstride-artifacts` | Project-local native CI output directory |
| `recordVideo` | `true` | Record browser video |
| `browserErrors` | `fail` | `fail` fails on uncaught page errors; `record` records them |
| `bail` | `false` | Stop later work after failure |
| `defaultDialogBehavior` | `dismiss` | Unhandled dialog behavior: `accept` or `dismiss` |
| `cloudSync` | Disabled by default in CI | Explicitly allow authenticated CI reporting |
| `trace` | Disabled | Automatically retain browser trace ZIPs |
| `har` | Disabled | Record HTTP traffic to HAR before browser context creation |
| `domSnapshots` | Disabled | Capture diagnostic HTML for dashboard history |
| `retries` | `0` | Whole-scenario retries; integer from 0 through 10 |
| `failOnFlaky` | `false` | Fail CI if a scenario passed only after retrying |
| `shard` | Unset | CI file assignment such as `1/3`; CLI `--shard` takes precedence |
| `shardHistory` | Unset | Project-local timing map from a complete merge |

Paths, including symlink targets, must stay inside the project. The artifact directory cannot be the project root. Do not put tokens or application passwords in this file.

## Native browser settings and evidence

`browser` selects `chromium` (default), `firefox` or `webkit`. `browserOptions` validates context settings. Optional `trace`, `har` and `domSnapshots` capture local evidence. `retries` defaults to zero; `failOnFlaky` fails a run that needed a retry. See [native browser workflows](/guide/native-browser-workflows) for examples and [supported browser settings](/reference/native-browser-commands#browser-settings) for exact keys. Baseline writing is a deliberate local CLI action, not a persistent configuration switch.

## Start a local application for CI

```json
{
  "baseUrl": "http://127.0.0.1:3000",
  "webServer": {
    "command": "npm run dev",
    "url": "http://127.0.0.1:3000",
    "cwd": ".",
    "timeout": 60000
  }
}
```

`webServer` is a native CI lifecycle feature. Its readiness URL must be loopback HTTP(S), and its working directory must be inside the project. Flowstride refuses an already-serving readiness URL and stops the server it started. For interactive runs, start the application yourself.

For a hosted application, set `BASE_URL` in `.env` or `baseUrl` in the configuration file, and omit `webServer`.

## Environment profiles

Use `.env` for local defaults and `.env.staging` for a named profile:

```dotenv
BASE_URL=https://staging.example.test
TEST_EMAIL=tester@example.test
TEST_PASSWORD=replace-with-a-test-secret
```

```sh
npx flowstride run flows --ci --env staging
```

Existing shell/CI variables take precedence over profile values; profile values take precedence over `.env` defaults. `BASE_URL` overrides configured `baseUrl`. Refer to other variables as `{{env.TEST_EMAIL}}` in flows. Missing referenced values fail clearly.

Cloud host selection uses `FLOWSTRIDE_API_URL`, then legacy `NEXTJS_WEBHOOK_URL`. These select the API host; they do not enable a managed runner.

Keep secrets and execution evidence out of Git. For example, add these project `.gitignore` entries, with an explicit exception for shared placeholders:

```text
node_modules/
.env
.env.*
!.env.example
.flowstride/
flowstride-artifacts/
```

Share placeholder values in `.env.example`; supply the real values locally or through CI secrets.

## Command payloads versus configuration strings

Environment values inside native `.flow` command objects/arrays are resolved at execution time; their property names are not templated. The JSON configuration loader does not perform the same recursive substitution through arbitrary fields. For example, use a [native profile command](/guide/browser-environments#profile-settings-and-environment-values) for environment-valued HTTP credentials rather than assuming `{{env.HTTP_PASSWORD}}` in every configured browser option is expanded.
