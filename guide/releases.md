# Installation and updates

Install Flowstride in the project that contains your tests. Use Node.js 22.12 or newer.

## Install Flowstride OS

```sh
npm i flowstride
npx flowstride init
```

The npm package provides Flowstride OS. It runs locally without a Cloud account. `init` creates the project folders and an example flow, and installs Chromium.

To install the browser explicitly:

```sh
npx flowstride install
```

Keep the package and its matching browser together when updating your project.

## Keep project installs reproducible

Commit `package.json` and `package-lock.json`. Use `npm ci` in CI to install the dependencies selected by that lockfile.

```sh
npm ci
npx flowstride install --with-deps
npx flowstride run flows --ci
```

`--with-deps` also installs browser system dependencies on supported Linux runners. See [native CI](/guide/native-ci-games) for workflow generation and secrets.

## Connect Cloud

Cloud includes free accounts. The Cloud engine is available through an authenticated private channel, with features and usage limits determined by your workspace plan. After installing project dependencies, run:

```sh
npx flowstride login
npx flowstride status
```

Paste a valid developer token into the masked prompt and accept the Cloud engine installation when offered. Read the confirmed workspace and engine status. See [Cloud authentication](/cloud/authentication) for token management.

## Update your installation

Update the OS dependency in your project:

```sh
npm i flowstride
npx flowstride install
```

For an installed Cloud engine, use:

```sh
npx flowstride update
```

Stop a running Flowstride process before restarting with an updated installation. Run a representative flow after updating and review its assertions, reports and evidence.

If a dependency installation removes the Cloud engine, run `npx flowstride login` again after installing project dependencies. The launcher uses an authorized compatible Cloud engine when available and falls back to OS when the Cloud engine cannot be used. [Editions and capabilities](/guide/editions) explains the distinction.
