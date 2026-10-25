# Find the right control

Start with a readable label. Add enough detail to identify the intended control when a page repeats the same text. These actions are available in OS and Cloud.

## Choose a target deliberately

| Page situation | Example | Why |
| --- | --- | --- |
| Distinct button text | `flow.click button "Login";` | Limits the search to button-like controls |
| Distinct input placeholder | `flow.type input "Email" "reader@example.test";` | Uses supported input heuristics |
| Repeated label beside a heading | `flow.click "Edit" near "Billing address";` | Adds a spatial anchor |
| Repeated action in a record | `flow.click button "View" inside "#order-102";` | Scopes the action to the record |
| Stable test attribute | `flow.click "[data-testid='save-profile']";` | Uses an explicit selector |
| Repeated identical controls | `flow.click "Edit[1]";` | Selects a zero-based occurrence; order must be stable |
| A table coordinate | `flow.click "table[0] tr[2] td[0]";` | Uses zero-based table/row/cell positions |

Readable targeting uses heuristics over text, attributes, wrapped labels and nearby controls. It is not identical to Playwright's accessibility-role lookup. For an exact accessible role/name check, use `flow.assert.that` with `role` and `name`.

## Input qualifiers and placeholders

```flow
flow.type input "Enter your email" "{{env.TEST_EMAIL}}";
flow.type placeholder "Enter your email" "{{env.TEST_EMAIL}}";
```

The explicit `placeholder` form resolves a placeholder. An `input` qualifier uses a narrower input-specific search; not every external `<label for>` arrangement is equivalent to a wrapped label in that path. If a readable target is ambiguous or absent, inspect the control and use a stable selector:

```flow
flow.type "input[name='email']" "{{env.TEST_EMAIL}}";
flow.assert.that {
  "selector": "input[name='email']",
  "condition": "value",
  "value": "{{env.TEST_EMAIL}}"
};
```

Typing can tolerate application formatting, such as punctuation removal. Pair it with an exact value assertion when format matters.

## Spatial relationships

Use `near`, `above`, `below`/`under`, `leftOf`, `rightOf`, and `inside`/`in` to distinguish controls. These depend on rendered layout or containment. A viewport change can alter the geometry.

```flow
flow.click "Log in" near "Sign up";
flow.click button "Start SOAP" inside "table[0] tr[1] td[9]";
flow.click "My SOAPs" rightOf "My Appointments";
```

Choose one clear relationship and a unique anchor. Do not assume arbitrary chains of several spatial clauses have a defined constraint-solving meaning. A record selector is usually more stable than geometry when the relationship is logical rather than visual.

## Explicit selectors

Raw CSS and supported Playwright selector prefixes such as `css=`, `text=` and `xpath=` bypass parts of the readable-target heuristic. Keep selectors understandable and verify the result of the action. Raw selectors target the current page; they do not instruct every action to search all iframes. [Frames need their own scope](/guide/tabs-and-iframes).

If Flowstride reports ambiguity, qualify the element, scope it to a record, or use a stable selector. A forced click bypasses actionability protections; it does not explain which of several identical records you intended.

Try [the table example](/guide/working-examples) to practice row-based selection and extraction, then read [forms and dates](/guide/forms-and-dates) for complete input workflows.
