# flow.open

## Introduction

`flow.open` is a **Flow Command** that navigates the active browser to a web page.

It is typically the first UI command executed in a Scenario and establishes the starting point for all subsequent interactions.

Unlike manually constructing URLs, `flow.open` understands both **absolute URLs** and **application-relative paths**, allowing Scenarios to remain portable across different environments.

---

## Syntax

```flow
flow.open "<url>";
```

or

```flow
flow.open "<relative-path>";
```

---

## Parameters

| Parameter   | Required | Description                                                                             |
| ----------- | :------: | --------------------------------------------------------------------------------------- |
| URL or Path |    ✅    | The destination to navigate to. Can be an absolute URL or a path relative to `baseUrl`. |

---

## How It Works

When `flow.open` executes, Flowstride determines whether the supplied value is:

- an **absolute URL** (for example, `https://example.com`), or
- a **relative path** (for example, `/login`).

If a relative path is supplied, Flowstride combines it with the configured `baseUrl` before navigating.

The page is then opened and Flowstride waits until the page reaches the **DOM Content Loaded** state before continuing with the next command.

---

## Examples

### Open a relative page

```flow
Feature: Login

Scenario: Open the login page

Given "Navigate to Login"

  flow.open "/login";
```

Assuming the configuration contains:

```yaml
baseUrl: https://www.qacar.online
```

Flowstride navigates to:

```text
https://www.qacar.online/login
```

---

### Open an absolute URL

```flow
Given "Open Google"

  flow.open "https://www.google.com";
```

Because an absolute URL is supplied, `baseUrl` is ignored.

---

### Open the application home page

```flow
Given "Open the application"

  flow.open "/";
```

When `baseUrl` is configured, this opens the application's root page.

---

## Common Use Cases

Use `flow.open` to:

- Navigate to the application's home page.
- Open login pages.
- Navigate directly to dashboards.
- Open external websites.
- Begin a new browser workflow.

---

## Common Mistakes

::: warning Relative paths require a configured `baseUrl`

When using relative paths such as:

```flow
flow.open "/dashboard";
```

ensure that `baseUrl` has been configured successfully.

:::

---
