# flow.open

Open an application URL. Relative URLs use `baseUrl`.

## Example

```flow
flow.open "/account";
```

## Behavior and limits

Use an explicit HTTP(S) base URL. Opening a page does not authenticate it automatically.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
