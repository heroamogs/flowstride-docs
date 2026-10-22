# Native CI

Run the same `.flow` suite in CI without a custom `.cjs` runner. Flowstride owns execution, browser lifecycle, failure status, and report generation.

## Run locally as CI

```sh
npx flowstride install
npx flowstride run flows --ci
```

Native CI is selected by `--ci` or a recognized CI environment. It forces headless mode, writes reports, and exits. A failed, incomplete, or crashed run returns nonzero. Interruptions are recorded.

Use [configuration](/guide/configuration) for `baseUrl`, a managed local application server, timeouts, media and artifact paths.

## Generate GitHub Actions setup

```sh
npx flowstride ci init github
```

This explicitly creates `.github/workflows/flowstride.yml`; it is **not** created during package installation. An existing file is not overwritten.

The generated workflow checks out the repository with read permissions, installs a locked npm project, installs matching browser dependencies, runs native CI, and uploads artifacts even when tests fail. Commit `package-lock.json` and review the generated workflow before committing it.

The template assumes a single npm project on Linux. For a monorepo, adjust its working directory and installation command. A hosted target needs its URL; a local target needs `webServer` configuration or your own server setup.

## Optional: prevent automatic package installation in CI

After `npm ci` installs your locked dependencies, you can add `--no-install` to the CI commands:

```sh
npm ci
npx --no-install flowstride install --with-deps
npx --no-install flowstride run flows --ci
```

`--no-install` is an npm option. It stops `npx` from installing a missing package automatically, so a missing Flowstride dependency can fail the job immediately instead of triggering an unexpected installation. When Flowstride is already installed, it does not change how your tests run. Usual local commands can use `npx flowstride` without this option.

## Cloud in CI

Store `FLOWSTRIDE_TOKEN` as a repository/environment secret, not in YAML. Use this order:

1. Install the project's locked npm dependencies.
2. Connect your Cloud account and install its engine with `npx flowstride login`. Free accounts can use this flow within their workspace limits.
3. Install the matching Chromium and Linux dependencies.
4. Run the suite.
5. Retain artifacts with an always-run upload step.

The generated OS workflow does not add your credentials or a private installation automatically. Keep untrusted pull requests away from Cloud tokens. A public OS CI run does not require a token.

## Reporting

The default artifact root is `flowstride-artifacts`. It contains the latest `summary.json` and `junit.xml`; media lives under a unique run directory referenced by the summary. [Understand the artifacts](/reporting/artifacts).

CI Cloud reporting is optional. Set `cloudSync: true` and supply appropriate authentication only when needed. Reporting/video failures are tracked separately from test outcomes and do not remove local results.

## Games use the same CI runner

Declare `let game = "flowstride:game"` to use native game actions. The application's state/fixture integration remains application code. See [browser games](/games/getting-started) for a complete guide.

Run the suite on GitHub Actions or another CI service, with optional authenticated Cloud reporting.
