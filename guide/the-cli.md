# Using the Flowstride CLI

The Flowstride Command Line Interface (CLI) is the primary way to interact with the framework.

Whether you're creating a new project, running automation, viewing reports, or connecting to Flowstride Enterprise, every workflow begins with the CLI.

Unlike traditional automation frameworks where different editions require different tools, Flowstride uses a single CLI throughout the entire developer journey.

You begin with the Open Source runtime, and if you later choose to use Enterprise features, you continue using the exact same commands.

The runtime automatically determines which capabilities are available and executes accordingly.

---

## Why the CLI Exists

Flowstride was designed around a simple idea:

> **Automation should be executed consistently, regardless of where it runs.**

Whether you're:

- developing locally,
- debugging a failed scenario,
- executing automation inside a CI/CD pipeline,
- or using Flowstride Enterprise,

the commands remain familiar.

For example:

```bash
npx flowstride init

npx flowstride run

npx flowstride run --headed

npx flowstride run --headless

npx flowstride report

npx flowstride login

npx flowstride --version

npx flowstride status
```

Rather than learning different workflows for different environments, you learn one CLI that adapts to your project's capabilities.

---

## Installing Flowstride

Flowstride is distributed through npm.

Install it as a development dependency inside your project.

```bash
npm install --save-dev flowstride
```

Or, using the shorter npm syntax:

```bash
npm i -D flowstride
```

For release notes, package information, and version history, visit:

[npm Package](https://www.npmjs.com/package/flowstride)

Once installed, the Flowstride CLI becomes available through `npx`.

For example:

```bash
npx flowstride run
```

:::info Note:

- **_npx flowstride run_** => Runs on both CLI and Flowstride's default browser;

- **_npx flowstride run --headless_** => Runs on only the CLI

- **_npx flowstride run --headed_** => Runs on both CLI, Flowstride's default browser and also enables Playwright's chrome browser

:::

Using `npx` ensures the project uses its locally installed version of Flowstride rather than relying on a globally installed CLI.

---

## Verifying the Installation

After installation, it's a good idea to verify that Flowstride has been installed successfully.

Run:

```bash
npx flowstride --version
```

If the installation completed successfully, Flowstride prints the currently installed version.

For example:

```text
1.0.14
```

If the command cannot be found, ensure that:

- Flowstride has been installed into the current project.
- You're running the command from the project's root directory.
- The installation completed successfully.

Once the version is displayed correctly, you're ready to initialise your first Flowstride workspace.

---

## The Flowstride Lifecycle

Every Flowstride project follows the same lifecycle.

You begin with the Open Source runtime.

Later, if you decide to use Enterprise capabilities, you authenticate your workspace and continue using the exact same CLI.

The commands don't change.

Only the capabilities available to the runtime change.

```text
                npm install flowstride
                         │
                         ▼
                 Open Source Runtime
                         │
                         ▼
                 flowstride init
                         │
                         ▼
              Create Your Workspace
                         │
                         ▼
                  flowstride run
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
 Continue using                    flowstride login
 Open Source                              │
                                          ▼
                           Authenticate Workspace
                                          │
                                          ▼
                         Enterprise Features Enabled
                                          │
                                          ▼
                                   flowstride run
                                          │
                                          ├────────────► Enterprise Available
                                          │                     │
                                          │                     ▼
                                          │              Enterprise Execution
                                          │
                                          └────────────► Enterprise Offline
                                                                │
                                                                ▼
                                                         Open Source Execution
```

One of Flowstride's core design principles is that upgrading to Enterprise should never require learning a new workflow.

You continue using the same CLI commands you've always used.

When Enterprise services are available, Flowstride automatically enables the capabilities associated with your authenticated workspace.

If Enterprise services are unavailable or if you're working entirely offline, Flowstride transparently falls back to the Open Source runtime, allowing you to continue developing and executing automation without interruption.

---

:::tip One CLI. Two Runtimes.

Flowstride does **not** have separate commands for Open Source and Enterprise.

Whether you're using the community edition or Enterprise, you'll continue using familiar commands such as:

```bash
flowstride run
flowstride report
```

The runtime automatically determines which capabilities are available and executes accordingly.

This allows you to move between local development, CI/CD, and Enterprise without changing the way you work.

:::

---

## Creating Your First Workspace

After installing Flowstride, the next step is to initialise a workspace.

A **workspace** is simply a directory that contains everything required for your automation project.

Rather than creating folders manually, Flowstride can scaffold the recommended project structure for you.

From the root of your project, run:

```bash
npx flowstride init
```

Flowstride will automatically create the folders and starter files needed to begin writing automation.

---

## What Happens During Initialization?

Unlike many automation frameworks that simply create an empty folder, Flowstride prepares a complete workspace.

During initialization, Flowstride automatically:

- Creates the recommended project directory structure.
- Generates a sample `.flow` automation.
- Creates a dedicated `fixtures` directory for project assets.
- Creates a `README.md` inside the fixtures directory explaining its purpose.
- Creates (or updates) your `.gitignore` to protect Flowstride runtime data.
- Downloads and installs the Chromium execution engine required for browser automation.

The goal is simple:

> Spend less time configuring your project and more time writing automation.

Once initialization completes successfully, your project is immediately ready to execute Flowstride scenarios.

---

## Generated Project Structure

A newly initialised workspace looks like this:

```text
my-flowstride-project/

├── .flowstride/
│
├── fixtures/
│   └── README.md
│
├── flows/
│   └── example.flow
│
├── plugins/
│
├── .gitignore
│
├── package-lock.json
│
└── package.json
```

Each directory has a specific responsibility.

Keeping these responsibilities separate makes larger automation projects easier to organise and maintain.

---

## flows/

The `flows` directory contains your Flowstride automation scripts.

Every `.flow` file represents one Feature containing one or more Scenarios.

For example:

```text
flows/

├── login.flow
├── checkout.flow
├── registration.flow
└── api/
    └── users.flow
```

As your project grows, additional folders can be created to organise related Features.

---

## fixtures/

Automation often requires external resources such as:

- images,
- audio files,
- documents,
- PDFs,
- upload files,
- or reusable datasets.

Rather than scattering these assets throughout the project, Flowstride provides a dedicated `fixtures` directory.

For example:

```text
fixtures/

├── profile-photo.png
├── invoice.pdf
├── welcome-message.mp3
└── users.json
```

Keeping project assets in one location makes them easier to reuse across multiple Scenarios.

---

## plugins/

The `plugins` directory is reserved for custom Flowstride plugins.

Plugins allow teams to extend Flowstride with organisation-specific functionality while keeping automation scripts clean and readable.

If your project doesn't require plugins immediately, this directory can simply remain empty until needed.

---

## .gitignore

During initialization, Flowstride also creates your project's `.gitignore`.

This ensures that generated runtime files are not accidentally committed to source control.

For example:

```gitignore
node_modules

.flowstride

flowstride-artifacts
```

These directories are generated locally and should remain outside version control.

Flowstride manages them automatically.

---

## .flowstride/

The `.flowstride` directory is Flowstride's private runtime workspace.

It is created automatically and managed entirely by the framework.

Depending on how you're using Flowstride, it may contain runtime data such as persisted sessions, authentication information, execution metadata, and other internal artifacts required by the framework.

Because these files are generated locally and may contain machine-specific or workspace-specific information, the directory is automatically excluded from version control during workspace initialization.

In most cases, you should never edit the contents of this directory manually.

Flowstride creates, updates, and manages it for you.

---

## Your First Flow

To help you get started quickly, Flowstride also creates a sample automation inside the `flows` directory.

This sample demonstrates the basic structure of a Flowstride Feature and provides a working scenario that you can execute immediately.

Rather than starting from an empty file, you begin with a runnable example that you can modify as you learn the framework.

---

## Understanding the Workspace

A Flowstride workspace is intentionally lightweight.

There are no complicated project generators or dozens of configuration files.

Instead, everything is organised around a few simple directories with clear responsibilities.

```text
Workspace
    │
    ├── flows        → Your automation
    ├── fixtures     → Project assets
    └── plugins      → Custom extensions

```

As your project grows, the structure remains predictable.

Whether you're working alone or as part of a large QA team, every Flowstride project follows the same organisational model.

This consistency makes projects easier to navigate, easier to review, and easier for new team members to understand.

---

:::tip Keep Features Organised

As your automation suite grows, organise related Features into folders rather than placing every `.flow` file directly inside the `flows` directory.

For example:

```text
flows/

├── authentication/
├── onboarding/
├── payments/
├── loans/
└── api/
```

A well-organised project is significantly easier to maintain than a single directory containing hundreds of automation files.

:::

---

# Running Automation

With your workspace created and your first `.flow` file in place, you're ready to execute your automation.

Running a Flowstride scenario requires only a single command.

```bash
npx flowstride run
```

By default, Flowstride searches the project's `flows` directory and executes every `.flow` file it finds.

This makes it easy to execute an entire automation suite with a single command.

If you only want to execute a specific Feature, provide its path instead.

For example:

```bash
npx flowstride run flows/login.flow
```

Or execute an entire folder:

```bash
npx flowstride run flows/authentication
```

Flowstride automatically discovers every `.flow` file within the specified directory.

---

# What Happens When You Run?

Although executing automation feels like a single operation, several things happen behind the scenes before the first browser action is performed.

```text
Load Environment
        │
        ▼
Load Project Configuration
        │
        ▼
Build Execution Context
        │
        ▼
Start Flowstride Engine
        │
        ▼
Launch Live Dashboard
        │
        ▼
Execute Flow Files
        │
        ▼
Generate Reports
```

Each stage prepares the runtime for the next, ensuring your automation executes consistently whether you're running locally or inside a CI/CD pipeline.

---

# The Live Dashboard

One of Flowstride's distinguishing features is that execution isn't limited to terminal output.

When automation begins, Flowstride automatically launches the Live Dashboard.

The Dashboard provides a visual representation of everything happening during execution while the terminal continues displaying execution logs.

Instead of switching between browser windows, terminal output, and reports, everything can be observed in one place.

During execution you can watch:

- Currently executing Feature
- Active Scenario
- Executing step
- Browser navigation
- Live execution progress
- Execution logs
- Test summary
- Generated reports

This creates a much more interactive debugging experience than traditional command-line automation.

---

# Browser Execution

Unlike many browser automation tools that execute entirely in the background, Flowstride is designed to make automation visible during development.

By default, running:

```bash
npx flowstride run
```

opens the browser and allows you to watch the automation execute in real time while the Dashboard continues updating alongside the terminal.

This makes it significantly easier to understand how a scenario progresses and to diagnose failures as they occur.

For continuous integration environments, Flowstride automatically adjusts its behaviour to suit non-interactive execution.

---

# Execution Modes

Flowstride adapts its execution mode to the environment in which it is running.

## Local Development

During local development, Flowstride is optimised for visibility and debugging.

Typical behaviour includes:

- Interactive browser execution.
- Live Dashboard.
- Continuous execution logs.
- Interactive debugging experience.

This makes it easy to observe exactly what the automation is doing.

---

## CI/CD Pipelines

When Flowstride detects that it is executing inside a supported CI/CD environment, it automatically enables behaviour appropriate for automated pipelines.

Examples include:

- Headless browser execution.
- Automatic artifact preparation.
- Non-interactive execution.
- Appropriate exit codes for pipeline success or failure.

No additional configuration is required.

Flowstride automatically detects common CI environments and adjusts its runtime accordingly.

---

## Environment Files

Automation rarely targets a single deployment environment.

The same automation suite may execute against:

- Development
- QA
- Staging
- Production

Flowstride automatically loads environment configuration before execution begins.

If a standard `.env` file exists in the project, it is loaded automatically.

For example:

```text
.env
```

You can then reference those values directly inside your Flowstride scenarios.

```flow
flow.open "{{env.BASE_URL}}"

flow.post "{{env.SIGNUP}}"
```

When a `BASE_URL` is configured, Flowstride also allows relative navigation.

For example, if your `.env` contains:

```text
BASE_URL=https://www.qacar.online
```

the following Flowstride script:

```flow
flow.open "/"
```

automatically resolves to:

```text
https://www.qacar.online/
```

This allows scenarios to remain clean and portable across multiple environments without modifying the automation itself.

---

## Project Configuration

In addition to environment variables, Flowstride also loads project configuration from:

```text
flowstride.config.json
```

This file controls framework behaviour such as:

- Execution timeout.
- Browser behaviour.
- Default dialog handling.
- Plugin directory.
- Other project-wide runtime options.

Environment variables and project configuration work together to create the execution context used by the Flowstride runtime.

---

## CI/CD Behaviour

Flowstride has native awareness of Continuous Integration environments.

When a supported CI platform is detected, the runtime automatically adjusts its behaviour to make automation more reliable inside pipelines.

Typical changes include:

- Browser execution becomes headless.
- Interactive dialogs are handled automatically.
- Execution artifacts are prepared.
- Appropriate process exit codes are returned.
- Pipeline execution becomes fully non-interactive.

Because these behaviours are automatic, the same Flowstride project can execute locally and inside CI/CD without requiring separate automation scripts.

---

:::tip One Command Everywhere

Whether you're:

- developing locally,
- debugging a failed scenario,
- executing an overnight regression suite,
- or running inside CI/CD,

the command remains exactly the same:

```bash
npx flowstride run
```

Flowstride automatically prepares the runtime for the environment in which it is executing.

:::

---

## Flowstride Cloud

Flowstride is designed so that you can be productive from day one without paying for a subscription.

The Open Source edition contains everything required to write and execute browser and API automation locally.

However, some Flowstride features naturally require cloud infrastructure. For example, Native Email OTP automation needs Flowstride Cloud to securely receive, monitor, and deliver OTPs back to your running automation.

To use these cloud-powered features, simply create a free Flowstride Cloud account and connect your local workspace.
[Click here to create free account](https://cloud.flowstride.io/register)

For many individual developers, hobby projects, and small QA teams, the free **Personal** plan provides everything needed.

---

## Why Create a Cloud Account?

Creating a Flowstride Cloud account unlocks several capabilities that cannot operate entirely from your local machine.

With a free Personal account, you gain access to:

- Native Email OTP automation
- Workspace synchronization
- Flowstride Cloud Dashboard
- Up to **3 workspace members**
- Up to **1,000 test runs per month**
- Up to **3 parallel workers**
- Up to **200 Email OTP requests per month**

These features are available immediately after creating your Cloud workspace.

If your automation requirements grow over time, your subscription can be upgraded later without changing your existing automation.

---

## Connecting Your Workspace

Connecting your local project to Flowstride Cloud takes only a few seconds.

Run:

```bash
npx flowstride login
```

The CLI will guide you through the authentication process.

For example:

```text
🌐 Flowstride Cloud

✔ Enter your Flowstride email:
✔ Enter your password:

✔ Authentication Successful!

⚙️ System Check:
You have access to Flowstride Cloud features.

✅ Machine synchronized with Flowstride Cloud.
```

Once authentication completes successfully, your local workspace is securely connected to your Flowstride Cloud workspace.

You only need to do this once for each workspace.

---

## The Hybrid Runtime

One of Flowstride's design goals is that connecting to the Cloud should never change the way you work.

Whether you're using only the Open Source edition or you've connected your workspace to Flowstride Cloud, the commands remain exactly the same.

For example:

```bash
npx flowstride run
```

and

```bash
npx flowstride report
```

The difference isn't how you run Flowstride.

The difference is simply which capabilities are available during execution.

Every time automation starts, Flowstride automatically determines whether your workspace is connected to Flowstride Cloud.

```text
             flowstride run
                    │
                    ▼
      Connected to Flowstride Cloud?
             │               │
          Yes │               │ No
             ▼               ▼
      Cloud Runtime      Local Runtime
             │               │
             └───────┬───────┘
                     ▼
             Execute Automation
```

This decision happens automatically before execution begins.

You never need separate commands for local and cloud execution.

---

## Working Offline

Flowstride is designed to keep you productive even when internet connectivity is unavailable.

If Flowstride Cloud cannot be reached, the CLI simply informs you that cloud services are unavailable and offers to continue using the local runtime.

This means you can continue writing, debugging, and executing browser and API automation without interruption.

Whenever Flowstride Cloud becomes available again, your connected workspace automatically regains access to its cloud capabilities.

---

## Checking Your Connection

At any time, you can check whether your workspace is connected to Flowstride Cloud.

Run:

```bash
npx flowstride status
```

If your workspace is running locally, you'll see output similar to:

```text
⚪ OS: Local Mode
```

If your workspace is connected successfully, Flowstride displays your current workspace information.

For example:

```text
🟢 Cloud Connected
Workspace: Example Ltd
Plan: PERSONAL
Sync: Active
```

This provides a quick way to verify that your workspace is connected before starting an automation run.

---

:::tip You Can Stay on the Free Plan

Creating a Flowstride Cloud account does **not** require a paid subscription.

The free **Personal** plan is designed for individual developers, learners, and small QA teams who want to use cloud-powered features such as Native Email OTP automation while continuing to enjoy the full Open Source automation experience.

You can upgrade later if your team's requirements grow, but there's no pressure to do so.

:::

---

## Command Reference

The Flowstride CLI intentionally keeps its command surface small.

Rather than exposing dozens of commands, Flowstride focuses on a handful of commands that cover the entire automation lifecycle.

| Command                    | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `npx flowstride init`      | Create a new Flowstride workspace.                      |
| `npx flowstride run`       | Execute Flowstride automation.                          |
| `npx flowstride login`     | Connect the current workspace to Flowstride Cloud.      |
| `npx flowstride status`    | Display the current Flowstride Cloud connection status. |
| `npx flowstride report`    | Open the Flowstride Debug Dashboard.                    |
| `npx flowstride --version` | Display the installed Flowstride version.               |
| `npx flowstride --help`    | Display available CLI commands and options.             |

As your projects grow, you'll continue using these same commands.

The runtime evolves based on your project and Flowstride Cloud capabilities—not by introducing more CLI complexity.

---

## Common Mistakes

### Forgetting to Initialize the Workspace

A Flowstride project should always begin with:

```bash
npx flowstride init
```

This creates the recommended project structure and prepares everything needed to begin writing automation.

---

### Running Outside the Project Directory

Always execute Flowstride commands from the root of your project.

For example:

```text
my-project/
│
├── flows/
├── fixtures/
├── plugins/
└── flowstride.config.json
```

Running commands from another directory may prevent Flowstride from locating your flows, configuration files, and environment variables.

---

### Editing the `.flowstride` Directory

The `.flowstride` directory is managed entirely by Flowstride.

Avoid modifying or deleting its contents manually.

Doing so may remove persisted sessions, local runtime data, or your Flowstride Cloud connection.

---

### Committing Runtime Files

The `.flowstride` directory and other generated runtime artifacts should not be committed to source control.

Flowstride automatically updates your `.gitignore` during workspace initialization to prevent this.

---

### Using Cloud Features Without Connecting Your Workspace

Features such as Native Email OTP automation require a connected Flowstride Cloud workspace.

If you attempt to use these features without first signing in, Flowstride will continue running locally, but cloud-powered functionality will not be available.

Simply connect your workspace once:

```bash
npx flowstride login
```

---

## Best Practices

### Organise Features by Business Area

As your automation suite grows, organise Features into folders.

For example:

```text
flows/

├── authentication/
├── customers/
├── payments/
├── loans/
└── api/
```

A well-organised project is significantly easier to navigate than a single directory containing hundreds of Flow files.

---

### Keep Scenarios Focused

Each Scenario should verify a single business behaviour.

Smaller, focused Scenarios are easier to understand, easier to debug, and produce clearer reports.

---

### Prefer Environment Variables

Avoid hardcoding URLs, API endpoints, and other environment-specific values.

Instead, store them in your `.env` file and reference them using Flowstride's native environment variable syntax.

This allows the same automation to execute across Development, QA, Staging, and Production environments without modification.

---

### Let Flowstride Manage Runtime Data

Avoid manually creating runtime folders or editing generated files.

Flowstride automatically manages:

- `.flowstride`
- Browser runtime data
- Session storage
- Generated reports
- Execution artifacts

This keeps your project clean and predictable.

---

### Keep Flow Files Readable

One of Flowstride's strengths is that automation reads like documentation.

Use descriptive:

- Feature names
- Scenario names
- Step descriptions

A readable automation suite is easier to review, maintain, and share across teams.

---
