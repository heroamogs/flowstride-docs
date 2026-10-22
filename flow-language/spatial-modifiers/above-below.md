# above / below / under

Choose a target by its vertical relationship to an anchor.

```flow
flow.type input "Amount" below "Total" "500";
```

The relationship belongs to the target selector, before any text value to type. Use a visible, distinguishable anchor and verify that layout changes still identify the intended target. A relationship cannot resolve a genuinely indistinguishable set of repeated controls by intent alone.

Use [element qualifiers](/flow-language/flow-elements/button) or a stable selector where they make the test clearer.
