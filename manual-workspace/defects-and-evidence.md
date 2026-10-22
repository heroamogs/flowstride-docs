# Defects and evidence

A useful defect lets someone reproduce the mismatch without guessing. Attach evidence that explains the failure and keep it connected to the affected step and run.

## Write an actionable defect

Include the application build/environment, starting data or fixture identifiers, concise reproduction steps, expected result, actual result, impact and reproducibility. Add the external issue ID if your team uses an issue tracker.

The assignee field records a label in the run. It does not create a tracker ticket, verify an identity or send a notification. Coordinate ownership through your team's normal workflow.

## Reference media versus defect media

| Media | Purpose | Location/access |
| --- | --- | --- |
| Design reference | Explain what to test: mockup, reference screen or expected behavior | Local `manual_flows/media` |
| Defect evidence | Show what actually happened during a run | Local `manual_flows/defect_media`; authenticated Cloud upload may return a shareable URL |

Reference media is not automatically transferred when a template/run is shared through Cloud. A local `/media/...` URL is meaningful to that project server, not a remote teammate's machine.

## Current limits

The image/video chooser and server impose different limits. The effective server limit still applies even when the chooser accepts a larger file.

| Evidence | Current behavior |
| --- | --- |
| Defect images | Up to 6 per step in the chooser; PNG/JPG/JPEG/GIF; 5 MiB each in the chooser |
| Defect clips | Up to 4 per step in the chooser; MP4/WebM |
| Defect upload request | Local server caps each file at **40 MiB**; a larger video accepted by the UI can still be rejected |
| Design reference upload | Local server cap is 100 MiB; keep references substantially smaller for usability |
| Template/run JSON | Save payload cap is 2 MiB; attach files rather than embedding binary data |

Cloud eligibility and limits may be stricter. Do not treat the UI's 100 MB video message as the effective defect-upload allowance. Prefer short clips well below 40 MiB and images below 5 MiB.

## Local and Cloud behavior

The workspace keeps a local copy before attempting remote delivery. With credentials available, defect upload can request a Cloud upload ticket. If remote delivery fails, a local URL can remain in the run; local preservation does not establish that a remote reviewer can open it.

**Manual defect Cloud URLs are shareable public evidence links in the current integration.** They do not use the authenticated playback boundary documented for automated videos. Use disposable test data and omit private information from captures.

Removing a local cache file or a link from the form does not by itself prove a previously shared Cloud object has been removed everywhere. Keep evidence referenced by historical runs unless your team's retention process intentionally removes it.

## Make evidence useful

Capture enough context to identify the step, product state and error, then stop. Use a filename/issue reference that is understandable later. Avoid recordings of passwords, customer data, browser notifications or unrelated windows. Verify the saved record can open the media before handing the defect to another person.
