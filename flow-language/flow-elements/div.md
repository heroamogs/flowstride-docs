# div

Qualify a container target when the page needs a more specific match.

```flow
flow.click div "Account options";
```

Element qualifiers guide target resolution; they are not a complete DOM-query language. Prefer a clear label, then add a stable selector or [spatial relationship](/flow-language/spatial-modifiers/near) if the page is ambiguous.

See the [browser command index](/reference/ui-commands) for compatible interactions.
