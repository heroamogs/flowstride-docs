# Execution and failures

## Discovery and order

`flowstride run` reads `testDir` (default `flows`). Supply a file or directory to narrow the target. Discovery includes nested folders. Files ending in `.first.flow` are setup files and run before ordinary files.

Reports preserve paths relative to the flow root: `admin/login.flow` and `customer/login.flow` remain separate tests and have distinct evidence names.

A sequential run uses one worker. Cloud can distribute files across workers, subject to workspace and machine limits. Do not use in-memory globals as communication between workers. Use independently seeded data or an explicit persisted artifact whose lifecycle you control.

Local extracted values, generated-value memory and unsaved local sessions reset between files, not between every scenario. Named browser profiles are also file-local. Use independent data and distinct names when scenarios or users share a file. [Variables](/flow-language/getting-started/variables) and [profiles](/guide/native-browser-workflows#separate-users-in-one-test) explain these boundaries.

## What happens on failure?

A failed step marks its attempt failed and leaves that attempt's remaining steps untested. If `retries` is configured, Flowstride reruns that failed scenario before proceeding. After the final failed attempt, the runner continues to later scenarios by default. `--bail` stops later work after that final failure; Cloud uses sequential execution for bail runs.

```sh
npx flowstride run flows --ci --bail
```

`flow.try` makes an action optional. Reserve it for an optional banner or similar condition; using it around a required assertion can hide a defect.

## Focus and debug stops

`only.Scenario:` focuses one scenario within that file. Only one focus marker is allowed per file. Other files remain eligible. `stop.When` and other `stop.` blocks are debugging controls. Remove focus and stop markers before a complete acceptance run; CI records incomplete execution as a nonzero result.

## Interactive and CI lifecycles

Interactive execution keeps the local dashboard server open for inspection after the suite ends. Stop it with Ctrl+C when finished.

Native CI forces headless mode, writes `summary.json` and `junit.xml`, and exits. Failed, incomplete, or crashed execution returns nonzero. SIGINT/SIGTERM are recorded as interrupted runs. A configured local `webServer` is owned and stopped by the run.

Test outcome and Cloud reporting outcome are separate. A passing test with a failed upload remains a passing test with a reporting problem. Inspect both fields in the [CI artifacts](/reporting/artifacts).

## Explicit retries and distributed runs

Retries are opt in and preserve earlier attempt diagnostics. A later success is reported as flaky; external application changes are not rolled back. [Native browser workflows](/guide/native-browser-workflows) explains retry configuration, independent users, matrices, file sharding and complete result merging.
