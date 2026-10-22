# Browser command index

| Task | Commands |
| --- | --- |
| Navigate | [open](/flow-language/flow-commands/flow.open), [switchTo](/flow-language/flow-commands/flow.switchTo), [close](/flow-language/flow-commands/flow.close) |
| Interact | [click](/flow-language/flow-commands/flow.click), [hover](/flow-language/flow-commands/flow.hover), [drag](/flow-language/flow-commands/flow.drag) |
| Enter data | [type](/flow-language/flow-commands/flow.type), [set](/flow-language/flow-commands/flow.set), [passcode](/flow-language/flow-commands/flow.passcode) |
| Choose | [select](/flow-language/flow-commands/flow.select), [check](/flow-language/flow-commands/flow.check), [uncheck](/flow-language/flow-commands/flow.uncheck) |
| Upload | [upload](/flow-language/flow-commands/flow.upload) |
| Assert/extract | [expect](/flow-language/flow-commands/flow.expect), [extract](/flow-language/flow-commands/flow.extract) |
| Reuse state | [save](/flow-language/flow-commands/flow.save), [use](/flow-language/flow-commands/flow.use) |
| Handle dialogs | [acceptDialog](/flow-language/flow-commands/flow.acceptDialog), [rejectDialog](/flow-language/flow-commands/flow.rejectDialog) |
| Optional/forced behavior | [try](/flow-language/flow-commands/flow.try), [forceClick](/flow-language/flow-commands/flow.forceClick), [forceType](/flow-language/flow-commands/flow.forceType) |

Choose visible labels first, then [element qualifiers](/flow-language/flow-elements/button) and [spatial relationships](/flow-language/spatial-modifiers/near) to resolve ambiguity. Use stable selectors when the UI does not offer a distinct label.

Forced interactions are escape hatches. They can bypass actionability checks and should not replace a normal user journey. Browser-engine power does not imply that every Playwright feature has a native command.
