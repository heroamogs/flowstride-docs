# Cloud execution workflows

Cloud adds account-connected services to the same local and CI execution workflow. Free accounts can use features within their workspace's limits. Check the authenticated workspace's capabilities rather than assuming that every Cloud feature requires a paid account or is available to every plan.

## Existing selector recovery

The Cloud worker contains selector healing for supported UI actions that fail to locate or use a target. With workspace access and a configured `GEMINI_API_KEY`, it can send the failed selector, error and stripped page DOM to the configured external model service, receive a replacement selector and retry the action.

This path is considered after a qualifying UI failure; it does not make a weak business assertion stronger. Verify the resulting application state with a required assertion and review a healed target before treating the test as stable.

The local `.flowstride/healer_cache.json` stores selector mappings. A cached mapping can be reused without a new model request. Leaving the model key unset skips new model requests but does not by itself clear an existing cache. Review or remove stale mappings deliberately. Keep the cache and model key out of public source/artifacts, and use this feature only with application DOM data permitted for that external service.

Entitlement, connectivity, key validity and the model service determine whether recovery is available. Failure to recover leaves the original step failed. Ordinary Flowstride automation and native CI do not need a model key.

## Refresh an application's API authentication

Cloud's legacy `flow.autoheal` command registers an API authentication-refresh request. Despite its name, this is distinct from selector recovery:

```flow
flow.autoheal "401" via flow.post "/api/auth/refresh" with reqBody
"""
{
  "refreshToken": "{{env.APP_REFRESH_TOKEN}}"
}
"""
```

Use it under setup/actions in a complete scenario, before the protected API request. Supported trigger statuses are `401` and `403`; supported refresh verbs are GET, POST, PUT, PATCH and DELETE. A failing refresh response fails explicitly. The adapter guards against recursive refresh and retries the original protected request once after successful refresh handling.

Your application's refresh endpoint and credential/header update contract must be valid for the next request. This command does not automatically invent bearer-token extraction or exchange a Flowstride developer token for an application token. OS rejects this Cloud-only command at execution; the remaining base API commands work in OS.

## Clear local runner data

The installed Cloud CLI provides:

```sh
npx flowstride reset --values
npx flowstride reset --sessions
npx flowstride run flows --fresh
```

`--values` removes the local `.flowstride/vault.json` file. `--sessions` removes the local saved-session directory. `run --fresh` clears both before the run. Back up useful test state first and prepare the required data again afterward.

These are Cloud CLI options, not equivalent universal OS switches. They clear local runner data, not backend users, application databases or saved Cloud developer credentials. [Saved sessions](/flow-language/getting-started/sessions), [token rotation](/cloud/authentication) and [Cloud evidence](/guide/cloud-evidence) describe the separate lifecycles.
