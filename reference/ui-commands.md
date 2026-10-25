# Browser command index

| Task | Commands |
| --- | --- |
| Navigate | [open](/flow-language/flow-commands/flow.open), [switchTo](/flow-language/flow-commands/flow.switchTo), [close](/flow-language/flow-commands/flow.close) |
| Interact | [click](/flow-language/flow-commands/flow.click), [hover](/flow-language/flow-commands/flow.hover), [drag](/flow-language/flow-commands/flow.drag) |
| Enter data | [type](/flow-language/flow-commands/flow.type), [set](/flow-language/flow-commands/flow.set), [passcode](/flow-language/flow-commands/flow.passcode) |
| Choose | [select](/flow-language/flow-commands/flow.select), [check](/flow-language/flow-commands/flow.check), [uncheck](/flow-language/flow-commands/flow.uncheck) |
| Search tables, click cells and row actions | [Table and cell testing](/guide/table-testing), [table elements](/flow-language/flow-elements/table) |
| Audio-to-text testing | [Audio workflow](/guide/audio-to-text), [injectAudio](/flow-language/flow-commands/flow.injectAudio), [waitForPipeline](/flow-language/flow-commands/flow.waitForPipeline), [transcript checks](/flow-language/flow-commands/flow.expect#transcript-text) |
| Upload | [upload](/flow-language/flow-commands/flow.upload) |
| Download and inspect files | [download arm/save/expect](/reference/native-browser-commands#downloads) |
| Independent users and context settings | [browser profiles](/reference/native-browser-commands#profiles-and-runtime-settings) |
| Mock and observe browser requests | [network routes/events](/reference/native-browser-commands#network-routes-and-events) |
| Wait for a condition | [flow.assert.that](/reference/native-browser-commands#retrying-assertions) |
| Control browser time/functions | [clock](/reference/native-browser-commands#browser-clock), [spies and stubs](/reference/native-browser-commands#function-spies-and-stubs) |
| Inspect traces and replay traffic | [trace/HAR](/reference/native-browser-commands#traces-and-har) |
| Accessibility/ARIA | [a11y scan/snapshot/match](/reference/native-browser-commands#accessibility-and-aria) |
| Component lifecycle | [component mount/update/unmount](/reference/native-browser-commands#components) |
| Assert/extract | [expect](/flow-language/flow-commands/flow.expect), [extract](/flow-language/flow-commands/flow.extract) |
| Reuse state | [save](/flow-language/flow-commands/flow.save), [use](/flow-language/flow-commands/flow.use) |
| Handle dialogs | [acceptDialog](/flow-language/flow-commands/flow.acceptDialog), [rejectDialog](/flow-language/flow-commands/flow.rejectDialog) |
| Optional/forced behavior | [try](/flow-language/flow-commands/flow.try), [forceClick](/flow-language/flow-commands/flow.forceClick), [forceType](/flow-language/flow-commands/flow.forceType) |

Choose visible labels first, then [element qualifiers](/flow-language/flow-elements/button) and [spatial relationships](/flow-language/spatial-modifiers/near) to resolve ambiguity. Use stable selectors when the UI does not offer a distinct label.

Forced interactions are escape hatches. They can bypass actionability checks and should not replace a normal user journey. Use the [native workflow guide](/guide/native-browser-workflows) for complete ordering examples and [capabilities](/reference/capabilities) for the remaining boundaries.

## Workflow guides

[Targeting](/guide/targeting) · [Forms and dates](/guide/forms-and-dates) · [Tabs and iframes](/guide/tabs-and-iframes) · [Email OTP](/guide/email-otp) · [Assertions and diagnostics](/guide/assertions-and-diagnostics) · [Included runnable examples](/guide/working-examples)
