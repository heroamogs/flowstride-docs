# leftOf / rightOf

Choose a target by its horizontal relationship to an anchor.

```flow
flow.click button "Edit" rightOf "Delivery address";
```

The relationship belongs to the target selector, before any text value to type. Use a visible, distinguishable anchor and verify that layout changes still identify the intended target. A relationship cannot resolve a genuinely indistinguishable set of repeated controls by intent alone.

Use [element qualifiers](/flow-language/flow-elements/button) or a stable selector where they make the test clearer.
