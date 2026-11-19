# Installation and updates

Install Flowstride (FS) 2.0 in the project that contains your tests. Use Node.js 22.12 or newer.

## Install Flowstride {#install-flowstride-os}

```sh
npm install --save-dev flowstride@2
npx flowstride init
```

The public npm package runs locally without an account. In a fresh project, `init` creates the local practice app configuration, example flows and JS/TS helper directory, then checks Chromium. Run `npx flowstride run` to open the live dashboard.

If Chromium setup failed, install the matching browser explicitly:

```sh
npx flowstride install
```

To use additional engines:

```sh
npx flowstride install chromium firefox webkit
npx flowstride run --browser firefox
```

Keep the package and its matching browsers together when updating your project. [Browser compatibility](/guide/browser-compatibility) explains headed runs, dashboard windows and engine limits.

## Move an existing project to 2.0

After updating your dependency, run `npx flowstride --version` in the project root. To try the new examples alongside your own suite, run `npx flowstride init --practice`. In an existing FS project this creates a separate practice workspace under `.flowstride/practice`. Change into that directory and run `npx flowstride run`. For the pricing and role-assignment examples, see [the practice walkthrough](/guide/working-examples#bundled-practice-app).

Existing SDK plugins keep their alias syntax. You can add a named JS/TS helper to one scenario at a time. The CLI command is still `flowstride` and scenarios still use `.flow`. [Calling helpers](/flow-language/getting-started/helpers)

## Keep project installs reproducible

Commit `package.json` and `package-lock.json`. Use `npm ci` in CI to install the dependencies selected by that lockfile.

```sh
npm ci
npx flowstride install --with-deps
npx flowstride run --ci
```

`--with-deps` also installs browser system dependencies on supported Linux runners. See [native CI](/guide/native-ci-games) for workflow generation and secrets.

## Connect Cloud

Cloud includes free accounts. The Flowstride Pro engine is available through an authenticated private channel, with features and usage limits determined by your workspace plan. After installing project dependencies, run:

```sh
npx flowstride login
npx flowstride status
```

Paste a valid developer token into the masked prompt and accept the Flowstride Pro engine installation when offered. Read the confirmed workspace and engine status. See [Cloud authentication](/cloud/authentication) for token management.

## Update your installation

Update the FS dependency in your project:

```sh
npm install --save-dev flowstride@2
npx flowstride install chromium firefox webkit
```

Install only the browsers your suite uses. For an installed Flowstride Pro engine, use:

```sh
npx flowstride update
```

Stop a running Flowstride process before restarting with an updated installation. Run a representative flow after updating and review its assertions, reports and evidence.

If a dependency installation removes the Flowstride Pro engine, run `npx flowstride login` again after installing project dependencies. The launcher uses an authorized compatible Flowstride Pro engine when available and falls back to FS when the Flowstride Pro engine cannot be used. [Editions and capabilities](/guide/editions) explains the distinction.
