# Why Flowstride?

If Playwright already exists...

If Cypress already exists...

If Selenium already exists...

**Why build Flowstride?**

It's a fair question.

The answer is surprisingly simple.

**Flowstride was never created to replace browser automation frameworks.**

It was created to replace the **automation infrastructure** that almost every team eventually builds around them.

---

## Automation Has a Hidden Cost

When teams first adopt an automation framework, everything feels straightforward.

Open a browser.

Locate an element.

Click it.

Assert the result.

As the project grows, however, something interesting happens.

The automation framework slowly becomes only a small part of the project.

Around it, teams begin building their own ecosystem.

Projects gradually accumulate:

- Authentication helpers
- Session management
- API wrappers
- Environment handling
- Utility functions
- Reporting systems
- Test data generators
- Retry logic
- Browser configuration
- Execution pipelines

None of these are problems.

In fact, they're often necessary.

The challenge is that **every team builds them differently**.

Two companies using the same browser automation framework can end up with completely different architectures, coding standards, and execution models.

Over time, maintaining that infrastructure becomes just as expensive as maintaining the tests themselves.

---

## Flowstride Starts From a Different Question

Most automation tools begin with a browser.

Flowstride begins with the **user**.

Instead of asking:

> _"How do I click this button?"_

Flowstride asks:

> **"What is the user trying to accomplish?"**

That small shift influences the entire platform.

Instead of building tests around browser instructions, Flowstride encourages you to describe complete business workflows.

---

## Automate What Users See

One of the core ideas behind Flowstride is remarkably simple.

Users don't inspect the DOM before interacting with an application.

They don't search for CSS selectors.

They don't copy XPath expressions.

They simply look at the page.

They see:

- **Log in**
- **Email**
- **Password**
- **Logout**

and interact with those elements naturally.

Flowstride encourages the same mindset.

Instead of describing _how_ to locate an element, you describe **what the user sees**.

```flow
flow.click "Log in"

flow.type "Email" "user@flowstridemail.com"

flow.type "Password" "Test@12345"

flow.expect visible "Logout"
```

The script reads like the actions a real user performs.

Not the implementation details of the page.

---

## Describe Workflows, Not Browser Instructions

Most real-world automation is larger than a single page interaction.

Consider a customer onboarding journey.

A new user registers.

An administrator approves the account.

An OTP is sent.

The user verifies the OTP.

The dashboard becomes available.

This entire sequence represents **one business process**.

Flowstride encourages writing automation that reflects that process.

Instead of thinking in isolated browser actions, you think in complete user journeys.

---

## Browser and API Automation Belong Together

Modern applications rarely live entirely inside a browser.

Many workflows begin with backend preparation.

For example:

- Creating test data.
- Approving users.
- Generating access tokens.
- Preparing application state.

Traditional automation often separates API testing and browser testing into different tools or different projects.

Flowstride treats them as different steps within the same flow.

A workflow can move naturally between backend operations and browser interactions without changing tools or execution context.

Because that's how the business process actually works.

---

## A Language Designed for Automation

Flowstride introduces its own automation language.

That decision wasn't made simply to create different syntax.

It exists because automation has requirements that are different from general-purpose programming.

By providing a dedicated language, Flowstride can:

- Validate scenarios before execution.
- Enforce consistent test structure.
- Produce clearer error messages.
- Encourage readable automation.
- Build richer execution metadata.

Rather than every project inventing its own conventions, the language establishes a common foundation.

---

## Consistency Scales Better Than Convention

As automation projects grow, consistency becomes increasingly valuable.

A new engineer should be able to open any Flowstride project and immediately recognise its structure.

Features look familiar.

Scenarios follow the same lifecycle.

Automation reads consistently across teams.

That consistency reduces onboarding time, simplifies code reviews, and makes long-term maintenance easier.

---

## Flowstride Is More Than a Browser Driver

Flowstride consists of more than browser automation.

It combines:

- A dedicated automation language.
- A structured execution runtime.
- Browser automation.
- API automation.
- Execution orchestration.

Together, these components provide a single platform for expressing, executing, and understanding automated workflows.

---

## What Flowstride Is Not

:::info Understanding Flowstride

Flowstride is **not** a replacement for browser automation engines or HTTP clients.

Instead, it provides a higher-level language and execution model that coordinate those technologies into a single automation workflow.

Its goal is not to replace proven automation engines, it is to make building, reading, and maintaining automation significantly easier.

:::

---

## The Philosophy in One Sentence

If there is one sentence that captures the philosophy behind Flowstride, it is this:

> **Automate what users see. Describe what users do. Let Flowstride handle the journey.**

Everything else in the platform exists to support that idea.

---

## What's Next?

Now that you understand why Flowstride was created, the next step is to learn the concepts that shape every Flowstride script.

You'll see how Features, Scenarios, and Flowstride's execution lifecycle work together to produce predictable, readable automation.

---

## Next Steps

Continue with:

- [Core Concepts & Philosophy](./core-concepts.md)
- [Your First Script](./your-first-script.md)
