# Start with a workflow

Flowstride (FS) lets you write browser and API tests in readable `.flow` files, inspect a run in a local dashboard, and run the same suite in CI. The Manual Workspace helps you design and carry out tests that still need a person.

Choose a starting point:

| I want to…                               | Start here                                        |
| ---------------------------------------- | ------------------------------------------------- |
| Run a browser and API test               | [First automated flow](/guide/your-first-script)  |
| Design a test without writing automation | [First manual flow](/manual-workspace/first-flow) |
| Run existing tests on GitHub             | [Native CI](/guide/native-ci-games)               |
| Search a table or act on a specific cell | [Table and cell testing](/guide/table-testing) |
| Verify speech-to-text in an application | [Audio-to-text testing](/guide/audio-to-text) |
| Test a browser game                      | [Game testing](/games/getting-started)            |
| Write a loop, calculate discounts or check every item in a UI | [Complex tests with JS and TS](/guide/complex-tests) |
| Make a test wait for an account created by another test | [Fixtures and handoffs](/flow-language/getting-started/fixtures-and-handoffs) |
| Connect a Cloud account                  | [Flowstride and Flowstride Pro](/guide/editions)                   |
| Combine API setup with browser login | [API and UI in one flow](/guide/api-and-ui) |
| Use separate users, mocks or downloads | [Native browser workflows](/guide/native-browser-workflows) |

## Install the public engine

Use **Node.js 22.12 or newer** and an npm project. In a new folder:

```sh
npm init -y
npm install --save-dev flowstride
npx flowstride init
npx flowstride run
```

`init` scaffolds the starter and advanced examples and checks for matching Chromium binaries. Plain `npx flowstride run` starts the bundled application on localhost and opens the live dashboard. The starter browses the catalog and signs in with a seeded account.

In an existing Flowstride project, use `npx flowstride init --practice` and run from `.flowstride/practice`. The practice app supplies its own URL and runs offline once the package and browser are installed. [Practice and advanced examples](/guide/working-examples#bundled-practice-app)

Set `BASE_URL` in the project-root `.env` for tests against your own application. With your own application running, pass its flow path to the CLI. [Your first automated flow](/guide/your-first-script)

## Connect a Cloud account

FS runs locally without an account. Cloud includes free accounts and additional features within your workspace limits. Create a Cloud account and developer token, then run:

```sh
npx flowstride login
npx flowstride status
```

Authenticate with a developer token and accept the Flowstride Pro engine installation when offered. See [Flowstride and Flowstride Pro](/guide/editions) for engine selection and fallback.

## Run, inspect, repeat

```sh
npx flowstride run
npx flowstride run --ci
npx flowstride open
```

The first command opens the interactive automation dashboard. The second runs without a dashboard and writes CI reports. The third opens the separate Manual Workspace. Follow the localhost URL printed in the terminal; ports are allocated dynamically.

You can use FS without a Cloud account, or connect a free Cloud account. Cloud features and usage limits depend on the workspace plan; the Flowstride Pro engine is installed through an authenticated private channel. [Learn how selection and fallback work](/guide/editions).
