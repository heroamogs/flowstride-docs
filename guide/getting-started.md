# Start with a workflow

Flowstride lets you write browser and API tests in readable `.flow` files, inspect a run in a local dashboard, and run the same suite in CI. The Manual Workspace helps you design and carry out tests that still need a person.

Choose a starting point:

| I want to…                               | Start here                                        |
| ---------------------------------------- | ------------------------------------------------- |
| Run a browser and API test               | [First automated flow](/guide/your-first-script)  |
| Design a test without writing automation | [First manual flow](/manual-workspace/first-flow) |
| Run existing tests on GitHub             | [Native CI](/guide/native-ci-games)               |
| Test a browser game                      | [Game testing](/games/getting-started)            |
| Connect a Cloud account                  | [OS and Cloud](/guide/editions)                   |
| Combine API setup with browser login | [API and UI in one flow](/guide/api-and-ui) |
| Use separate users, mocks or downloads | [Native browser workflows](/guide/native-browser-workflows) |

## Install the public engine

Use **Node.js 22.12 or newer** and an npm project. In a new folder:

```sh
npm init -y
npm i flowstride
npx flowstride init
```

`init` creates `flows`, `manual_flows`, `plugins`, `fixtures`, and `reports`, plus a sample flow. It also attempts to install Chromium. `install` explicitly installs matching Chromium; pass `firefox` or `webkit` to install those engines. Use `run --browser` to select one. [Browser setup](/guide/browser-compatibility).

For relative browser and API URLs, set `BASE_URL` in a project-root `.env` file. A JSON configuration file is optional. [Configuration and environments](/guide/configuration#set-the-base-url-in-env) explains both options.

Replace the generated example with a flow for your own application. [Your first automated flow](/guide/your-first-script) walks through configuration, test credentials, and the first run. The generated sample points at a hosted application whose accounts and behavior may change.

## Connect a Cloud account

OS runs locally without an account. Cloud includes free accounts and additional features within your workspace limits. Create a Cloud account and developer token, then run:

```sh
npx flowstride login
npx flowstride status
```

Authenticate with a developer token and accept the Cloud engine installation when offered. See [OS and Cloud](/guide/editions) for engine selection and fallback.

## Run, inspect, repeat

```sh
npx flowstride run flows
npx flowstride run flows --ci
npx flowstride open
```

The first command opens the interactive automation dashboard. The second runs without a dashboard and writes CI reports. The third opens the separate Manual Workspace. Follow the localhost URL printed in the terminal; ports are allocated dynamically.

You can use OS without a Cloud account, or connect a free Cloud account. Cloud features and usage limits depend on the workspace plan; the Cloud engine is installed through an authenticated private channel. [Learn how selection and fallback work](/guide/editions).
