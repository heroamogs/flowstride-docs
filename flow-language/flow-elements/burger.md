# burger

## Introduction

`burger` is a **Flow Element** that tells Flowstride to locate and interact with a hamburger navigation menu.

Unlike most Flow Elements, `burger` includes built-in detection logic for common hamburger menu implementations. In many applications, Flowstride can locate the menu automatically without requiring you to provide a locator.

---

## Why Use the burger Element?

Hamburger menus are implemented differently across applications.

Some are built using:

- Buttons with an `aria-label`
- Elements with a `title`
- Custom CSS classes
- Custom IDs

Writing locators for these menus can make Scenarios verbose and tightly coupled to the application's implementation.

The `burger` element provides a consistent way to interact with hamburger menus regardless of how they are implemented.

---

## How Flowstride Finds Hamburger Menus

When used without a locator, `burger` activates Flowstride's built-in Smart Burger detection.

Flowstride automatically searches for common hamburger menu implementations used across modern web applications before interacting with the first matching element.

Like every Flow Element, `burger` also participates in:

- Heuristic element matching
- Ambiguity resolution
- Spatial selector resolution

---

## Syntax

### Automatically detect the hamburger menu

```flow
flow.click burger;
```

---

### Use a locator

```flow
flow.click burger "Main Menu";
```

---

## Examples

### Open the application menu

```flow
Feature: Navigation

Scenario: Open the navigation drawer

...

Then "Open the navigation menu"
    flow.click burger;

Then "Verify the menu is displayed"
    flow.expect visible "Products";
```

---

### Login and open the menu

```flow
Feature: User login

Scenario: Successful login

Given "User lands on the login page"
    flow.open "/";

When "User enters a valid username"
    flow.type "Username" "user";

When "User enters a valid password"
    flow.type "Password" "secret";

When "User clicks Login"
    flow.click button "Login";

Then "Open the hamburger menu"
    flow.click burger;
```

---

### Use a locator when multiple menus exist

```flow
...

When "Open the administration menu"
    flow.click burger "Administration";

Then "The administration menu opens"
    flow.expect visible "User Management";
```

---

## Important Notes

::: info Smart Burger Detection

When no locator is supplied, Flowstride automatically searches for common hamburger menu implementations.

In many applications, this allows you to simply write:

```flow
flow.click burger;
```

without needing to inspect the page.

:::

::: info Optional locator

Although `burger` can automatically locate many hamburger menus, you can still provide a locator when multiple menus exist or when you want to target a specific menu.

For example:

```flow
flow.click burger "Main Navigation";
```

:::

::: info Reduces implementation-specific locators

Using the `burger` element allows your Scenario to remain focused on user behaviour rather than CSS classes, IDs, or other implementation details.

:::

---

## Common Mistakes

::: warning Don't use button for hamburger menus

Although many hamburger menus are implemented using HTML buttons, prefer the `burger` element whenever your intent is to open a hamburger navigation menu.

Correct:

```flow
flow.click burger;
```

Instead of:

```flow
flow.click button "Menu";
```

The `burger` element enables Flowstride's built-in hamburger detection.

:::

::: warning Use a locator when multiple hamburger menus exist

If your application contains more than one hamburger menu, provide a locator to identify the correct one.

For example:

```flow
flow.click burger "Administration";
```

:::

---
