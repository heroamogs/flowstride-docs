# Reports and evidence

## Native CI output

By default, CI writes `flowstride-artifacts/summary.json` and `flowstride-artifacts/junit.xml`. Configure another project-local `artifactsDir` if needed.

The summary records the run status, engine, metrics and evidence locations. JUnit is intended for CI test-result tooling. Screenshots, videos and attachments use a unique run directory so repeated local runs do not mix their media.

Do not hardcode a video filename from a single test run. Resolve the evidence paths recorded in its summary. Nested same-name flows remain distinct.

## Understand the outcome

| Result | Interpretation |
| --- | --- |
| Passed | The scheduled test assertions completed successfully |
| Failed | At least one test failed |
| Incomplete/interrupted | Not all scheduled work completed; native CI returns nonzero |
| Cloud reporting/video failure | Test result is retained, but remote delivery needs attention |

Cloud status appears separately in the run summary and `.flowstride/cloud-sync.json`. A terminal message saying the suite passed does not establish successful upload or playback.

## Retention and sharing

The generated GitHub workflow uploads the artifact root even on failure and sets a retention period. Adjust it to your team's needs and repository access policy.

Use test accounts and data that can be retained safely. Known sensitive log fields are redacted, but arbitrary text, attachments, screens and videos can contain business data. Keep raw cURL commands out of shared artifacts.

Manual templates and run records live under `manual_flows`, not this CI directory. [Manual file lifecycle](/manual-workspace/files-and-history) covers backup and sharing.
