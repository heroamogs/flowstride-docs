# flow.use

Restore a saved session by name.

```flow
flow.use session "customer";
flow.open "/account";
```

Saved browser sessions include cookies, localStorage, sessionStorage and the source origin in the browser session path. Optional `global` selects process-level memory. `persist` on save also writes a sensitive project-local snapshot.

Read the [session guide](/flow-language/getting-started/sessions) for storage-origin restrictions, old snapshots, fresh-page restoration and parallel-worker limitations. Saving does not guarantee a token remains valid indefinitely; assert the application is authenticated after use.
