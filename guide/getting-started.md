# Introduction

Most automation frameworks teach you how to automate a browser.

Flowstride teaches you how to automate a **user journey**.

Before writing your first test, there is one idea that explains almost everything about Flowstride.

> **Flowstride is flow-first.**

That does **not** simply mean it uses a `.flow` file.

It means Flowstride encourages you to automate software the same way a real user experiences it.

Users don't inspect HTML before clicking a button.

They don't search for CSS selectors.

They don't write XPath expressions.

They simply look at the screen.

They see **"Log in"** and click it.

They see **"Email"** and type into it.

They see **"Logout"** and know they have successfully signed in.

Flowstride encourages exactly the same way of thinking.

---

## What Does "Flow-First" Mean?

Flow-first means your automation should describe **what the user sees** and **what the user is trying to accomplish**, rather than how the application is implemented internally.

Consider the following Flowstride scenario.

```flow
Feature: User Login

Scenario: User logs into the application

Given "User lands on home page"
    flow.open "https://www.qacar.online/"

When "User clicks Log in"
    flow.click "Log in" near "Sign up"

When "User enters credentials"
    flow.type "Email" "user@flowstridemail.com"
    flow.type "Password" "Test@12345"

Then "User successfully signs in"
    flow.expect visible "Logout"
```

Take a moment to look at the script.

Did you notice something?

There isn't a single CSS selector.

There isn't a single XPath.

There isn't a single call to inspect the DOM.

Instead, the automation is written using the same information available to the person using the application.

- The user sees **Log in**.
- The user sees **Sign up**.
- The user sees **Email**.
- The user sees **Password**.
- The user sees **Logout**.

That is what **flow-first** means.

Flowstride encourages you to automate what users experience, not what the DOM looks like.

---

## Why This Matters

Traditional browser automation often begins with a question like:

> _"What selector should I use?"_

Flowstride begins with a different question:

> **"What does the user see?"**

That small difference has a surprisingly large impact.

Tests become easier to read.

Reviews become easier.

Maintenance becomes simpler because the automation focuses on the behaviour being validated instead of the implementation details used to locate elements.

As applications evolve, business workflows usually change far less frequently than their HTML structure.

Flowstride is designed around that observation.

---

## More Than Browser Automation

Modern software rarely consists of a browser alone.

A typical workflow might involve:

1. Creating a customer through an API.
2. Approving the customer.
3. Opening the application.
4. Signing in.
5. Retrieving an OTP.
6. Completing verification.
7. Confirming the dashboard is displayed.

Although these actions span multiple systems, they still represent a **single business process**.

Flowstride allows that workflow to be expressed as one continuous flow instead of splitting it across multiple tools or disconnected scripts.

---

## What Is Flowstride?

Flowstride is a **flow-first automation platform**.

It combines three major components that work together.

### A Dedicated Language

Flowstride introduces a language designed specifically for automation.

Rather than writing browser instructions directly in JavaScript or TypeScript, automation is written using `.flow` files that describe complete workflows.

---

### A Structured Runtime

Before a scenario executes, Flowstride validates its structure and prepares it for execution.

During execution, the runtime coordinates the different parts of the automation while maintaining a consistent execution lifecycle.

---

### Automation Engines

Flowstride includes dedicated automation engines responsible for different parts of execution.

At a high level, these engines handle responsibilities such as browser automation, API communication, and execution orchestration while working together as part of the same runtime.

---

## Designed Around Business Workflows

Flowstride encourages tests that answer questions like:

- Can a customer register successfully?
- Can an administrator approve a new account?
- Can a user complete two-factor authentication?
- Can an order be placed successfully?
- Can a payment be verified?

Instead of asking:

- Which selector should I use?
- Which XPath should I copy?
- Which helper function should I write?

The focus shifts from browser mechanics to business behaviour.

---

## Who Is Flowstride For?

Flowstride is designed for teams building and maintaining automated quality assurance solutions.

This includes:

- QA Engineers
- Software Development Engineers in Test (SDETs)
- Automation Engineers
- Developers responsible for automated testing
- Teams building long-lived automation projects

Whether you're automating a small application or a large enterprise platform, Flowstride provides a structured way to express automation that remains readable as projects grow.

---

## How This Documentation Is Organised

This documentation is divided into two main sections.

### Guide

The Guide teaches Flowstride step by step.

If you're new to Flowstride, start here.

Each chapter builds upon concepts introduced in previous chapters.

---

### Reference

The Reference contains detailed documentation for Flowstride commands, syntax, and capabilities.

Once you're familiar with the language, this section becomes your day-to-day reference.

---

:::tip Learn the Concepts First

Flowstride is intentionally different from traditional browser automation frameworks.

Rather than memorising commands, spend a little time understanding the philosophy behind the language first.

Once the core ideas click, the rest of the framework becomes much easier to learn.

:::

---

## What's Next?

The next guide explains the design decisions behind Flowstride and why it approaches automation differently from traditional testing tools.

Understanding that philosophy will make the rest of the documentation much easier to follow.

---

## Next Steps

Continue with:

- [Why Flowstride?](./why-flowstride.md)
- [Core Concepts & Philosophy](./core-concepts.md)
