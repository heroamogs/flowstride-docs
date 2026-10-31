# Connect a Cloud workspace

OS tests can run locally without an account. Cloud includes free accounts with access to workspace features within their plan limits. Use a Cloud developer token to connect the CLI, install the Cloud engine, and access eligible workspace services.

## Create and use a developer token

1. Sign in to Flowstride Cloud and select the intended workspace.
2. Open **Developer Tokens** and create a suitably scoped token with an expiration appropriate to your use.
3. Copy its value when shown and keep it in a password manager or CI secret.
4. In the project, run `npx flowstride login` and paste it into the masked prompt.
5. Read the confirmed workspace/expiry information and the engine banner on the next run.

Developer Tokens distinguishes token status and shows creation, expiry and last use.

## Credential scope

Local login saves credentials in the project's `.flowstride/credentials.json`. `login --global` saves a machine-wide credential in the user's `.flowstride` folder. Treat either file as sensitive and exclude project credentials from source control. Flowstride restricts private-state filesystem access; it does not encrypt these local credentials. Protect the machine account and backups. [Local data](/security/local-data).

`FLOWSTRIDE_TOKEN` takes precedence over saved credentials. If an old CI secret is set, logging in with another token may not change the token that CI uses. Replace the secret at its source.

## Browser logout is separate

Signing out of the dashboard or using **Logout all sessions** ends browser access; it does not revoke developer tokens used by the CLI/CI. Revoke those keys separately. Application login snapshots are a third credential type, controlled by your application. [Cloud access boundaries](/security/cloud-and-access#browser-sessions-and-developer-tokens).

## Rotate or revoke

Revoke a token that is no longer needed or was exposed, replace it in each consuming environment, and authenticate again. A 401 means rejection; only an explicit expiry reason establishes that it expired. A 403 can be an authorization or entitlement issue.

Do not put the raw token in an issue, terminal transcript, flow file or screenshot. See [Cloud evidence](/guide/cloud-evidence) for reporting and storage behavior.
