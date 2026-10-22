# Docstrings and JSON bodies

Triple quotes let you write a multiline string without escaping every JSON quote. Use them for request bodies and header objects.

```flow
flow.post "/api/customers" with reqHeader
"""
{ "Content-Type": "application/json" }
"""
with reqBody
"""
{
  "name": "Documentation Reader",
  "email": "$randomEmail@example.test"
}
"""
```

The body must be valid for your application. A JSON body should remain valid JSON after variable replacement. Header blocks must be JSON objects; alternatively provide a key/value pair:

```flow
flow.get "/api/profile" with reqHeader "Authorization" "Bearer {{env.API_TOKEN}}";
```

Use `reqBody` and `reqHeader` with exact camelCase. Semicolons can separate commands; triple-quoted content belongs to the preceding modifier even when placed on the next line.

A docstring is a string, not executable JavaScript. Plugin and game action arguments use JSON objects or a string directly after the alias action, rather than `with reqBody`.
