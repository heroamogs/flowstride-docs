# flow.select

Choose an option from a target select/dropdown.

## Example

```flow
flow.select "Nigeria" from "Country";
```

## Behavior and limits

Target the actual labeled control. Custom portal dropdowns may need a stable label or selector; this is not a promise to support every widget implementation.

Use this command inside a complete [Given/When/Then scenario](/guide/core-concepts). See the [browser command index](/reference/ui-commands) for related actions.
