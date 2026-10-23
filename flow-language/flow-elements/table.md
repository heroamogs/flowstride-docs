# table

Qualify a table target.

```flow
flow.expect visible table "#orders";
```

Element qualifiers guide target resolution; they are not a complete DOM-query language. Prefer a clear label, then add a stable selector or [spatial relationship](/flow-language/spatial-modifiers/near) if the page is ambiguous.

The table qualifier does not introduce a dedicated row/cell data-extraction or sorting-assertion DSL. Use a stable cell selector, native text/attribute extraction, native `flow.assert.that` counts/text/property conditions, or a focused plugin for a richer table check.
