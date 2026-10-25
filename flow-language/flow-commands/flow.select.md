# flow.select

Choose an option by its displayed label from a native select or a supported custom dropdown. Available in OS and Cloud.

```flow
flow.select "Lagos" from "From";
flow.select "Abuja" from "To";
flow.assert.that {
  "selector": "select[name='from']",
  "condition": "value",
  "value": "Lagos"
};
```

The selected option's value may differ from its label. Assert the application's actual stored value or selected-label element. A custom menu/listbox can expose choices in a portal; Flowstride handles common implementations and focused search, but every widget still needs a unique control and loaded choices.

For dependent country/state/city fields, select the parent before the child and verify the application populated the choices. The correlated `$randomPair[Country]` and `@randomPair[State]`/`@randomPair[City]` helpers use bundled locations; your application must support them.

Read [forms and dates](/guide/forms-and-dates) for a complete travel example and custom-control boundaries, or [targeting](/guide/targeting) for repeated controls.
