# burger

Target a hamburger/menu trigger.

```flow
flow.click burger;
```

Element qualifiers guide target resolution; they are not a complete DOM-query language. Prefer a clear label, then add a stable selector or [spatial relationship](/flow-language/spatial-modifiers/near) if the page is ambiguous.

The burger fallback is heuristic. A clear accessible name or explicit selector is more predictable when several menu controls exist.
