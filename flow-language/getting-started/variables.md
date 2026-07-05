# Variables

Variables allow Flowstride to store, generate, and reuse values throughout a test run.

Rather than hard-coding URLs, credentials, test data, or values returned during execution, Flowstride provides a unified variable system that keeps your scripts readable, reusable, and easy to maintain.

Whether you're loading configuration from a `.env` file, generating a unique email address for a new user, or reusing a value created earlier in the Scenario, the language is designed to make variable handling feel natural.

---

## Why Variables Exist

Modern automation rarely uses fixed values.

Applications have different environments, dynamic test data, authentication tokens, and values that only become available while a Scenario is running.

Flowstride's variable system was designed to solve these common problems while keeping your automation language simple and readable.

Variables allow you to:

- Separate configuration from your test scripts.
- Generate unique test data automatically.
- Reuse values without manually declaring variables.
- Write reusable automation that works across multiple environments.

Instead of writing JavaScript to create and manage variables, Flowstride provides this capability as part of the language itself.

---

## The Three Types of Variables

Flowstride supports three categories of variables, each designed for a different purpose.

```text
                        Variables
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼

 Environment          Generated            Runtime

 {{env.BASE_URL}}     $randomEmail         @randomEmail

 Configuration        Create New          Reuse Existing
```

## Environment Variables

Environment variables provide configuration values that exist before a test begins.

These values are typically loaded from your project's `.env` file and are commonly used for items such as:

- Base URLs
- User credentials
- API keys
- Environment-specific configuration

Because these values are stored outside your test scripts, the same automation can run against multiple environments without modification.

---

## Generated Variables

Generated variables create new values at runtime.

For example, Flowstride can generate unique email addresses, passwords, UUIDs, phone numbers, and many other data types without requiring custom JavaScript.

Generated variables always begin with the `$` prefix.

```flow
flow.type input "Email" "$randomEmail";
```

---

## Runtime Variables

Whenever Flowstride generates a value, it automatically remembers it for the remainder of the execution.

That value can later be referenced using the `@` prefix.

```flow
flow.type input "Email" "$randomEmail"; //Generated

flow.type input "Confirm Email" "@randomEmail"; //Reused
```

This allows the exact same value to be reused later in the Scenario without manually creating or assigning variables.

---

## How Variable Resolution Works

During execution, Flowstride resolves variables before a command is executed.

Each variable type follows its own resolution path.

```text
                    Flow Script
                         │
                         ▼
               Variable Resolution
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼

   {{env.*}}         $random...        @variable

 Load from          Generate a        Retrieve the
 Environment        new value         previously
 Configuration                        generated value
                         │
                         ▼
                  Execute Command
```

This separation keeps configuration, generated data, and runtime state independent while allowing them to work together seamlessly throughout a Flowstride Scenario.

---

## Environment Variables

Environment variables provide configuration values that exist before your automation begins.

Rather than hard-coding URLs, credentials, API keys, or other environment-specific values inside your `.flow` files, Flowstride allows you to store them externally and reference them throughout your automation.

This keeps your scripts secure, reusable, and easy to maintain.

Environment variables use the following syntax:

```flow
{
  {
    env.VARIABLE_NAME;
  }
}
```

For example:

```flow
flow.open "{{env.BASE_URL}}";
```

When the Scenario executes, Flowstride resolves the placeholder before the command is sent to the automation engine.

---

## Creating a `.env`

Flowstride automatically looks for a `.env` file in the root of your project.

A typical project might contain:

```text
my-project/

├── .env
├── flows/
├── fixtures/
├── plugins/
└── reports/
```

A simple `.env` file might look like this:

```text
BASE_URL=https://www.qacar.online

EMAIL=user@flowstridemail.com

PASSWORD=Test@12345
```

Your `.flow` file can then reference those values directly.

```flow
Given "User lands on home page";
  flow.open "{{env.BASE_URL}}";

When "User enters credentials";
  flow.type input "Email" "{{env.EMAIL}}";
  flow.type input "Password" "{{env.PASSWORD}}";
```

This allows the same Scenario to run against different environments without modifying the test itself.

---

## Using `BASE_URL`

`BASE_URL` is the most commonly used environment variable in a Flowstride project.

Rather than opening a full URL every time:

```flow
flow.open "https://www.qacar.online/login";
```

configure the application's base address once:

```text
BASE_URL=https://www.qacar.online
```

Your Scenario can then navigate using relative paths.

```flow
flow.open "/";
```

or

```flow
flow.open "/login";
```

This approach keeps your automation concise while making it easy to switch between development, staging, and production environments.

---

## Custom Environment Variables

You're not limited to `BASE_URL`.

Any value stored in your environment configuration can be referenced using the same syntax.

For example:

```text
BASE_URL=https://staging.example.com

ADMIN_EMAIL=admin@example.com

ADMIN_PASSWORD=SuperSecret123

API_KEY=abc123xyz
```

Inside your Scenario:

```flow
flow.open "{{env.BASE_URL}}";

flow.type input "Email" "{{env.ADMIN_EMAIL}}";

flow.type input "Password" "{{env.ADMIN_PASSWORD}}";
```

Using descriptive names makes your automation easier to understand and avoids scattering sensitive values throughout your test suite.

---

## Environment Profiles

Many teams automate against multiple environments.

Flowstride supports environment-specific configuration by loading named environment files.

For example:

```text
.env

.env.staging

.env.production

.env.qa
```

When executing your automation, specify the profile you want to use.

```bash
npx flowstride run flows/login.flow --env staging
```

Flowstride loads the corresponding environment profile before execution begins.

This allows the same Flowstride scripts to run across multiple environments without requiring any changes to the automation itself.

---

## Best Practices

::: tip Recommended Practices

- Keep all environment-specific configuration inside `.env` files.
- Use `BASE_URL` together with relative paths such as `flow.open "/login"` instead of hard-coded URLs.
- Store credentials, API keys, and secrets in environment variables instead of embedding them directly in your `.flow` files.
- Give environment variables descriptive names such as `ADMIN_EMAIL` or `CUSTOMER_PASSWORD`.
- Create separate environment profiles (`.env.staging`, `.env.production`, etc.) rather than editing a single `.env` file before every test run.
- Never commit sensitive environment files containing production credentials to source control.

:::

---

## Generated Variables

Generated variables create new values automatically while your Scenario is running.

Instead of manually creating random emails, passwords, UUIDs, phone numbers, or dates, Flowstride generates realistic values for you whenever they are needed.

Generated variables always begin with the `$` prefix.

```flow
flow.type input "Email" "$randomEmail";

flow.type input "Password" "$randomPassword";
```

Every generated value is immediately available for reuse later in the Scenario using its corresponding runtime variable.

---

## Why Generated Variables Exist

One of the most common causes of unstable automation is hard-coded test data.

For example, creating a new user with the same email address every time will eventually cause the application to reject the request because the account already exists.

Generated variables solve this problem by creating fresh, realistic data whenever your automation executes.

This allows your Scenarios to remain repeatable without requiring you to manually maintain test data.

Generated variables are commonly used for:

- User registration
- Password creation
- API payloads
- Unique identifiers
- Dates and timestamps
- Boundary and security testing

---

## Available Generators

Flowstride includes a large collection of built-in generators covering common testing scenarios.

These generators include categories such as:

- Identity data
- Geography
- Commerce
- Phone numbers
- Utility values
- Security and bug-hunting payloads

Examples include:

```flow
$randomEmail;

$randomPassword;

$randomPhone;

$uuid;

$timestamp;

$today;
```

A complete list of every available generator is provided in the **Dynamic Variables** reference section of the documentation.

---

## Correlated Data (`$randomPair[...]`)

Sometimes randomly generated values must remain logically connected.

For example:

- A city should belong to its correct state.
- A state should belong to its correct country.

Generating each value independently can easily produce impossible combinations.

Flowstride solves this using correlated data pairs.

```flow
flow.type input "Locator" "$randomPair[Country]";

flow.type input "Locator" "@randomPair[State]";

flow.type input "Locator" "@randomPair[City]";
```

When the first correlated value is generated, Flowstride automatically generates the complete location set and stores the related values together.

Subsequent references retrieve the matching state and city that belong to the same generated location.

This guarantees that all correlated values remain logically consistent throughout the Scenario.

---

## Email Domain Overrides

By default, Flowstride generates email addresses using its built-in test domain.

However, you can override the domain whenever your automation requires a specific provider.

For example:

```flow
$randomEmail@gmail.com

$randomEmail@yahoo.com

$randomEmail@company.com
```

The generated username remains unique while the requested domain is applied automatically.

This is particularly useful when testing applications that validate email domains or integrate with external mail providers.

The generated value can later be reused exactly as it was created.

```flow
flow.type input "Email" "$randomEmail@gmail.com";

flow.type input "Confirm Email" "@randomEmail@gmail.com";
```

---

## Best Practices

::: tip Recommended Practices

- Use generated variables whenever unique data is required.
- Reuse generated values with `@` instead of generating new ones.
- Use correlated data when multiple values must remain logically related.
- Use custom email domains only when the application specifically requires them.
- Avoid hard-coded emails and passwords for registration scenarios.

:::

---

## Runtime Variables

Runtime variables allow you to reuse values that were generated earlier during the execution of a Scenario.

Unlike generated variables, runtime variables do not create new values. Instead, they retrieve values that already exist in Flowstride's runtime memory.

Runtime variables always begin with the `@` prefix.

---

## Reusing Generated Values

Every time Flowstride generates a value, it automatically remembers it for the remainder of the Scenario.

For example:

```flow
flow.type input "Email" "$randomEmail";

flow.type input "Confirm Email" "@randomEmail";
```

During execution, Flowstride might generate the following email address:

```text
flow_847291@flowstride.io
```

Internally, the Scenario now behaves as if it were written like this:

```flow
flow.type input "Email" "flow_847291@flowstride.io";

flow.type input "Confirm Email" "flow_847291@flowstride.io";
```

Both fields receive exactly the same value without requiring you to manually declare or assign a variable.

---

## Variable Lifetime

A generated value exists only for the lifetime of the current Scenario.

Once generated, it can be reused as many times as needed within that Scenario by referencing its runtime variable.

For example:

```flow
flow.type input "First Name" "$randomFirstName";

flow.type input "Profile Name" "@randomFirstName";

flow.expect text "@randomFirstName";
```

This guarantees that every reference points to the exact same generated value.

---

## Runtime Memory

Flowstride automatically stores generated values in an internal runtime memory as they are created.

You never need to declare variables manually.

For example:

```flow
flow.type input "Password" "$randomPassword";
```

Immediately makes the following available:

```flow
@randomPassword
```

Likewise,

```flow
$uuid;
```

automatically becomes:

```flow
@uuid
```

The same applies to every built-in generated variable.

This allows your automation to remain clean and focused on business behaviour instead of variable management.

---

## Common Examples

### Reusing an Email Address

```flow
flow.type input "Email" "$randomEmail";

flow.type input "Confirm Email" "@randomEmail";
```

---

### Reusing a Generated Password

```flow
flow.type input "Password" "$randomPassword";

flow.type input "Confirm Password" "@randomPassword";
```

---

### Reusing a Generated UUID

```flow
flow.post "/users" with reqBody
"""
{
    "id": "$uuid"
}
""";

flow.expect resBody "id" equals "@uuid";
```

---

### Reusing Correlated Data

```flow
flow.type input "Locator" "$randomPair[Country]";

flow.type input "Locator" "@randomPair[State]";

flow.type input "Locator" "@randomPair[City]";
```

Flowstride automatically ensures that all correlated values belong to the same generated location.

---

## Best Practices

::: tip Recommended Practices

- Generate a value once and reuse it throughout the Scenario.
- Prefer runtime variables over generating multiple random values for related fields.
- Use runtime variables whenever the application asks the user to confirm previously entered information.
- Keep your Scenario readable by letting Flowstride manage runtime memory automatically instead of creating manual variables.

:::

---

## Variable Resolution Order

Flowstride resolves variables according to the syntax you use.

Each variable type has a distinct responsibility and is processed independently during execution.

Because each syntax serves a different purpose, they can be used together within the same Scenario without conflicting with one another.

For example:

```flow
Given "User lands on the application";
  flow.open "/";

When "User enters account details";
  flow.type input "Email" "$randomEmail";

And "User confirms the same email";
  flow.type input "Confirm Email" "@randomEmail";

Then "User submits the registration form";
  flow.click button "Register";
```

This keeps your automation readable while allowing Flowstride to manage configuration, generated data, and runtime state automatically.

---

## Common Mistakes

::: warning Avoid These Common Mistakes

### Hard-coding configuration

Avoid writing:

```flow
flow.open "https://staging.example.com";
```

Instead:

```flow
flow.open "/";
```

with:

```text
BASE_URL=https://staging.example.com
```

---

### Generating multiple values unnecessarily

Avoid:

```flow
flow.type input "Email" "$randomEmail";

flow.type input "Confirm Email" "$randomEmail";
```

Each `$randomEmail` generates a brand-new email address.

Instead:

```flow
flow.type input "Email" "$randomEmail";

flow.type input "Confirm Email" "@randomEmail";
```

This guarantees that both fields receive exactly the same value.

---

### Storing secrets inside test files

Avoid embedding credentials directly inside your `.flow` scripts.

Instead, store them in your `.env` file and reference them using environment variables.

```flow
flow.type input "Email" "{{env.ADMIN_EMAIL}}";

flow.type input "Password" "{{env.ADMIN_PASSWORD}}";
```

:::

---

## Recommended Patterns

As your automation grows, following consistent patterns will make your Scenarios easier to maintain.

✅ Store configuration in `.env`.

```flow
flow.open "/";
```

---

✅ Generate unique data only when needed.

```flow
flow.type input "Email" "$randomEmail";
```

---

✅ Reuse generated values throughout the Scenario.

```flow
flow.type input "Confirm Email" "@randomEmail";
```

---

✅ Keep related data correlated.

```flow
flow.type input "Locator" "$randomPair[Country]";

flow.type input "Locator" "@randomPair[State]";

flow.type input "Locator" "@randomPair[City]";
```

---

Following these patterns keeps your automation predictable, reusable, and easy to understand.

---
