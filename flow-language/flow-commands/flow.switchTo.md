# flow.switchTo

## Introduction

`flow.switchTo` is a **Flow Command** that changes the browser's active execution context.

It allows a Flow Scenario to continue interacting with content that exists outside the current page, such as newly opened browser tabs, popup windows, or embedded iframes.

Rather than requiring testers to manage browser contexts manually, `flow.switchTo` automatically locates and activates the requested target.

---

## The Problem It Solves

Web applications do not always live within a single browser page.

Modern workflows frequently involve:

- Opening a new browser tab.
- Launching popup windows.
- Embedding third party applications inside secure iframes.

Examples include:

- OAuth authentication (Google, Microsoft, GitHub)
- Stripe payment forms
- Paystack checkout
- Embedded chat widgets
- PDF viewers
- External dashboards

By default, browser automation engines remain attached to the currently active page.

If a new tab opens, the automation continues interacting with the old tab.

Likewise, elements inside secure iframes cannot be located until the execution context switches into that frame.

`flow.switchTo` removes this complexity.

---

## How flow.switchTo Works

`flow.switchTo` acts as Flowstride's context router.

When executed, the Web Adapter determines what kind of target has been supplied and switches execution accordingly.

### Smart Target Resolution

Flowstride analyses the supplied target and determines whether it represents:

- the most recently opened tab (`next`)
- a specific browser tab or popup window
- an iframe
- the original page (`main`)

If the target is `"next"`, Flowstride automatically waits for a new tab or window to open and instantly switches execution focus to it, regardless of its URL.

If the target represents a specific browser page, Flowstride searches the active browser context for a page whose URL or title matches the supplied value and brings it to the foreground.

If the target represents an iframe, Flowstride switches execution into that frame, allowing subsequent commands to interact directly with its contents.

---

### Telemetry Synchronisation

Changing browser contexts can interrupt browser telemetry such as execution recording.

Immediately after switching contexts, Flowstride automatically reconnects its internal recording session to the newly active page.

This ensures that screenshots, execution artifacts, and video recordings continue seamlessly across tabs and windows without requiring any additional Flow commands.

---

## Syntax

### Switch to the newest opened tab

```flow
flow.switchTo "next";
```

### Switch to a specific URL or Title

```flow
flow.switchTo "accounts.google.com";
```

### Return to the main page

```flow
flow.switchTo "main";
```

---

## Parameters

| Parameter | Required | Description                                                                                                          |
| :-------- | :------: | :------------------------------------------------------------------------------------------------------------------- |
| Target    |    ✅    | Use `"next"` for new tabs, `"main"` for the original page, or supply a specific URL, page title, or iframe selector. |

---

## Examples

### Switch to a newly opened browser tab dynamically

Use the `next` keyword when clicking a link opens a new tab, and you do not want to hardcode the destination URL.

```flow
Feature: External Navigation

Scenario: Verify external link opens in a new tab

Given "The user is on the dashboard"
  flow.open "/dashboard";

When "The user clicks the support link"
  flow.click link "Help Centre";

And "Switch to the newly opened tab"
  flow.switchTo "next";

Then "Verify the support page loaded"
  flow.expect visible "How can we help you today";
```

---

### Switch to a specific tab by URL

```flow
Feature: Google Authentication

Scenario: Sign in with Google

Given "Open the login page"
  flow.open "/login";

When "Open the Google authentication page"
  flow.click button "Sign in with Google";

And "Switch to the Google tab"
  flow.switchTo "accounts.google.com";

Then "Enter the email address"
  flow.type input "Email" "user@example.com";
```

---

### Switch into a secure payment iframe

```flow
Feature: Subscription Checkout

Scenario: Enter payment details

Given "Open the checkout page"
  flow.open "/checkout/pro-plan";

When "Switch into the Stripe payment frame"
  flow.switchTo "iframe[title='Secure payment input frame']";

And "Enter the card number"
  flow.type input "Card Number" "4242 4242 4242 4242";

Then "Return to the main page"
  flow.switchTo "main";
```

---

## When to Use flow.switchTo

Use `flow.switchTo` whenever the application moves the user into a different browser context.

Typical examples include:

- OAuth login pages
- Browser popups
- Newly opened tabs (using `"next"`)
- Embedded payment gateways
- Embedded chat widgets
- Third party dashboards
- Secure iframes

---

## Why It Is Resilient

One of the biggest advantages of `flow.switchTo` is that it manages browser context changes without disrupting test execution.

Whether the application opens:

- a new browser tab,
- a popup window,
- or an embedded iframe,

the same Flow Command automatically locates the requested target and transfers execution to it.

Flowstride also reconnects its internal execution recording after every context switch, ensuring screenshots, video recordings, and execution artifacts remain continuous throughout the Scenario.

---

## Common Mistakes

::: warning Remember to return to the main page

After interacting with an iframe, return to the primary page before continuing.

```flow
flow.switchTo "main";
```

:::

::: warning Switch after the new tab opens

`flow.switchTo` expects the target page or iframe to exist.

Ensure the action that opens the new tab or popup has completed before switching. Using `"next"` automatically includes a brief waiting period to allow the browser to render the new tab.

:::
