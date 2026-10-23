# CLI reference

Run these commands from your npm project using `npx flowstride`, for example `npx flowstride --version`. Install Flowstride first with `npm i flowstride`.

| Command | Purpose |
| --- | --- |
| `flowstride --version` | Print the CLI package version |
| `flowstride init` | Create the project folders, sample flow and ignore entries; attempt Chromium setup |
| `flowstride install [browsers...]` | Install matching `chromium`, `firefox` or `webkit` binaries; defaults to Chromium |
| `flowstride install --with-deps` | Also install operating-system dependencies, useful on Linux CI |
| `flowstride run [path]` | Run a file or folder; defaults to configured `testDir` |
| `flowstride open` | Launch the Manual Workspace |
| `flowstride login` | Connect a Cloud account using a developer token and install its engine when needed |
| `flowstride login --global` | Store credentials for use across projects on this machine |
| `flowstride status` | Check the current Cloud session/workspace |
| `flowstride ci init github` | Explicitly generate `.github/workflows/flowstride.yml`; optional `--browsers` and `--shards` |
| `flowstride trace <file>` | Open a project-local trace ZIP |
| `flowstride merge <summaries...>` | Merge complete, compatible shard results; optional `--output <new-directory>` |

## Run options

| Option | Behavior |
| --- | --- |
| `--ci` | Headless execution, reports and process exit; no interactive dashboard |
| `--headed` / `--headless` | Set browser visibility; CI forces headless |
| `--bail`, `-b` | Stop later work after a failure |
| `--workers <number>` | Requested parallel workers; Cloud capability subject to workspace limits |
| `--device <profile>` | `desktop`, `phone`, or `landscape`; [engine limits apply](/guide/browser-compatibility) |
| `--browser <engine>` | Select `chromium` (default), `firefox`, or `webkit` |
| `--shard <index/total>` | Select one deterministic CI file shard, for example `1/3` |
| `--shard-history <file>` | Use a complete merge's timing history for consistent shard balancing |
| `--update-baselines` | Deliberately create/update ARIA baselines locally; refused in CI |
| `--config <file>` | Project-local configuration file |
| `--env <name>` | Load `.env.<name>` before default `.env` |

```sh
npx flowstride run flows/account.flow --ci --env staging
npx flowstride run flows --workers 4
npx flowstride run flows --config flowstride.test.json
```

`--workers` is a run option, not a configuration-file field. Workspace and CPU limits may reduce the requested count. OS uses sequential execution.

`--browser` selects the engine for this run; `install` only downloads it. For whole-scenario retries, use configuration `retries` and `failOnFlaky`; there is no `--retries` flag. [Native command reference](/reference/native-browser-commands) lists the JSON command options.

## Authentication

Use the masked interactive prompt for a local login:

```sh
npx flowstride login
```

CI can provide `FLOWSTRIDE_TOKEN` as a secret, then call `login` when the Cloud engine needs to be installed. A `--token` option also exists, but putting a token in a shell command can expose it in history.

## Legacy commands

`report` remains a legacy command for the older `reports/latest` reporter; it is not a viewer for native CI's `summary.json`. Use the interactive TestCase/Reports views or your CI platform's JUnit/artifact tools for current runs.

For an installed Cloud engine, use `npx flowstride update` to check for updates. See [installation and updates](/guide/releases).

Run tests locally or in your own CI, with optional authenticated Cloud reporting.
