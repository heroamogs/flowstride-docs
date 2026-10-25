# flow.hover

Move the pointer over a target and trigger hover behavior without clicking. Available in OS and Cloud.

```flow
flow.hover "Products";
flow.expect visible "Browse categories";
flow.click "Browse categories";
```

Assert the menu/tooltip before selecting an item. Use a separate click for the intended selection. A hover-only test can additionally assert that a click-side effect did not occur.

Readable targets, qualifiers and spatial scopes follow [the targeting guide](/guide/targeting). Phone emulation does not make hover a physical touchscreen gesture; test your application's touch alternative separately.
