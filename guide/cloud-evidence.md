# Cloud evidence and candidate safety

Cloud URLs use `FLOWSTRIDE_API_URL` first, then the legacy `NEXTJS_WEBHOOK_URL`.
The old `/api/cloud/execution-complete` suffix is normalized when supplied as an
override. These settings select the API host; they do not enable managed runs.

New automated video uploads use short-lived object-store signatures that bind
the authenticated workspace, exact content length, media type and private ACL.
The maximum video size is 50 MiB. The older bounded Cloud upload proxy remains
available for compatible clients. Automated playback requires a current user
session and membership of the video's workspace.

Manual defect evidence keeps its existing public URL behavior for compatibility
with local workspace previews. Treat its URLs as shareable evidence links;
private manual evidence requires a separate access design. Existing historical
public objects are not made private by this candidate.

Storage needs the separate `DEFECT_MEDIA_*` credentials documented in the Cloud
repository. Never grant media credentials access to the Pro engine vault.
Retention deletes remote objects before removing their ledger entries and run
references. Failures remain retryable. Unknown legacy object URLs are retained
for review instead of guessing a bucket key.

Logs redact known credentials, generated passwords/OTPs, sensitive fields, and
signed capabilities. Application-specific text and visible screenshot/video
content still need appropriate test data and artifact access settings.

The installer bounds Pro downloads, validates package identity and archive paths,
and checks the server's SHA-256 header or an explicit `FLOWSTRIDE_PRO_SHA256`
pin. Older servers without a checksum header emit a compatibility warning.
Failed npm installs restore the previous Pro directory and CLI launchers; npm's
entire dependency tree is not transactional. Test candidate installs in a
separate project before changing a working installation.

Local tests cannot establish production bucket policy, licensed download,
live reporting, playback or hosted archive correctness. Validate those on the
intended Cloud deployment after local acceptance. Billing, quotas, subscriptions,
prices and usage accounting are excluded from these candidate changes.
