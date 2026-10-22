# flow.graphql

Send a GraphQL query to an endpoint using the API adapter. A raw query body is wrapped in the standard GraphQL request structure.

```flow
flow.graphql "/graphql" with reqBody
"""
query {
  viewer {
    id
    name
  }
}
"""
flow.expect status "200";
flow.expect resBody "data.viewer.id" not.empty;
```

Check GraphQL's `errors`/application response as well as the HTTP status; HTTP 200 alone does not establish a successful operation. Your application provides the schema and authentication. Use request headers when needed.

See [docstrings](/flow-language/getting-started/docstrings) and the [API reference](/reference/api-commands).
