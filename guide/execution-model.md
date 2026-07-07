# Execution Model

Before your browser opens.

Before an API request is sent.

Before a button is clicked.

Before an assertion is evaluated.

Flowstride has already done a significant amount of work.

Every `.flow` script passes through a well-defined execution pipeline before the first automation command is executed. During this process, Flowstride reads your script, understands its structure, validates its correctness, resolves placeholders, and prepares an execution plan for the runtime.

Understanding this pipeline isn't required to write Flowstride tests, but it explains **why Flowstride catches many mistakes before execution begins**, why error messages are descriptive, and why the language behaves consistently regardless of the size of your project.

In this chapter, we'll follow a `.flow` file from the moment it is executed until it is ready to run.

---

## Why the Execution Model Matters

When you execute a Flowstride script, it doesn't immediately launch a browser or start making API requests.

Instead, the engine performs several preparation stages to ensure your automation is structurally correct before interacting with the application under test.

Imagine the following script.

```flow
Feature: User Authentication

Scenario: User signs in successfully

Given "User lands on home page"
    flow.open "/"

When "User enters credentials"
    flow.type "Email" "user@example.com"
    flow.type "Password" "Password123"

Then "Dashboard becomes visible"
    flow.expect visible "Logout"
```

Although this appears to be a simple test, Flowstride doesn't execute it line by line.

Instead, the script moves through a series of execution stages.

Each stage has one responsibility.

Each stage produces the input for the next.

By separating responsibilities this way, Flowstride can detect problems early, produce better error messages, and keep the runtime focused solely on execution.

---

## The Flowstride Execution Pipeline

Every `.flow` file follows the same lifecycle.

```text
                  login.flow
                      │
                      ▼
          ┌──────────────────────┐
          │   Read Flow File      │
          └──────────────────────┘
                      │
                      ▼
          ┌──────────────────────┐
          │        Lexer         │
          │  Break text into     │
          │      tokens          │
          └──────────────────────┘
                      │
                      ▼
          ┌──────────────────────┐
          │       Parser         │
          │ Build execution tree │
          │ Validate structure   │
          └──────────────────────┘
                      │
                      ▼
          ┌──────────────────────┐
          │      Validator       │
          │ Validate commands    │
          │ and required data    │
          └──────────────────────┘
                      │
                      ▼
          ┌──────────────────────┐
          │ Placeholder Resolver │
          │ Resolve {{...}}      │
          └──────────────────────┘
                      │
                      ▼
          ┌──────────────────────┐
          │     Flow Worker      │
          │ Execute the script   │
          └──────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
 ┌────────────────┐      ┌────────────────┐
 │ Browser Adapter│      │   API Adapter  │
 │  (Playwright)  │      │    (Undici)    │
 └────────────────┘      └────────────────┘
          │                       │
          └───────────┬───────────┘
                      ▼
          ┌──────────────────────┐
          │ Assertions & Reports │
          └──────────────────────┘
```

Although this may look like a lot of work, each stage has a single responsibility.

This separation keeps the runtime predictable and allows Flowstride to detect many problems before your automation ever reaches the browser.

---

## Stage 1 — Reading the `.flow` File

Everything begins with a plain text file.

```text
login.flow
```

At this point, Flowstride knows nothing about:

- Features,
- Scenarios,
- browser commands,
- API requests,
- variables,
- or assertions.

To the operating system, a `.flow` file is simply text.

The first responsibility of the engine is therefore to read the file into memory.

Only after the entire file has been loaded can Flowstride begin understanding what the script actually contains.

You can think of this stage as opening a book before reading its contents.

Nothing has been interpreted yet.

The engine has simply loaded the script and prepared it for processing.

---

## Stage 2 — Lexical Analysis

Once the file has been loaded, Flowstride passes it to the **Lexer**.

The Lexer is responsible for transforming raw text into meaningful pieces known as **tokens**.

Instead of reading the script as ordinary text, the engine begins recognising the language itself.

For example, the following script:

```flow
Feature: User Authentication

Scenario: User signs in successfully

Given "User lands on home page"
    flow.open "/"
```

is no longer viewed simply as characters on the screen.

The Lexer identifies language elements such as:

- `Feature`
- `Scenario`
- `Given`
- `flow.open`
- string literals
- punctuation
- JSON payloads
- multi-line strings

Each recognised element becomes a token that the Parser can understand.

Rather than seeing one large block of text, the engine now sees a structured sequence of language components.

---

## Why Does Tokenisation Exist?

Imagine trying to understand a sentence without recognising individual words.

The result would simply be one long stream of characters.

Programming languages face the same challenge.

Before Flowstride can understand what your automation means, it must first recognise the individual building blocks that make up the language.

The Lexer performs exactly that job.

It identifies the vocabulary of Flowstride before any attempt is made to understand its meaning.

---

## Helpful Processing Before Parsing

During lexical analysis, Flowstride also performs several small usability improvements before the script reaches the Parser.

For example, the Lexer normalises different quotation mark styles into standard quotation marks, allowing scripts copied from documents or messaging applications to behave consistently.

It also recognises multi-line string blocks and JSON payloads as single language constructs rather than treating them as unrelated lines of text.

By the time lexical analysis finishes, your script is no longer raw text.

It has become a structured stream of tokens ready for the next stage of execution.

---

:::tip Think of the Lexer as a Translator

The Lexer doesn't understand your automation.

It simply recognises the vocabulary of the Flowstride language.

Its job is to answer one question:

> **"What language elements exist in this file?"**

Understanding what those elements mean is the responsibility of the Parser, which we'll explore in the next section.

:::

---

## Stage 3 — Parsing

By the time the Lexer finishes, Flowstride has identified every language element within your script.

However, the engine still doesn't understand how those elements relate to one another.

It knows that a `Feature` exists.

It knows that a `Scenario` exists.

It knows that a `Given` block exists.

But it doesn't yet know **which Scenario belongs to which Feature**, or whether the overall script follows the rules of the Flowstride language.

This responsibility belongs to the **Parser**.

The Parser transforms a stream of language tokens into a structured execution model that the runtime can understand.

Instead of seeing isolated keywords, Flowstride now understands the complete story your automation is trying to tell.

---

## Building the Feature Tree

Every `.flow` file begins with a single **Feature**.

The Parser treats the Feature as the root of the entire execution model.

For example:

```flow
Feature: User Authentication

Scenario: User signs in successfully

Scenario: Invalid password is rejected

Scenario: Locked account cannot sign in
```

Rather than viewing these as unrelated lines of text, the Parser groups them into a single logical structure.

```text
Feature
│
├── Scenario
│
├── Scenario
│
└── Scenario
```

This hierarchy becomes the foundation for everything that follows.

Because every Scenario belongs to a Feature, Flowstride always knows which business capability each test case represents.

This structure is also what allows reports to naturally group related Scenarios together under a single Feature.

---

## Building the Scenario Tree

Once the Feature has been identified, the Parser begins constructing each Scenario.

Within every Scenario, individual execution blocks are attached in the order they appear.

For example:

```flow
Scenario: User signs in successfully

Given "User lands on home page"

When "User enters credentials"

And "Dashboard is displayed"

Then "User signs out"
```

becomes a structured execution model similar to:

```text
Scenario
│
├── Given
│
├── When
│
├── And
│
└── Then
```

Notice that the Parser no longer sees individual keywords.

Instead, it now understands a complete execution sequence.

This execution model is what the Flow Worker will later execute.

---

## The Parser State Machine

Flowstride is intentionally opinionated about how automation should be written.

Instead of allowing execution blocks to appear in any order, the Parser enforces a strict lifecycle.

```text
START
   │
   ▼
Given
   │
   ├────────► And (assertions)
   │
   ▼
When
   │
   ├────────► And (assertions)
   │
   ▼
Then
```

Each execution block has a specific role within the Scenario lifecycle.

The Parser enforces the following language rules before execution begins:

- Every **Scenario** must begin with a **Given** block.
- An **And** block may immediately follow a **Given** block to perform assertions against the initial state.
- A **When** block must follow the **Given** stage (either directly or after one or more **And** assertions).
- An **And** block may also follow a **When** block to perform assertions against the action that was just executed.
- A **Then** block marks the terminal stage of the Scenario.
- Once a **Then** block has been reached, the Scenario enters a **Terminal Lock**, and the only valid construct that may follow is a new **Scenario**.

If the script attempts to move into an invalid state, the Parser immediately rejects it before execution begins.

Because this validation occurs during parsing, many mistakes are caught long before a browser is launched.

---

## Terminal Lock

One of the most important responsibilities of the Parser is enforcing what Flowstride calls the **Terminal Lock**.

The `Then` block represents the final stage of every Scenario.

Once the Parser reaches a `Then` block, the current Scenario is permanently locked.

At that point, no further execution blocks may be added.

The only valid construct after a completed `Then` block is another `Scenario`, signalling the beginning of a new, independent test case.

For example, this is valid:

```flow
Scenario: User signs in successfully

Given ...

When ...

Then ...

Scenario: Invalid password is rejected

Given ...

When ...

Then ...
```

However, the following script violates the language rules:

```flow
Scenario: User signs in successfully

Given ...

When ...

Then ...

And ...
```

The Parser rejects this immediately because the Scenario has already entered its terminal lock stage.

This behaviour is intentional.

A completed Scenario should never continue executing additional business actions.

Instead, a new Scenario should begin.

By enforcing this rule, Flowstride keeps every test case focused, predictable, and easy to understand.

---

## Why Does Flowstride Use a State Machine?

Many automation frameworks execute test code exactly as it is written.

While this provides flexibility, it also makes it possible to create automation that is difficult to understand and even harder to maintain.

Flowstride takes a different approach.

Instead of treating automation as a collection of unrelated commands, it treats every Scenario as a structured business flow with a clearly defined beginning, middle, and end.

The Parser is responsible for enforcing that structure.

Because every Scenario follows the same lifecycle, Flowstride can produce:

- more consistent automation,
- clearer validation errors,
- easier-to-read reports,
- and test suites that scale more naturally as projects grow.

Rather than asking,

> "Can the runtime execute this?"

the Parser first asks,

> **"Does this Scenario make sense?"**

Only after the answer is **yes** does Flowstride allow the script to proceed to the next stage.

---

:::tip The Parser Understands Structure, Not Behaviour

The Parser does **not** click buttons.

It does **not** open browsers.

It does **not** send API requests.

Its responsibility is to understand the structure of your `.flow` file and ensure it follows the rules of the Flowstride language.

Only after the Parser has successfully built and validated the execution model does Flowstride continue to the next stage.

:::

---

## Stage 4 — Validation

Before Flowstride executes a single automation command, it performs one final verification step.

This stage exists to answer a simple question:

> **"Is this Scenario safe and complete enough to execute?"**

Although the Parser has already confirmed that the overall structure of the script follows the Flowstride language, the engine still needs to verify that every command contains the information required to run successfully.

Rather than discovering missing information halfway through a test, Flowstride validates the Scenario before execution begins.

This approach allows mistakes to be reported immediately, long before a browser is opened or an API request is sent.

---

## Structural Validation

The first level of validation happens during parsing.

At this point, Flowstride verifies that the Scenario itself follows the rules of the language.

Examples include:

- A `Scenario` cannot exist without a `Feature`.
- Every Scenario must begin with a `Given` block.
- A `When` block cannot appear before a `Given`.
- An `And` block may only extend an active `Given` or `When` stage.
- An `And` block is reserved exclusively for assertions.
- Every Scenario must eventually reach a `Then` block.
- Once `Then` has been reached, the Scenario enters the **Terminal Lock** and no further execution blocks are permitted.

These rules ensure that every Scenario follows the same predictable execution lifecycle.

Because these checks happen before execution, Flowstride can reject invalid automation immediately instead of failing halfway through a test run.

---

## Payload Validation

Once the Scenario structure has been accepted, Flowstride validates the individual commands within each execution block.

Unlike structural validation, this stage focuses on the information supplied to each command.

For example, consider the following command.

```flow
flow.open;
```

Although the command itself is recognised by the language, it is incomplete.

A page cannot be opened without a destination.

Likewise:

```flow
flow.type "Email";
```

is also incomplete because no text has been provided to type.

During payload validation, Flowstride checks that commands contain the information required for successful execution.

Examples include:

- `flow.open` requires a URL.
- `flow.type` requires both a selector and a value.
- `flow.click` requires a target element.
- `flow.expect visible` requires a selector.
- Plugin calls must specify the plugin to execute.

If required information is missing, execution stops immediately and a descriptive validation error is displayed.

---

## Placeholder Resolution

After validation succeeds, Flowstride begins resolving placeholder values.

Many Flowstride commands contain values that are intentionally left unresolved while the script is being written.

For example:

```text
{{env.BASE_URL}}

{{env.SIGNUP}}

{{env.LOGIN}}
```

These placeholders are not executed directly.

Instead, Flowstride looks them up within the active execution context and replaces them with their corresponding values before execution begins.

For example:

```flow
flow.post "{{env.SIGNUP}}"
```

may become:

```flow
flow.post "https://api.example.com/signup"
```

By resolving placeholders before execution, the runtime always receives concrete values rather than unresolved references.

If a placeholder cannot be resolved, Flowstride intentionally leaves the original placeholder unchanged rather than silently replacing it with an empty value.

This behaviour makes configuration problems much easier to identify during development.

---

## Building the Runtime Context

By this stage, Flowstride has transformed your automation considerably.

It is no longer simply a text file.

The engine now has:

- a validated Feature,
- validated Scenarios,
- a complete execution model,
- verified command payloads,
- and resolved placeholder values.

Everything required for execution has now been assembled into the runtime context.

The Flow Worker no longer needs to interpret the language.

Its responsibility is simply to execute the prepared Scenario one step at a time.

This separation keeps the runtime lightweight while allowing the earlier stages to focus on understanding and validating the script.

---

## Why Validate Before Execution?

Many automation tools discover problems only after execution has already started.

This often means:

- opening a browser,
- navigating to an application,
- executing several actions,
- and only then discovering that part of the test was invalid.

Flowstride takes a different approach.

It attempts to detect as many problems as possible before the first automation command is executed.

This provides several advantages:

- Faster feedback during development.
- Clearer and more precise error messages.
- Less wasted execution time.
- More predictable automation behaviour.
- Greater confidence that runtime failures are genuine application failures rather than authoring mistakes.

In other words, Flowstride prefers to reject an invalid script immediately instead of allowing it to fail halfway through execution.

---

:::tip Validation Is Not Execution

Validation does **not** interact with your application.

It does **not** open a browser.

It does **not** send API requests.

Its responsibility is simply to ensure that the Scenario is structurally correct, complete, and ready to execute.

Only after validation succeeds does Flowstride hand the prepared execution model to the Flow Worker.

:::

---

## Stage 5 — The Flow Worker

Once your `.flow` script has successfully passed through every preparation stage, execution finally begins.

At this point, the script has already been:

- tokenised,
- parsed,
- structurally validated,
- payload validated,
- and had its templates resolved.

The Flow Worker is now handed a fully prepared execution model.

Unlike the Parser or Validator, the Flow Worker no longer needs to understand the language itself.

Its responsibility is much simpler.

It executes the prepared Scenario one step at a time.

Every command in your `.flow` file eventually passes through the Flow Worker.

You can think of it as the conductor of the entire Flowstride runtime.

---

## Browser Adapter

Whenever the Flow Worker encounters a browser command, execution is delegated to the Browser Adapter.

For example:

```flow
flow.open "/"

flow.click button "Login"

flow.type "Email" "user@example.com"

flow.hover "Products"
```

The Browser Adapter is responsible for interacting with the browser on behalf of the Worker.

It performs operations such as:

- opening pages,
- locating elements,
- clicking controls,
- typing into inputs,
- interacting with dialogs,
- hovering elements,
- uploading files,
- and many other browser-related operations.

The Worker doesn't perform these actions directly.

Instead, it delegates browser interactions to the adapter specifically designed for that purpose.

This separation allows Flowstride's execution engine to remain focused on orchestration rather than browser implementation details.

---

## API Adapter

The Flow Worker uses a similar approach for API automation.

Whenever an API command is encountered, execution is delegated to the API Adapter.

For example:

```flow
flow.get "{{env.USERS}}"

flow.post "{{env.SIGNUP}}"

flow.put "{{env.UPDATE_USER}}"

flow.delete "{{env.DELETE_USER}}"
```

The API Adapter is responsible for:

- sending HTTP requests,
- receiving responses,
- storing response metadata,
- recording response times,
- and making the latest response available for assertions and extraction.

Because browser automation and API automation share the same execution engine, they behave as a single continuous flow rather than two disconnected test suites.

---

## Unified Execution

One of Flowstride's defining characteristics is that browser automation and API automation execute together inside the same Scenario.

There is no need to switch tools.

There is no need to synchronise separate test runners.

Everything happens within one continuous execution flow.

For example:

```flow
Given "Create a new user"
    flow.post "{{env.SIGNUP}}"

    flow.extract resBody "userId" as "newUserId"

When "User signs into the web application"
    flow.open "/"

    flow.type "Email" "@randomEmail"

    flow.type "Password" "@randomPassword"

Then "Dashboard becomes visible"
    flow.expect visible "Logout"
```

Notice how the Scenario moves naturally between API operations and browser interactions.

The Flow Worker coordinates both adapters, allowing data produced by one part of the Scenario to be used immediately by another.

This unified execution model is one of the core principles behind Flowstride's flow-first philosophy.

The automation follows the user's journey, not the underlying technology.

---

## Assertions

Execution is not complete until the expected outcome has been verified.

Throughout a Scenario, assertions confirm that the application behaved as expected.

Depending on the command, assertions may validate:

- browser elements,
- API status codes,
- response bodies,
- extracted values,
- application state,
- and many other execution results.

Because assertions execute within the same runtime, they have immediate access to the current browser state and the latest API response.

This makes it possible to write scenarios that naturally verify both frontend and backend behaviour within the same flow.

---

## Reports

Once execution finishes, Flowstride records the outcome of the Scenario.

Depending on your project configuration, execution results may include:

- execution logs,
- Scenario results,
- generated reports,
- and management-friendly testing artefacts.

Because every Scenario follows the same execution lifecycle, reports remain consistent regardless of whether the automation primarily interacts with a browser, an API, or both.

Reporting is therefore not a separate process.

It is the final stage of the execution pipeline.

---

## Putting Everything Together

By the time a Scenario finishes, it has travelled through every stage of the Flowstride engine.

```text
.flow File
      │
      ▼
Read File
      │
      ▼
Lexer
      │
      ▼
Parser
      │
      ▼
Validation
      │
      ▼
Template Resolution
      │
      ▼
Flow Worker
      │
 ┌────┴─────┐
 ▼          ▼
Browser    API
      │
      ▼
Assertions
      │
      ▼
Reports
```

Every stage has a single responsibility.

Because those responsibilities are clearly separated, Flowstride can understand your automation before executing it, detect problems early, and keep runtime execution focused solely on interacting with your application.

---

## Common Mistakes

:::warning Don't confuse parsing with execution

A parser or validation error does **not** mean your application failed.

It means Flowstride rejected the script before execution because the automation itself did not satisfy the rules of the language.

:::

:::warning Don't think browser and API automation are separate test runs

Within Flowstride, browser automation and API automation execute as part of the same Scenario.

You can freely move between browser actions, API requests, data extraction, and assertions without leaving the current execution flow.

:::

:::warning Validation happens before execution

If Flowstride reports a structural or validation error, the browser may never open.

This is expected behaviour.

The engine intentionally detects as many authoring mistakes as possible before interacting with your application.

:::

---
