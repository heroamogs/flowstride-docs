# Reports and evidence

## Native CI output

By default, CI writes `flowstride-artifacts/summary.json` and `flowstride-artifacts/junit.xml`. Configure another project-local `artifactsDir` if needed.

The summary records run status, engine, selected browser and per-file browser metadata, final-step metrics, scenario attempts, timings, errors and evidence locations. JUnit is intended for CI test-result tooling. Screenshots, videos and attachments use a unique run directory so repeated local runs do not mix their media.

Do not hardcode a video filename from a single test run. Resolve the evidence paths recorded in its summary. Nested same-name flows remain distinct.

## Understand the outcome

| Result | Interpretation |
| --- | --- |
| Passed | The scheduled test assertions completed successfully |
| Failed | A final test failed, execution/setup failed, or strict flaky policy rejected a recovered scenario |
| Incomplete/interrupted | Not all scheduled work completed; native CI returns nonzero |
| Cloud reporting/video failure | Test result is retained, but remote delivery needs attention |

Cloud status appears separately in the run summary and `.flowstride/cloud-sync.json`. A terminal message saying the suite passed does not establish successful upload or playback.

## Attempts, profiles and diagnostic files

`steps` and top-line metrics describe final step outcomes. `attempts` retains the earlier failed and later successful scenario results; a passing retry is marked flaky. With `failOnFlaky: true`, all final steps can pass while the overall status is failed. Check `status`, `errors` and `attempts` together.

Optional evidence includes:

| Evidence | Enable/use | What it establishes |
| --- | --- | --- |
| Video/screenshots | `recordVideo`; automatic screenshots unless disabled by evidence policy | Visible execution and captured failure state |
| Trace ZIP | `trace: true` or explicit trace commands | Browser operations, snapshots and screenshots; Flowstride assertions remain in the summary |
| HAR | `har: true` | Recorded HTTP traffic, finalized on context close; eligible for local replay |
| DOM HTML | `domSnapshots: true` | Diagnostic captured page markup; dashboard serves it as inert text |
| Accessibility JSON/ARIA YAML | Native `a11y` commands | Scan results or a selected accessibility tree |
| Downloads/checkpoints | Native download/game commands | Explicitly saved application files or canvas images |

Earlier retry attempts retain evidence. Profile/file names distinguish independent users and flows. These extra formats are local artifacts; they are not automatically uploaded through Cloud's automated video integration. Resolve their actual paths from the run's records rather than inventing a filename.

Use `npx flowstride trace <project-local-trace.zip>` to inspect a trace. [Native evidence workflow](/guide/native-browser-workflows#traces-har-and-dom-evidence) explains automatic versus explicit tracing and HAR playback.

## Merge shard results

Preserve each shard summary next to its evidence directory, then merge a complete compatible set for one browser configuration. Missing/duplicate shards, mixed suites/settings and missing evidence are rejected. A failed/interrupted input cannot become a passing merge. The merged report retains attempts and per-file browser metadata.

The default output is a new `flowstride-merged` directory. Choose another unused project directory with `--output` for another merge. [Sharding and merging](/guide/native-browser-workflows#browser-matrices-and-multiple-ci-machines).

## Retention and sharing

The generated GitHub workflow uploads the artifact root even on failure and sets a retention period. Adjust it to your team's needs and repository access policy.

Use test accounts and data that can be retained safely. Known sensitive log fields are redacted and local debugger-only captures are excluded from portable JSON. This does not sanitize arbitrary text, attachments, pixels, HAR or traces. Copied cURL is masked; adding credentials outside Flowstride makes it sensitive again. [Evidence and Replay privacy](/security/evidence-and-replay).

Automatic engine evidence uses restricted local filesystem permissions. Those controls do not encrypt it or govern a later CI upload. Configure [capture controls](/security/evidence-and-replay#reduce-capture), upload only intended output directories, and review access/retention at each destination. Do not collect credentials, saved sessions or the whole project as a test artifact.

Manual templates and run records live under `manual_flows`, not this CI directory. [Manual file lifecycle](/manual-workspace/files-and-history) covers backup and sharing.
