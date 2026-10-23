# OS and Cloud

Flowstride has two options: **OS** and **Cloud**. OS runs locally without an account. Cloud includes free accounts, so you can connect a workspace and use its available features without a paid subscription. Feature availability and usage limits depend on your workspace plan.

Both options run tests on your computer or your CI runner. Cloud adds account-connected features, workspace services, and eligible result review.

## Choose the capability you need

| Capability | OS | Cloud |
| --- | --- | --- |
| Browser and API flows | Included | Included |
| Interactive local dashboard | Included | Included |
| Native CI and browser-game APIs | Included | Included |
| Chromium, Firefox and WebKit | Included | Included |
| Profiles, mocks, downloads and retrying assertions | Included | Included |
| Trace/HAR, accessibility and component workflows | Included | Included |
| Scenario retries and CI file sharding | Included | Included |
| Manual canvas, execution and local run files | Included | Included |
| Parallel execution | Sequential engine | Available within workspace and machine limits |
| FlowMail OTP retrieval | Not available | Available within workspace quotas and service availability |
| Account | Not required for local execution | Free accounts available |
| Cloud reports and evidence | Authenticated integration where eligible | Workspace, plan, and service permissions apply |

Use your workspace's current feature access and limits to confirm what is available. Free accounts include features within their workspace limits; additional features and higher limits depend on the plan.

## Start with OS

```sh
npm i flowstride
npx flowstride init
npx flowstride run flows
```

OS does not require a Cloud account for local execution. It includes the local dashboard, manual testing, native CI and browser-game APIs.

## Connect Cloud

Create a free [Flowstride Cloud account](https://cloud.flowstride.io), select your workspace, and create a developer token. After installing your project dependencies, authenticate:

```sh
npx flowstride login
npx flowstride status
```

Paste the developer token into the masked prompt and accept the Cloud engine installation when offered. Installation uses an authenticated private channel; no separate public package installation is required. Free accounts can use this connection flow too. See [Cloud authentication](/cloud/authentication).

## Engine selection and fallback

The launcher selects the Cloud engine when a compatible installation and valid account authorization are available. If the Cloud engine is missing, incompatible or cannot be authorized, it explains the selection and can fall back to OS.

Read the engine banner at the start of a run. The native browser workflows use the same syntax in both engines. An older Cloud installation that cannot run a requested native workflow triggers an explained OS fallback. Fallback keeps OS capabilities available; account-connected features such as parallel execution and FlowMail require Cloud access within your workspace limits.

Installing project dependencies again may remove the Cloud engine. If that happens, run `npx flowstride login` after dependency installation. See [installation and updates](/guide/releases) and [authentication troubleshooting](/guide/troubleshooting).

## Where tests run

Tests execute on your computer or your normal CI runner. Cloud provides authenticated workspace services and eligible result review. Connecting a Cloud account does not move test execution away from your chosen machine or CI environment.
