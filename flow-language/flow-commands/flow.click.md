# flow.click

Click a target using a readable label, optional element qualifier, stable selector or spatial anchor.

## Example

```flow
flow.click button "Save" near "Profile";
```

## Tables and row actions

```flow
flow.click "table[0] tr[2] td[0]";
flow.click button "View" inside "table[0] tr[1]";
flow.click "#orders tbody tr:has(td:text-is('FS-102')) button";
```

Coordinates start at zero and include header rows. Find a row by its unique contents when sorting or filtering can change its position. The [table and cell guide](/guide/table-testing) includes a local application and complete OS/Cloud tests for each approach.

## Behavior and limits

Use a distinct label or scope when the page contains several matches. A normal click uses browser action waiting; it does not repeatedly click while a later assertion polls. Prefer a normal click before considering forceClick. [Waiting behavior](/guide/waiting-and-retries).

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
