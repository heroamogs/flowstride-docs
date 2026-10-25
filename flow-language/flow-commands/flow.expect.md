# flow.expect

An assertion turns an expected outcome into a check. Use one for each behavior that establishes the test's success.

## Browser checks

```flow
flow.expect visible "Logout";
flow.expect text "Order confirmed";
flow.expect text contains "Order";
flow.expect value input "Email" "reader@example.test";
flow.expect attribute "#order" "data-state" "approved";
flow.expect attribute "#order" "class" contains "selected";
```

Text checks locate visible text; they are not a two-string selector/expected-text command. Value checks compare the input's value exactly. Although the parser accepts a contains marker for value, the current value adapter uses exact comparison; use exact expectations or native `flow.assert.that` with `condition: "value"` and a regex `matches` for another supported comparison.

### Attribute assertions

Attribute assertions check the named DOM attribute in both OS and Cloud.

Exact comparisons are case-sensitive. `contains` checks a substring. The worker polls until the configured timeout for an expected value. A missing attribute fails even when the expected string is empty; an existing empty attribute can match `""`.

```flow
flow.expect attribute "#disabled-button" "disabled" "";
```

HTML boolean attributes often have an empty string value rather than `"true"`. Check the actual DOM contract.

## More native browser conditions

Use [flow.assert.that](/reference/native-browser-commands#retrying-assertions) for enabled/checked/focused state, counts, CSS/properties, accessible names, URLs/titles and storage values. It polls the specified condition without rerunning the preceding action:

```flow
flow.assert.that {
  "selector": "#email",
  "condition": "value",
  "matches": "^reader@",
  "timeout": 5000
};
```

[Waiting and retries](/guide/waiting-and-retries) distinguishes assertion polling from whole-scenario retries.

## API checks

```flow
flow.expect status "201";
flow.expect responseTime lessthan "1000";
flow.expect resBody "user.id" not.empty;
flow.expect resBody "user.active" equals "true";
flow.expect resBody "user" type.of "object" has.key "id";
flow.expect resHeader "content-type" matches "application/json";
```

`responseTime` is measured in milliseconds. Its current adapter check rejects a duration greater than the threshold, so equality at the boundary is accepted despite the `lessthan` spelling. It is not a load/performance benchmark.

Supported body/header/cookie conditions:

| Group | Conditions |
| --- | --- |
| Equality | `equals`, `to.be`, `to.not.be`, `is`, `is.not` |
| Type/format | `type.of`, `format`, `matches` |
| Numeric | `lessthan`, `greaterthan` |
| Length | `length`, `length.greaterthan`, `length.lessthan` |
| Membership | `includes`, `does.not.include`, `has.key`, `does.not.have.key` |
| Empty | `is.empty`, `not.empty` |

For an API substring check, use `matches` with a suitable regular expression. The current lexer treats `contains` as a UI modifier rather than an API condition, so that spelling is not a working API assertion in the native API assertion syntax.

Except the two empty checks, conditions take an expected string. Use dotted/indexed body paths; do not assume a complete JSONPath implementation. Conditions execute on the most recent API adapter state.

## Transcript text

```flow
flow.expect transcript contains "Hello Flowstride. Your order is ready.";
```

Available in OS and Cloud. The command polls the page body's rendered text, comparing after lowercasing, removing punctuation and collapsing whitespace. It checks a contained phrase, not an exact transcript or a word-error score. Your application performs the transcription.

The normalizer keeps ASCII word characters and whitespace. For accented/non-Latin text, or to restrict the check to the new transcript, use a native assertion on a specific result element. A phrase already displayed in instructions or an old transcript could satisfy the whole-page helper. Input/textarea results need a value assertion.

The [audio-to-text guide](/guide/audio-to-text) covers fixture preparation, Chromium microphone input, start/stop controls, timing and scoped transcript assertions.

A failed required assertion fails the scenario. Native CI returns nonzero and records the failure. Do not wrap a required check in `flow.try`.

## Placement and diagnostics

Use `flow.expect` and supported native assertions in an intermediate `And` before `Then`, or put several checks inside the final `Then`. The next declaration after the final block must be another `Scenario`. Required failures fail the attempt; subsequent unexecuted steps are not tested. [Assertions and diagnostics](/guide/assertions-and-diagnostics) explains target checks, actual/expected values, deadlines and file/line evidence. [API testing](/guide/api-testing#assert-a-response-precisely) explains literal versus type negation and chained operators with behavioral examples.
