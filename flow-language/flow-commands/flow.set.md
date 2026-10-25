# flow.set

Set a field's value directly, useful for controls such as date inputs. Available in OS and Cloud.

```flow
flow.set input "Date" to "2026-11-14";
flow.assert.that {
  "selector": "input[name='date']",
  "condition": "value",
  "value": "2026-11-14"
};
```

Choose a valid date for the application. Native date inputs use `YYYY-MM-DD`, regardless of their display locale. Use a unique input selector if the readable label does not resolve the actual control.

The adapter applies a value setter and dispatches input/change events. This differs from typing a sequence of keystrokes. A widget may still reject the value; verify its resulting state and validation behavior. The calendar fallback finds supported matching day controls and does not universally navigate month/year widgets.

[Forms and dates](/guide/forms-and-dates) combines From/To selections, date input and exact assertions.
