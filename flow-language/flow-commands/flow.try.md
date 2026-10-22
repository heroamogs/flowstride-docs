# flow.try

Make an action optional. Its failure is logged without turning that optional action into a required test failure.

```flow
flow.try click "Dismiss announcement";
```

Use it for genuinely optional UI, such as a banner that may not appear. Do not apply it to a required login, data setup or final assertion merely to keep a pipeline green. Optional actions are still subject to the command's target, path and runtime restrictions.
