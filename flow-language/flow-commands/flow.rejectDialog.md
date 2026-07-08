# flow.rejectDialog

## Introduction

`flow.rejectDialog` is a **Flow Command** that instructs Flowstride to automatically dismiss the next native browser dialog.

Like `flow.acceptDialog`, it works with browser dialogs that exist outside the DOM. Instead of accepting the dialog, it automatically performs the equivalent of selecting **Cancel** or dismissing the dialog whenever one appears.

---

## The Problem It Solves

Native browser dialogs such as:

- `alert()`
- `confirm()`
- `prompt()`
- `beforeunload`

are created by the browser itself rather than the web page.

Because they are not HTML elements, they cannot be located or interacted with using normal Flow Commands such as:

```flow
flow.click "Cancel";
```

or

```flow
flow.expect visible "Discard changes?";
```

When your application specifically expects the user to reject a confirmation dialog, you should make that behavior explicit by registering `flow.rejectDialog` before the dialog is triggered.

---

## How flow.rejectDialog Works

`flow.rejectDialog` uses an **Event-Driven Pre-emptive Hook** to manage native browser dialogs.

Rather than attempting to interact with a dialog after it appears, Flowstride prepares the browser in advance by registering an internal dialog handler.

### Register the Dialog Handler

When executed, `flow.rejectDialog` installs a dialog handler within the active browser context.

Whenever a native browser dialog appears, Flowstride immediately dismisses it without requiring any DOM interaction.

---

### Automatic Rejection

When the browser displays a dialog, Flowstride automatically dismisses it.

This is equivalent to selecting **Cancel** on confirmation dialogs or rejecting the dialog where applicable.

---

## Syntax

```flow
flow.rejectDialog;
```

---

## Parameters

This command does not accept any parameters.

---

## Supported Browser Dialogs

`flow.rejectDialog` can be used with native browser dialogs, including:

- `alert()`
- `confirm()`
- `prompt()`
- `beforeunload`

---

## Examples

### Reject a deletion confirmation

```flow
Feature: Record Management

Scenario: Cancel account deletion

Given "Open the user settings page"
  flow.open "/settings/users";

When "Reject the next confirmation dialog"
  flow.rejectDialog;

When "Attempt to delete the account"
  flow.click button "Delete Account";

Then "Verify the account still exists"
  flow.expect visible "Delete Account";
```

---

### Cancel navigation away from a page

```flow
Feature: Profile Management

Scenario: Keep unsaved changes

Given "Edit the profile"
  flow.open "/profile";

When "Reject the browser confirmation"
  flow.rejectDialog;

When "Attempt to leave the page"
  flow.click link "Dashboard";

Then "Remain on the current page"
  flow.expect visible "Unsaved Changes";
```

---

## When to Use flow.rejectDialog

Use `flow.rejectDialog` whenever the application displays a native browser dialog that should be dismissed instead of accepted.

Typical examples include:

- Cancel deletion confirmations
- Reject destructive actions
- Remain on pages with unsaved changes
- Dismiss confirmation dialogs
- Test cancellation workflows

---

## Important Notes

::: warning Register the handler before triggering the dialog

Native browser dialogs block JavaScript execution.

Always call `flow.rejectDialog` **before** the action that causes the dialog to appear.

Correct:

```flow
flow.rejectDialog;

flow.click button "Delete Account";
```

Incorrect:

```flow
flow.click button "Delete Account";

flow.rejectDialog;
```

By the time the second example executes, the dialog has already been handled by the browser.

:::

::: warning Prompt text is not currently supported

When dismissing a native `prompt()` dialog, Flowstride does not provide any input value.

The dialog is simply dismissed.

:::

---

## Common Mistakes

::: warning Do not use UI commands for browser dialogs

Browser dialogs are not part of the DOM.

The following will not work:

```flow
flow.click "Cancel";
```

Instead, register the dialog handler before the dialog appears.

```flow
flow.rejectDialog;

flow.click button "Delete";
```

:::

---
