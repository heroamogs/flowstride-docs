# field

Use the input/field qualifier.

```flow
flow.type field "Email" "reader@example.test";
```

Element qualifiers guide target resolution; they are not a complete DOM-query language. Prefer a clear label, then add a stable selector or [spatial relationship](/flow-language/spatial-modifiers/near) if the page is ambiguous.

See the [browser command index](/reference/ui-commands) for compatible interactions.

Readable input targets should expose a placeholder, aria-label, or a label that wraps the input. A separate `label for`/`id` association alone is not handled by every current smart-selector path; use an explicit stable selector for that case.
