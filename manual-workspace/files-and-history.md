# Templates, runs, and backups

The Manual Workspace stores separate records for the test design and its executions.

```text
manual_flows/
  templates/          # reusable design JSON
  runs/               # submitted run snapshots, grouped by date/time
  media/              # local design references
  defect_media/       # local defect evidence
  .workspace_state.json
```

## Saving a design

**Save** in Design Mode writes a template containing canvas entities and metadata. Renaming a saved design can replace the physical template name; save a separate backup/version when you need to preserve an older design.

The OS toolbar includes a browser-export path with an outer `metadata`/`canvas` wrapper, different from the project server's saved template. That path depends on the hosting window's engine bridge and is not guaranteed by the iframe-hosted workspace. Use confirmed project files as the authoritative backup, not an assumed browser download.

The last selected template is recorded in `.workspace_state.json`. This convenience state is not an autosave guarantee. Wait for Save confirmation before navigating away or stopping the server.

## Submitting a run

**Save** in OS / **Submit Run** in Cloud mode writes a separate snapshot with canvas data, metadata and `executionReport`. The execution report includes per-step status, expected result, defect data and grouping. Local saving occurs before an attempted authenticated Cloud synchronization.

Historical runs do not overwrite the reusable design. A submitted JSON file is still an ordinary file: it is not tamper-proof or digitally signed.

## Review historical runs

Open **Runs** and search by name or date. Selecting a record opens its saved report in the workspace. Defect editing is read-only in historical report panels. Cloud mode additionally locks historical toolbar actions. Treat history as review-only in either edition; return to the template for a new execution.

Do not rely on returning to a historical canvas as a resumable test session. Review its stored results and submit a new run for a retest. Expand report groups to see the step details. Reopening a historical canvas can reinitialize its active-step highlight; use the saved execution report for the recorded outcomes, not the newly highlighted canvas node.

## Back up a complete record

Preserve the template/run JSON **and** the local files its media URLs reference. Copying only JSON can produce broken images and clips. Relative `/media` and `/defect_media` URLs need the corresponding project directories and local server.

Version-control reusable templates where appropriate. Review them for data and local links first. Store execution evidence and large media in a controlled artifact/backup system with an agreed retention period, rather than committing every video to Git.

`.flowstride` credentials, persisted login sessions and environment secrets should not be included in a shared project bundle. Keep private backups under your own access and retention policy. A Cloud attachment reference does not grant the recipient workspace access, and local reference files still need to be copied deliberately. [Safe sharing](/security/ci-and-sharing).

## Portable input

Supported template imports should retain the canvas collections `nodes`, `groups`, `texts`, and `connections` with unique IDs and valid references. Keep content as JSON, not executable HTML. Sanitization may remove unsafe or unsupported rich-text markup.

The [example design](/examples/manual-checkout.json) can be copied into `manual_flows/templates/`. Inspect externally supplied files and keep a backup before replacing an existing template.
