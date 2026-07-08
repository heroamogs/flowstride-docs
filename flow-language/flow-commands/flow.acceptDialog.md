# flow.acceptDialog

## Introduction

`flow.acceptDialog` is a **Flow Command** that instructs Flowstride to automatically accept the next native browser dialog.

Unlike HTML modals or dialogs that exist within the page, native browser dialogs are created by the browser itself and cannot be located or interacted with using normal UI commands such as `flow.click`.

`flow.acceptDialog` registers a dialog handler before the dialog appears, allowing Flowstride to automatically accept it when it is displayed.

---

## The Problem It Solves

Native browser dialogs such as:

- `alert()`
- `confirm()`
- `prompt()`
- `beforeunload`

are not HTML elements.

They do not exist in the DOM, so commands such as:

```flow
flow.click "OK";
```

or

```flow
flow.expect visible "Are you sure?";
```

cannot interact with them.

Furthermore, Playwright (the browser engine used by Flowstride) automatically dismisses browser dialogs when no dialog handler has been registered.

If your application requires the user to click **OK** before continuing, the workflow can fail because the dialog is dismissed before your test responds.

`flow.acceptDialog` solves this by registering the dialog handler before the dialog is created.

---

## How flow.acceptDialog Works

`flow.acceptDialog` uses an **Event-Driven Pre-emptive Hook** to handle browser dialogs.

Rather than waiting for the dialog to appear, Flowstride prepares the browser in advance by registering an internal dialog handler.

### Register the Dialog Handler

When executed, `flow.acceptDialog` installs a dialog handler within the active browser context.

Whenever the next browser dialog appears, the handler immediately accepts it.

Because the dialog is handled as a browser event rather than a DOM element, no UI interaction is required.

---

### Automatic Acceptance

When the browser displays a dialog, Flowstride immediately executes the equivalent of pressing **OK**.

This works for native browser dialogs including alerts, confirmations, prompts, and page unload confirmations.

---

## Syntax

```flow
flow.acceptDialog;
```

---

## Parameters

This command does not accept any parameters.

---

## Supported Browser Dialogs

`flow.acceptDialog` can be used with native browser dialogs, including:

- `alert()`
- `confirm()`
- `prompt()`
- `beforeunload`

---

## Examples

### Accept a confirmation dialog

```flow
Feature: Record Management

Scenario: Delete a user account

Given "Open the user settings page"
  flow.open "/settings/users";

When "Accept the next confirmation dialog"
  flow.acceptDialog;

When "Delete the account"
  flow.click button "Delete Account";

Then "Verify the account was removed"
  flow.expect visible "Account successfully deleted";
```

---

### Accept an alert dialog

```flow
Feature: Profile Management

Scenario: Save profile changes

Given "Open the profile page"
  flow.open "/profile";

When "Accept the success alert"
  flow.acceptDialog;

Then "Save the changes"
  flow.click button "Save";
```

---

## When to Use flow.acceptDialog

Use `flow.acceptDialog` whenever the application displays a native browser dialog that should be accepted automatically.

Typical examples include:

- Delete confirmations
- Browser alerts
- Confirmation dialogs
- Prompt dialogs
- Unsaved changes warnings
- Browser unload confirmations

---

## Important Notes

::: warning Register the handler before triggering the dialog

Native browser dialogs block JavaScript execution.

Always call `flow.acceptDialog` **before** the action that causes the dialog to appear.

Correct:

```flow
flow.acceptDialog;

flow.click button "Delete Account";
```

Incorrect:

```flow
flow.click button "Delete Account";

flow.acceptDialog;
```

By the time the second example executes, the dialog has already been handled by the browser.

:::

::: warning Prompt text is not currently supported

Although `flow.acceptDialog` accepts native `prompt()` dialogs, the current implementation does not provide a value to the prompt.

It simply accepts the dialog using the browser's default behavior.

:::

---

## Common Mistakes

::: warning Do not use UI commands for browser dialogs

Browser dialogs are not part of the DOM.

The following will not work:

```flow
flow.click "OK";
```

Instead, register a dialog handler before the dialog appears.

```flow
flow.acceptDialog;

flow.click button "Delete";
```

:::

---
