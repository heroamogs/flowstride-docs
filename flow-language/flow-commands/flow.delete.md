# flow.delete

Delete a resource. A relative URL uses configured `baseUrl`. The expected status and payload are defined by your application, not by Flowstride.

## Example

```flow
flow.delete "/api/customers/DOCS-001";
flow.expect status "200";
```

## Headers and bodies

Add `with reqHeader "Name" "Value"` or a JSON header docstring. Body-bearing calls accept `with reqBody` followed by a quoted string or triple-quoted docstring. Use strict camelCase for these modifiers.

The example endpoint is illustrative; use a disposable test resource. Assert the actual status/body your API specifies. A DELETE endpoint, for example, may correctly return 204 instead of 200.

[API command index](/reference/api-commands) · [Extract response data](/flow-language/flow-commands/flow.extract) · [Assertions](/flow-language/flow-commands/flow.expect)
