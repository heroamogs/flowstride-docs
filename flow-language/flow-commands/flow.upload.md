# flow.upload

## Introduction

`flow.upload` is a **Flow Command** that uploads one or more files into a web application.

It is designed to solve one of the most challenging aspects of modern web automation: Interacting with custom file upload components.

Unlike traditional automation tools that rely on visible `<input type="file">` elements, `flow.upload` works with both standard file inputs and custom upload controls without requiring DOM-specific implementation details.

---

## Why flow.upload Exists

Modern web applications rarely expose a visible file input.

Instead, developers often replace it with custom components such as:

- Styled upload buttons
- Drag-and-drop zones
- Image upload widgets
- React or Vue upload components

Clicking these controls typically opens the operating system's native file picker.

Traditional automation tools often struggle with these dialogs because they exist outside the browser.

`flow.upload` was created to eliminate this complexity.

---

## Syntax

```flow
flow.upload "<locator>" "<file-path>";
```

```flow
flow.upload <element> "<locator>" "<file-path>";
```

---

## Parameters

| Parameter | Required | Description                                                                |
| --------- | :------: | -------------------------------------------------------------------------- |
| Element   | Optional | Narrows the search to a specific Flow Element such as `button` or `input`. |
| Locator   |    ✅    | Identifies the upload control.                                             |
| File Path |    ✅    | Relative or absolute path to the file to upload.                           |

---

## How flow.upload Works

### 1. Resolve the file path

Before interacting with the browser, Flowstride resolves the supplied file path relative to the current working directory.

If the file cannot be found, execution stops immediately with a clear error message before attempting the upload.

---

### 2. Locate the upload control

Flowstride locates the specified upload element using its natural language locator engine.

For example:

```flow
flow.upload button "Upload Invoice" "artifacts/invoices/march-2026.pdf";
```

---

### 3. Intercept the file chooser

Instead of waiting for the operating system's file picker to appear, Flowstride intercepts Playwright's internal `filechooser` event.

The selected file is injected directly into the browser, allowing the upload to continue without interacting with the native operating system dialog.

---

### 4. Automatic fallback

Some applications do not trigger a native file chooser event.

In these situations, Flowstride automatically falls back to directly assigning the file to the underlying file input element.

This allows the same Flow script to work across different upload implementations.

---

## Examples

### Upload using a standard file input

```flow
Feature: User Profile

Scenario: Update profile picture

Given "Open the profile settings"
  flow.open "/settings/profile";

When "Upload a new avatar"
  flow.upload input "Avatar Upload" "test_data/images/new-avatar.png";

Then "Verify the upload succeeded"
  flow.expect visible "Avatar updated successfully";
```

---

### Upload using a custom button

```flow
Feature: Document Management

Scenario: Upload an invoice

Given "Open the billing dashboard"
  flow.open "/dashboard/billing";

When "Upload the invoice"
  flow.upload button "Upload Invoice" "artifacts/invoices/march-2026.pdf";

Then "Submit the document"
  flow.click button "Submit Document";
```

---

## Why It Is Resilient

`flow.upload` adapts automatically to different upload implementations.

Whether an application uses:

- A standard `<input type="file">`
- A custom upload button
- A drag-and-drop component
- A React or Vue upload widget

the same Flow script continues to work.

The complexity of interacting with hidden inputs and native file dialogs is handled internally by the Flowstride engine.

---

## Common Mistakes

::: warning Verify that the file exists

Flowstride validates the supplied file path before attempting the upload.

Ensure the file exists relative to your current working directory.

:::

::: warning Target the upload control, not the hidden input

Most modern applications hide the actual file input.

Instead of trying to locate the hidden DOM element, target the visible control the user interacts with.

```flow
flow.upload button "Upload Invoice" "invoice.pdf";
```

This keeps the Scenario aligned with real user behaviour while allowing Flowstride to handle the underlying implementation.

:::

---
