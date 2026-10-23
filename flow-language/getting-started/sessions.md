# Save and reuse sessions

Sessions let a flow reuse browser state instead of repeating every login action. Save only after you have verified that authentication succeeded.

```flow
flow.expect visible "Logout";
flow.save session "customer" persist;
```

A later flow can restore before opening the application:

```flow
flow.use session "customer";
flow.open "/account";
flow.expect visible "Logout";
```

## Storage included

Flowstride saves cookies, localStorage, sessionStorage and the active page's HTTP(S) origin. The session can also retain API material from the runner's current state. Verify the application behavior after use rather than assuming a particular login mechanism is compatible.

Temporary sessionStorage is restored immediately on the saved origin or before the first matching page starts. It is not injected into another origin or a foreign top-level page's iframe. The initializer is removed after use, so later app changes or clears survive reloads.

The snapshot concerns the active origin. It does not capture IndexedDB, every tab, arbitrary JavaScript memory or a full user profile. Restored keys merge into existing storage rather than clearing all unrelated keys.

## Scope and persistence

| Form | Use |
| --- | --- |
| `flow.save session "name"` | Save in local memory for the current flow file |
| `flow.save global session "name"` | Save in process-level global memory |
| `flow.save session "name" persist` | Also write `.flowstride/sessions/name.json` |
| `flow.use session "name"` | Reuse local state or a persisted record |
| `flow.use global session "name"` | Use the process-global session or persisted record |

Use simple, project-safe names. Persisted files can contain credentials; exclude `.flowstride/` from Git and artifacts. Global memory is not shared across Cloud worker processes. Avoid concurrent writes to the same persisted session name.

## Separate live users from saved snapshots

A saved session is a snapshot, not a second live browser. Save reads the selected profile; use restores into the selected profile. You can keep a customer and an administrator logged in independently with [named browser profiles](/guide/native-browser-workflows#separate-users-in-one-test), then save separate snapshots such as `customer-login` and `admin-login`.

Existing sequential login scenarios still work. Use profiles when both users must remain live without replacing one another's cookies/storage. Profiles do not isolate runner variables or roll back application data.

## Old sessions

Cookie/local-storage snapshots remain compatible. An older snapshot with sessionStorage but no origin uses the current application origin or `baseUrl`. Open the intended application first or configure `baseUrl`; otherwise restoration fails rather than guessing where to place temporary data.

A matching origin includes scheme, host and port. `http://localhost:3000` and `http://127.0.0.1:3000` are different origins.

## Try a complete local example

[Download the storage example](/examples/flowstride-storage-example.zip). It uses a small local application: the setup flow saves a signed-in session, then a fresh browser restores it before startup. Follow the included installation instructions, then run `npx flowstride run --ci`. No hosted account or custom runner is needed.

## SDK sessions

`SessionManager` save/use also retains sessionStorage and origin. Custom authentication refresh and fixture logic remains application-specific. Do not import internal workers to implement it; use a narrow supported [plugin](/flow-language/getting-started/plugins) where needed.
