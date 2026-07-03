# Core Concepts & Philosophy

Before learning individual commands, it is important to understand how Flowstride thinks.

Most automation frameworks teach you browser APIs.

Flowstride teaches you how to describe software.

That might sound like a small distinction, but it influences almost every part of the framework.

Instead of beginning with browser mechanics, selectors, HTTP clients, response parsing, and helper utilities, Flowstride encourages you to begin with the **business workflow**.

Once you describe the workflow, the runtime takes responsibility for executing it.

This philosophy appears throughout the framework.

It influences:

- how tests are written,
- how elements are located,
- how API requests are executed,
- how variables are generated,
- how assertions work,
- and even how reports are produced.

If you understand the ideas in this chapter, every other part of Flowstride becomes significantly easier to learn.

---

# The Eight Principles of Flowstride

Flowstride is built around eight core principles.

These principles explain **why** the language behaves the way it does.

1. Flow-First Thinking
2. User-Visible Automation
3. Progressive Precision
4. Structured Execution
5. End-to-End Flow Automation
6. Native Test Data Engine
7. Context-Aware Assertions
8. Readability Before Cleverness

As you continue through this guide, you'll see these ideas appear again and again.

---

# 1. Flow-First Thinking

Flowstride is a **flow-first** automation platform.

This phrase appears throughout the documentation because it describes the philosophy of the framework.

Flow-first does **not** mean:

- writing BDD syntax,
- using `.flow` files,
- or following a particular folder structure.

Instead, it means something much more fundamental.

> **Describe the user's journey before thinking about the implementation.**

Traditional browser automation often begins with technical questions.

- Which selector should I use?
- Which locator is more reliable?
- Which helper function should I call?
- Which request library should I import?

Flowstride begins somewhere completely different.

It asks a single question.

> **What is the user trying to accomplish?**

Everything else is built around that answer.

---

## Think Like a User

Imagine a customer registering for a banking application.

From the customer's perspective, the journey might look like this.

```text
Open the application
        ↓
Create an account
        ↓
Receive an OTP
        ↓
Enter the OTP
        ↓
Complete verification
        ↓
Access the dashboard
```

Notice that nothing in this description mentions:

- CSS selectors,
- Playwright locators,
- API clients,
- cookies,
- browser contexts,
- response parsing,
- or DOM traversal.

It simply describes the workflow.

Flowstride encourages you to write automation exactly the same way.

---

## A Flow Instead of a Script

Consider the following example.

```flow
Feature: User Login

Scenario: User signs into the application

Given "User lands on home page"
    flow.open "/"

When "User clicks Log in"
    flow.click "Log in" near "Sign up"

When "User enters credentials"
    flow.type "Email" "user@flowmail.com"
    flow.type "Password" "Password123"

Then "Dashboard becomes visible"
    flow.expect visible "Logout"
```

Read the scenario from top to bottom again.

It tells a story.

You don't need to know how the browser is implemented.

You don't need to know which automation engine executes it.

The workflow itself communicates the behaviour being validated.

That is the essence of flow-first thinking.

---

## Why This Matters

Automation projects rarely stay small.

As teams grow, dozens—or even hundreds—of engineers may contribute to the same test suite.

When every engineer structures automation differently, maintaining the project becomes increasingly difficult.

Flowstride solves this by encouraging everyone to describe workflows using the same language.

The result is automation that is easier to:

- read,
- review,
- maintain,
- discuss,
- and extend.

Flowstride isn't trying to remove technical detail.

It is trying to place technical detail behind the workflow rather than in front of it.

---

# 2. User-Visible Automation

Once you start thinking in workflows, another question naturally follows.

How should those workflows interact with the application?

Most browser automation frameworks answer this question by introducing selectors.

Flowstride answers it differently.

> **Automate what the user sees.**

That simple idea shapes one of the most recognisable parts of the language.

---

## The Traditional Approach

Imagine you're asked to automate this page.

A traditional workflow often looks like this.

```text
Open DevTools
        ↓
Inspect Element
        ↓
Copy CSS Selector
        ↓
Write Automation
```

The automation is built around the HTML implementation.

If the implementation changes, the automation often changes with it.

---

## The Flowstride Approach

Flowstride begins with something much simpler.

Open the application.

Look at the page.

Describe what you see.

For example:

```flow
flow.click "Log in"

flow.type "Email" "user@flowmail.com"

flow.type "Password" "Password123"

flow.expect visible "Logout"
```

Notice what is missing.

There is:

- no CSS selector,
- no XPath,
- no copied locator,
- no DOM inspection by the test author.

Instead, the automation is written using the same information available to the person using the application.

The user sees:

- **Log in** (as text in a button)
- **Email** (as input placeholder)
- **Password** (as input placeholder)
- **Logout** (as text in a button)

So that's what the automation describes.

---

## What Happens Behind the Scenes?

This does **not** mean Flowstride ignores the DOM.

In fact, the browser adapter uses Playwright's locator capabilities internally to resolve the elements that your test describes.

When you write:

```flow
flow.click "Log in"
```

Flowstride constructs locator strategies using information available from the page, such as:

- visible text,
- placeholders,
- associated labels,
- ARIA attributes,
- element names,
- values,
- semantic element types,
- and other contextual information.

If required, it falls back to DOM-based locator strategies to resolve the correct element.

The important distinction is this:

**The runtime worries about locating elements.**

**You describe the interface.**

That separation keeps tests focused on behaviour rather than implementation.

---

## Why This Makes Tests Easier to Read

Imagine reviewing the following automation six months after it was written.

```css
#content > div:nth-child(4) > div > button.primary
```

Now compare it to:

```flow
flow.click button "Login"
```

Which one immediately communicates the user's intention? The second example does.

That readability is intentional.

Flowstride assumes that automation will be read far more often than it will be written.

Optimising for human understanding is one of the framework's primary goals.

---

:::tip A Good Rule of Thumb

If another engineer can understand what your test is doing **without opening the browser or inspecting the HTML**, you're probably writing Flowstride the way it was designed to be written.

Focus on what the user sees.

Let Flowstride handle the rest.

:::

---

# 3. Progressive Precision

One of the biggest frustrations in browser automation is element identification.

A page rarely stays simple forever.

As an application evolves, more buttons, links, menus and dialogs are added.

Eventually, two or more elements begin sharing the same visible text.

Traditional automation often responds by forcing you to abandon readable automation in favour of increasingly complex CSS selectors or XPath expressions.

Flowstride takes a different approach.

Instead of immediately switching to implementation-specific selectors, the language encourages you to **gradually increase precision while remaining inside the Flowstride language.**

Think of it as describing the page the same way a person would.

---

## Start Simple

Whenever possible, describe only what the user sees.

```flow
flow.click "Login"
```

If that uniquely identifies the element, your work is done.

There is no need to make the automation more complicated.

Flowstride deliberately encourages the simplest possible description first.

---

## Add Context

Sometimes multiple elements contain similar text.

Rather than falling back to CSS selectors, simply provide more context.

For example:

```flow
flow.click "Log in" near "Sign up"
```

Notice what happened.

You didn't describe the HTML.

You described the interface.

The automation still reads naturally.

---

## Describe Relationships

Flowstride understands that users recognise interfaces spatially.

People naturally think:

> The Login button beside Sign Up.

> The Password field below Email.

> The Search button inside the Filters panel.

The language allows you to express those same relationships.

Examples include:

```flow
near;
leftOf;
rightOf;
above;
below;
inside;
```

These relationships increase precision while keeping the automation readable.

Instead of teaching the framework about the DOM, you continue describing what you see on the page.

---

## When Text Alone Isn't Enough

Responsive applications frequently contain duplicate elements.

For example, a website may contain:

- one navigation bar for desktop,
- another for tablets,
- and another for mobile devices.

Although only one navigation menu is visible, multiple **Logout** buttons may still exist in the page.

Visually, the application looks perfectly normal.

Internally, however, several matching elements exist.

Flowstride provides another level of precision.

---

## Element Indexing

Flowstride allows duplicate visual elements to be distinguished using **zero-based indexing**.

For example:

```flow
flow.click button "Logout [0]"
```

or

```flow
flow.click button "Logout [1]"
```

The number inside the square brackets identifies which matching element should be used.

Indexing begins at **0**, following the same convention used throughout JavaScript and many other programming languages.

---

### Why Indexing Exists

Indexing is **not** intended to replace good element descriptions.

Instead, it exists for situations where the interface genuinely contains multiple matching elements.

Imagine the following responsive layout.

```text
Desktop Navigation

Logout     ← Visible

────────────────────────────

Mobile Navigation

Logout     ← Hidden
```

Both buttons exist in the page.

Only one is currently visible.

Rather than forcing you to inspect the DOM or construct an XPath expression, Flowstride allows you to remain inside the language.

```flow
flow.click button "Logout [0]"
```

The automation still communicates the user's intention while giving the runtime enough information to identify the correct element.

---

## Precision Should Grow Naturally

One of the design goals of Flowstride is that precision should increase only when necessary.

A typical progression looks like this.

```flow
flow.click "Login"
```

↓

Need more context?

```flow
flow.click "Login" near "Sign up"
```

↓

Need even more precision?

```flow
flow.click button "Login [0]"
```

Only when these approaches cannot uniquely identify an element should you consider using raw CSS selectors or XPath expressions.

In practice, many tests never need to.

---

:::tip Think Like a User

When writing Flowstride, ask yourself:

> "How would I describe this element to another person?"

That description is often exactly what Flowstride expects.

Only introduce additional precision when the interface genuinely requires it.

:::

---

# 4. Structured Execution

Flowstride is more than a collection of commands.

It is an execution language.

Every scenario follows a well-defined lifecycle that is validated before execution begins.

This structure is enforced by the parser and validator, helping detect structural problems long before a browser is launched.

Rather than allowing automation to become procedural code, Flowstride encourages predictable, readable execution.

---

## Every Flow Begins the Same Way

Every Flowstride script starts with two structural building blocks:

```flow
Feature:

Scenario:
```

If you're coming from frameworks like **Playwright**, **Cypress**, **Jest**, or **Mocha**, these concepts will feel familiar.

You can think of them like this:

| Flowstride | JavaScript Testing |
| ---------- | ------------------ |
| `Feature`  | `describe()`       |
| `Scenario` | `it()` / `test()`  |

Although the names are different, they serve a very similar purpose—organising related tests into logical groups.

---

### One Feature Per File

Every `.flow` file contains **exactly one Feature**.

Think of a Feature as the highest-level description of the business capability you're testing.

Examples include:

```flow
Feature: User Authentication

Feature: Customer Registration

Feature: Loan Application

Feature: Money Transfer
```

A Feature answers one simple question:

> **"Which part of the application does this file automate?"**

By limiting each file to a single Feature, Flowstride keeps automation focused and easy to navigate.

Instead of mixing unrelated functionality together, every `.flow` file tells the story of one business capability.

---

### A Feature Contains Multiple Scenarios

Inside a Feature, you write one or more **Scenarios**.

Each Scenario represents a single business behaviour that should be verified independently.

For example:

```flow
Feature: User Authentication

Scenario: User signs in successfully

Scenario: Invalid password is rejected

Scenario: Locked account cannot sign in

Scenario: User signs out successfully
```

Notice that every Scenario belongs to the same Feature.

Although they all test **User Authentication**, each Scenario validates a different behaviour.

This keeps failures isolated and makes reports easier to understand.

---

### Think of Scenarios as Independent Test Cases

A good Scenario answers one question.

Examples include:

- Can a valid user sign in?
- Is an invalid password rejected?
- Can a locked account authenticate?
- Can a user reset their password?

Each Scenario should verify one complete outcome before the next Scenario begins.

This encourages small, focused test cases that are easier to read, debug, and maintain.

---

### Why Does Flowstride Organise Tests This Way?

Large automation projects quickly become difficult to manage when unrelated tests are mixed together.

Imagine placing registration tests, loan approval tests, and money transfer tests inside the same file.

Finding the right automation would become increasingly difficult as the project grows.

Instead, Flowstride encourages a simple structure:

- One business capability per file (**Feature**).
- Multiple independent behaviours inside that file (**Scenarios**).

This organisation keeps projects predictable, improves navigation, and produces reports that naturally group related test results together.

---

### Example

```flow
Feature: User Authentication

Scenario: User signs in successfully

Given "User lands on home page"
    flow.open "/"

When "User enters valid credentials"
    flow.type "Email" "user@example.com"
    flow.type "Password" "Password123"

Then "Dashboard becomes visible"
    flow.expect visible "Logout"
```

Before the first command is even executed, the structure already tells you:

- **what** part of the application is being tested,
- **which** behaviour is being verified,
- and **where** this Scenario belongs within the overall automation suite.

That's the purpose of `Feature` and `Scenario`. They provide structure before execution begins.

## The Scenario Lifecycle

Inside every Scenario, Flowstride follows a predictable execution model.

```text
Given
   │
   ▼
When
   │
   ▼
And (optional)
   │
   ▼
Then (terminal stage 🔒)
```

:::tip Then:

Once a Scenario reaches the **Then** block, Flowstride places the Scenario into a Terminal Lock. At this point the Scenario is considered complete and no further execution blocks may be added. The next valid construct is a new Scenario.
:::

Although this resembles traditional BDD syntax, Flowstride treats these blocks as execution states rather than simple keywords.

Each stage has a specific responsibility.

---

### Given

The **Given** block establishes the initial state of the scenario.

Typical responsibilities include:

- opening an application,
- preparing test data,
- making an initial API request,
- loading a session,
- carrying out necessary assertions,
- or establishing preconditions.

A scenario always begins here.

---

### When

The **When** block performs the primary actions of the workflow.

Examples include:

- clicking buttons,
- entering data,
- making API requests,
- carry out necessary assertions,
- uploading files,
- retrieving an OTP,
- or approving a user.

Multiple **When** blocks are perfectly acceptable when describing a larger business process.

Each one represents another meaningful action in the journey.

---

### And

Unlike traditional BDD frameworks, the **And** block has a very specific responsibility in Flowstride.

It exists **exclusively for assertions**.

This means an **And** block must only contain validation statements, such as `flow.expect`, or other supported assertion commands.

For example:

```flow
When "Administrator approves the user"
    flow.post "{{env.APPROVE_USER}}" with reqBody;

And "Approval request succeeds"
    flow.expect status "200";

And "User becomes active"
    flow.expect resBody "user.status" equals "active";
```

This keeps verification grouped together while clearly separating actions from validation.

Although **When** and **Then** blocks are also allowed to contain assertions, the reverse is **not** true.

An **And** block cannot be used to perform ordinary automation actions such as:

- clicking elements,
- typing into inputs,
- opening pages,
- uploading files,
- making API requests,
- or any other non-assertion operation.

Attempting to do so causes Flowstride to reject the script during validation.

This rule is intentional.

By reserving **And** exclusively for assertions, Flowstride encourages scenarios that are easier to read and makes it immediately clear when a test is performing work versus verifying the result of that work.

:::warning Common Mistake

Don't think of **And** as "another step."

In Flowstride, **And** is an **assertion block**, not an action block.

If you need to perform another action, start a new **When** block instead.

:::

### Then

The **Then** block completes the scenario.

This is where the outcome of the workflow is evaluated.

For example:

```flow
Then "Dashboard becomes visible"
    flow.expect visible "Logout"
```

The scenario reaches its natural conclusion here.

The final result of the business process is confirmed before execution moves to the next scenario.

---

## Why This Structure Matters

Without a defined execution model, automation often becomes difficult to follow.

Different engineers organise tests differently.

Some begin with assertions.

Others mix setup and validation together.

Others scatter API calls throughout the scenario without any clear structure.

Flowstride avoids this by encouraging every scenario to tell a complete story.

A reader should immediately recognise:

- how the scenario begins,
- what actions are performed,
- and what successful completion looks like.

That consistency makes large automation projects significantly easier to understand and maintain.

---

:::warning Think in Stories, Not Commands

A good Flowstride scenario should read like a user journey.

Someone reading your automation should be able to understand the behaviour being tested without needing to know how the underlying browser automation works.

When your scenario reads naturally, you're usually writing Flowstride the way it was designed to be used.

:::

---

# 5. End-to-End Flow Automation

Modern applications rarely exist entirely inside a browser.

A typical business process often involves several independent systems working together.

Consider a new customer registration.

```text
Customer submits registration
            │
            ▼
Backend creates account
            │
            ▼
Administrator approves account
            │
            ▼
OTP email is generated
            │
            ▼
Customer enters OTP
            │
            ▼
Dashboard becomes available
```

Although this appears to be one business process, traditional automation often forces engineers to split it into multiple tools.

One tool handles browser automation.

Another handles API testing.

Another generates test data.

Another reads emails.

Another manages sessions.

The automation itself becomes fragmented.

Flowstride was designed differently.

---

## One Workflow. One Language.

Flowstride treats every step as part of the same journey.

A single scenario can:

- create data through an API,
- validate the response,
- extract values,
- open the browser,
- continue interacting with the UI,
- retrieve an OTP,
- complete authentication,
- and verify the final result.

All without leaving the Flowstride language.

For example:

```flow
// First API call:
Given "User signs up through the API"
    flow.post "{{env.SIGNUP}}" with reqBody;
    """
    {
        ...
        "email": "$randomEmail@flowstridemail.com",
        "password": "$randomPassword"
    }
    """
    flow.extract resBody "userId" as "newUserId";
    flow.expect status "201";

// Second API call, referencing the extracted
// "userId", stored in the variable "newUserId"

When "Administrator approves the account"
    flow.post "{{env.APPROVAL}}" with reqBody;
    """
    {
        "userId": "@newUserId"
    }
    """

And "Confirm Status Code is 200"
    flow.expect status "200";

And "Confirm resBody message is successful"
    flow.expect resBody "message" equals "User approved successfully";

And "Confirm user status to be active"
    flow.expect resBody "user.status" equals "active";

// Using the newly registered user credentials via API
// to login user in, on the web (UI)

When "User logs into the web application"
    flow.open "/"
    flow.type "Email" "@randomEmail"
    flow.type "Password" "@randomPassword"

When "User enters OTP"
    flow.mail.getOtp "@randomEmail" into "otp"
    flow.type "Enter 6-digit OTP" "@otp"

Then "Dashboard becomes available"
    flow.expect visible "Logout"
```

Although several technologies are involved, the scenario still reads as one business process.

That's exactly how Flowstride was designed to work.

---

## No Context Switching

One of Flowstride's design goals is reducing unnecessary context switching.

Throughout the same scenario you continue thinking about:

> **What happens next?**

—not—

> Which framework should I use now?

The runtime takes responsibility for coordinating browser automation, API automation, variables, assertions and execution.

You remain focused on the workflow.

---

## API Automation Feels Native

API automation is not treated as an external capability bolted onto the framework.

It is a first-class part of the language.

A request looks like this.

```flow
flow.post "{{env.SIGNUP}}" with reqBody;
"""
{
    "email": "$randomEmail",
    "password": "$randomPassword"
}
"""
```

The response immediately becomes part of the current execution context.

For example:

```flow
flow.expect status "201"

flow.extract resBody "userId" as "newUserId"
```

Notice what is **not** happening.

You never create a request client.

You never parse JSON manually.

You never store a response object.

The runtime already understands the current API state.

---

## Build Real Business Workflows

Modern applications frequently require information produced by one system to be used by another.

For example:

```text
API creates user
        │
        ▼
Extract userId
        │
        ▼
Approve account
        │
        ▼
Open browser
        │
        ▼
Log in using generated credentials
```

Flowstride allows those values to move naturally throughout the flow.

The automation remains focused on behaviour rather than plumbing.

---

# 6. Native Test Data Engine

Reliable automation depends on reliable test data.

Unfortunately, generating realistic data often requires external libraries, helper utilities and custom scripts.

Flowstride approaches this differently.

Instead of expecting every project to solve the same problem, Flowstride includes a built-in test data engine designed specifically for automation.

---

## Generate Instead of Import

Many frameworks require additional packages to generate test data.

Flowstride generates data directly within the language.

For example:

```flow
$randomFirstName;

$randomLastName;

$randomEmail;

$randomPassword;
```

No imports.

No helper functions.

No third-party libraries.

The language understands these testing primitives natively.

---

## Generation and Reuse

One of the most elegant parts of Flowstride's variable system is the distinction between **generation** and **reuse**.

Generating a value uses the **$** prefix.

```flow
$randomEmail;
```

Reusing that same value later uses the **@** prefix.

```flow
@randomEmail
```

This allows information generated during one stage of a workflow to be reused naturally throughout the remainder of the scenario.

For example:

```flow
flow.post "{{env.SIGNUP}}"
"""
{
    "email": "$randomEmail",
    "password": "$randomPassword"
}
"""

...

flow.type "Email" "@randomEmail"
flow.type "Password" "@randomPassword"
```

The generated values remain consistent throughout the flow.

You never need to manually store or recreate them.

---

## Native Environment Variables

Automation rarely runs against a single environment.

The same test suite may need to execute against:

- Development
- QA
- Staging
- Production

Rather than hardcoding URLs, API endpoints, credentials, and other configuration values directly into your `.flow` files, Flowstride provides native environment variable support.

Environment variables are referenced using the syntax:

```text
{{env.NAME}}
```

For example, if your environment file contains:

```env
BASE_URL=https://www.qacar.online

SIGNUP=https://api.qacar.online/signup

LOGIN=https://api.qacar.online/login
```

those values can be referenced directly inside your Flowstride scripts.

For example:

```flow
flow.post "{{env.SIGNUP}}"
```

### Automatic Base URL Resolution

One of the conveniences Flowstride provides is automatic Base URL resolution.

When `BASE_URL` is defined in your environment configuration:

```env
BASE_URL=https://www.qacar.online
```

you don't need to repeat the full URL throughout your automation.

Instead of writing:

```flow
flow.open "{{env.BASE_URL}}"
```

simply write:

```flow
flow.open "/"
```

Flowstride automatically prefixes the configured `BASE_URL` during execution.

This keeps your automation clean while making it easy to run the same test suite against different environments.

Unlike generated variables (`$`) or reusable variables (`@`), environment variables are loaded before execution begins and remain constant throughout the test run unless a different environment configuration is selected.

:::tip Three Types of Variables

Flowstride has three kinds of variables.

- **`$`** generates new test data.

  Example:

  ```flow
  $randomEmail;
  ```

- **`@`** reuses a previously generated or extracted value.

  ```flow
  @randomEmail
  ```

- **Environment variables** read configuration from the active environment.

  ```text
  {{env.SIGNUP}}
  ```

These three variable types serve different purposes:

- **`$`** creates data.
- **`@`** reuses data.
- **Environment variables** provide configuration.

Keeping these concepts separate makes Flowstride scenarios easier to read and allows the same automation to execute across multiple environments without changing the test itself.

:::

## Smart Email Domains

Email generation includes intelligent defaults.

When an email domain is not supplied, Flowstride generates addresses using one of its built-in domains.

For example:

```flow
$randomEmail;
```

However, if your application requires a specific domain, simply append one.

```flow
$randomEmail@example.com
```

Your supplied domain takes precedence while preserving the generated username.

This makes it easy to adapt generated data to different testing environments without additional helper code.

---

## More Than Random Strings

The built-in test data engine contains curated datasets covering multiple testing domains.

These include:

- Personal identities
- Companies
- Geographic locations
- Phone number formats
- Currency data
- Monetary values
- Utility datasets for validation and robustness testing

Rather than generating meaningless strings, Flowstride produces data that resembles realistic business information.

---

## Correlated Data

Some generated values naturally belong together.

For example:

- Country
- State
- City

or

- Country
- Phone Number
- Country Code

The data engine preserves these relationships so that generated values remain internally consistent.

This produces more realistic test scenarios and avoids impossible combinations that can occur when unrelated values are generated independently.

---

## Built for Testers

The data engine isn't simply a random value generator.

It was designed around the kinds of data automation engineers use every day.

Examples include:

- realistic identities,
- business information,
- location data,
- validation datasets,
- malicious payloads,
- overflow strings,
- special Unicode characters,
- invalid email addresses,
- and other edge-case inputs.

Instead of asking every team to build these utilities themselves, Flowstride provides them as part of the language.

That's one less piece of infrastructure your automation project needs to maintain.

---

# 7. Context-Aware Assertions

Assertions are one of the most important parts of any automated test.

Without assertions, automation only performs actions—it never verifies whether those actions produced the expected result.

Flowstride approaches assertions differently from many traditional frameworks.

Instead of requiring you to manually inspect response objects, DOM nodes, or browser state, the runtime already understands the context of the current flow.

That allows assertions to remain concise while still being expressive.

---

## Assertions Should Read Naturally

A browser assertion might look like this.

```flow
flow.expect visible "Logout"
```

Or:

```flow
flow.expect text "Welcome Samuel"
```

API assertions are equally straightforward.

```flow
flow.expect status "201"

flow.expect resBody "message" equals "User created successfully"

flow.expect resBody "user.status" equals "active"
```

The syntax remains consistent even though completely different systems are being verified.

---

## The Runtime Knows the Current Context

After an API request, Flowstride already knows:

- the response status,
- the response body,
- the response headers,
- cookies,
- and response time.

You don't manually pass response objects into assertion functions.

Likewise, after browser interactions, Flowstride understands the browser state and can evaluate browser-specific expectations.

The runtime keeps track of the execution context so that your assertions remain focused on behaviour rather than implementation.

---

## Assertions Belong Beside the Behaviour

One design goal of Flowstride is to keep validation close to the action being performed.

For example:

```flow
When "Administrator approves the user"
    flow.post "{{env.APPROVE_USER}}" with reqBody;

And "Approval succeeds"
    flow.expect status "200"

And "User becomes active"
    flow.expect resBody "user.status" equals "active"
```

Notice how the validation immediately follows the behaviour it describes.

This makes scenarios much easier to understand during reviews.

---

## Browser and API Feel Consistent

Although browser assertions and API assertions validate different systems, they follow the same overall philosophy.

For example:

```flow
flow.expect visible "Logout"
```

and

```flow
flow.expect status "200"
```

feel like part of the same language.

You don't have to switch mental models simply because you're moving between browser automation and backend automation.

---

# 8. Readability Before Cleverness

Flowstride was designed to be read by humans.

That may sound obvious, but it influences almost every decision in the language.

Many automation projects eventually become difficult to understand because they optimise for implementation rather than communication.

Flowstride intentionally chooses the opposite approach.

A good Flowstride scenario should communicate the behaviour being tested before it communicates the underlying implementation.

---

## Write Tests That Tell Stories

Consider this scenario.

```flow
Scenario: User signs into the application

Given "User lands on home page"
    flow.open "/"

When "User clicks Log in"
    flow.click "Log in"

When "User enters credentials"
    flow.type "Email" "@randomEmail"
    flow.type "Password" "@randomPassword"

Then "Dashboard becomes visible"
    flow.expect visible "Logout"
```

Even someone unfamiliar with the application can understand what is happening.

That readability is intentional.

Flowstride encourages automation that can be reviewed by developers, testers, product managers, and anyone else interested in understanding the business behaviour being validated.

---

## The Language Should Stay Out of the Way

A Flowstride script shouldn't feel like programming.

It should feel like describing behaviour.

Whenever the language can remove unnecessary boilerplate, it does.

Instead of asking you to write more code, it provides higher-level concepts such as:

- visual element targeting,
- progressive precision,
- generated test data,
- extracted variables,
- API automation,
- browser automation,
- built-in assertions,
- and reusable sessions.

The goal is not to hide complexity.

The goal is to hide unnecessary repetition.

---

# Putting It All Together

By now you've probably noticed a common theme.

Every major feature in Flowstride supports the same philosophy.

Traditional automation often asks questions like:

- Which selector should I use?
- Which request library should I import?
- Which random data package should I install?
- Which response object should I assert against?

Flowstride asks a different question.

> **What is the user trying to accomplish?**

Everything else flows naturally from that answer.

The runtime handles the supporting complexity.

You remain focused on the workflow.

---

# Common Mistakes

:::warning Thinking in CSS Selectors

One of the biggest adjustments for engineers coming from traditional browser automation is resisting the urge to inspect the DOM immediately.

Before opening your browser's developer tools, ask yourself:

> **Can I describe this element using what the user sees?**

In many cases, the answer is yes.

Only increase precision when the interface genuinely requires it.

:::

---

:::warning Thinking in Browser Actions

Flowstride isn't a collection of browser commands.

It's a language for describing user journeys.

When writing a scenario, think about the complete business process rather than individual clicks and keystrokes.

Your automation will become significantly easier to understand.

:::

---

:::warning Generating Data More Than Once

When Flowstride generates a value using the `$` prefix, reuse that value with the `@` prefix throughout the remainder of the flow.

For example:

```flow
"email": "$randomEmail"

...

flow.type "Email" "@randomEmail"
```

Generating a second value when you intended to reuse the first can lead to confusing test failures.

:::

---

:::warning Reaching for CSS Too Early

Progressive Precision is one of Flowstride's core ideas.

Start simple.

```flow
flow.click "Login"
```

Need more precision?

```flow
flow.click "Login" leftOf "Sign up"
```

Need even more?

```flow
flow.click button "Login [0]"
```

Only use CSS or XPath when the interface itself cannot uniquely identify the element.

:::

---

# Best Practices

As your Flowstride projects grow, these habits will help keep your automation clean and maintainable.

- Think in complete business workflows rather than isolated actions.
- Prefer user-visible descriptions over implementation-specific selectors.
- Increase precision gradually instead of immediately reaching for CSS or XPath.
- Generate test data once and reuse it throughout the flow.
- Keep assertions close to the behaviour they validate.
- Let the runtime manage execution details whenever possible.
- Optimise your scenarios for readability first.

A good Flowstride scenario should explain **what** is being tested without requiring the reader to understand **how** the underlying automation engine works.

---

# In Summary

Everything you've learned in this chapter can be summarised in a single sentence.

> **Describe what the user does. Describe what the user sees. Let Flowstride handle the implementation details.**

That philosophy influences every part of the framework.

Once you begin thinking this way, writing Flowstride becomes remarkably natural.

---

# Next Steps

Now that you understand how Flowstride thinks, it's time to dive deeper into the execution model before writing your first automation.
