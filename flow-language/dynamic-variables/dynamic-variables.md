## Identity Variables

Identity Variables generate realistic personal information for user registration, authentication, onboarding, profile management, and any workflow that requires unique user data.

Unlike hard-coded values, these variables generate fresh data every time a Scenario is executed, helping to prevent conflicts caused by duplicate users.

---

- `$randomEmail` generates a new email address.
- `@randomEmail` reuses the exact same email address.
- `$randomUsername` generates a username.
- `@randomUsername` references that same username later in the Scenario.

---

### Available Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable             | Example Value             |
| -------------------- | ------------------------- |
| `$randomFirstName`   | `James`                   |
| `$randomLastName`    | `Smith`                   |
| `$randomFullName`    | `Nadia Brown`             |
| `$randomUsername`    | `demi_lee92`              |
| `$randomDisplayName` | `Allen O.`                |
| `$randomJobTitle`    | `Software QA Engineer`    |
| `$randomEmail`       | `john.scott@flowmail.com` |
| `$randomDomain`      | `flowmail.com`            |

---

### Variable Descriptions

- **`$randomFirstName`** — Generates a random first name.
- **`$randomLastName`** — Generates a random last name.
- **`$randomFullName`** — Generates a random full name by combining a first and last name.
- **`$randomUsername`** — Generates a random username suitable for login, registration, or profile creation.
- **`$randomDisplayName`** — Generates a random display name suitable for user profiles.
- **`$randomJobTitle`** — Generates a realistic job title.
- **`$randomEmail`** — Generates a unique email address using Flowstride's built-in identity dataset.
- **`$randomDomain`** — Generates a random email domain.

::: tip Note

The values shown on this page are examples only.

Every execution generates fresh values from Flowstride's built-in Identity dataset. The actual values returned will vary between test runs.

:::

## Phone Variables

Phone Variables generate realistic telephone numbers for testing user registration, contact information, verification workflows, and any feature that requires phone number input.

These variables help eliminate hard-coded phone numbers while ensuring every test execution uses fresh data.

---

```flow
flow.type "Phone Number" "$randomPhone";
flow.type "Confirm Phone Number" "@randomPhone";

```

<!-- flow.type "Nigeria Phone" "$randomPhoneNG";
flow.expect text "@randomPhoneNG" visible; -->

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Phone Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable       | Example Value     |
| -------------- | ----------------- |
| `$randomPhone` | `+44 7911 123456` |

<!-- | `$randomPhoneNG` | `+234 803 456 7890` | -->

---

### Variable Descriptions

- **`$randomPhone`** — Generates a random international phone number.
<!-- - **`$randomPhoneNG`** — Generates a random Nigerian phone number. -->

## Security & Credential Variables

Security & Credential Variables generate temporary authentication values for testing login flows, password creation, OTP verification, API authentication, and other security-related scenarios.

These variables eliminate the need to hard-code sensitive values while ensuring each test execution uses fresh credentials.

---

```flow
flow.type "Password" "$randomPassword";
flow.type "Confirm Password" "@randomPassword";

flow.type "OTP" "$randomOtp";
flow.type "PIN" "$randomPin";

flow.set header "Authorization" "Bearer $randomToken";
```

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Security & Credential Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable          | Example Value             |
| ----------------- | ------------------------- |
| `$randomPassword` | `T8#kLm92!Q`              |
| `$randomOtp`      | `483921`                  |
| `$randomPin`      | `6428`                    |
| `$randomToken`    | `eyJhbGciOiJIUzI1NiIs...` |

---

### Variable Descriptions

- **`$randomPassword`** — Generates a secure random password suitable for authentication and registration testing.
- **`$randomOtp`** — Generates a random One-Time Password (OTP).
- **`$randomPin`** — Generates a random Personal Identification Number (PIN).
- **`$randomToken`** — Generates a random authentication token for testing secured endpoints.

## Geography Variables

Geography Variables generate realistic location data for testing address forms, delivery services, customer onboarding, logistics, mapping, and any workflow that requires geographical information.

These variables can be used independently or together to create complete address information during test execution.

---

```flow
flow.type "Country" "$randomCountry";
flow.type "State" "@randomCountry";

flow.type "City" "$randomCity";
flow.type "Street" "$randomStreet";

flow.type "Address" "$randomAddress";
flow.type "Zip Code" "$randomZipCode";
```

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Geography Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable         | Example Value             |
| ---------------- | ------------------------- |
| `$randomCountry` | `Canada`                  |
| `$randomState`   | `Ontario`                 |
| `$randomCity`    | `Toronto`                 |
| `$randomStreet`  | `King Street`             |
| `$randomAddress` | `15 King Street, Toronto` |
| `$randomZipCode` | `M5H 2N2`                 |

---

### Variable Descriptions

- **`$randomCountry`** — Generates a random country.
- **`$randomState`** — Generates a random state or province.
- **`$randomCity`** — Generates a random city.
- **`$randomStreet`** — Generates a random street name.
- **`$randomAddress`** — Generates a complete street address.
- **`$randomZipCode`** — Generates a random ZIP or postal code.

## Correlated Variables

Correlated Variables generate related data that always belongs together.

Unlike standalone Geography Variables, correlated variables preserve the relationship between values. For example, a generated city will always belong to its generated state, and the generated state will always belong to its generated country.

This is useful when testing address forms, shipping information, taxation, logistics, and any workflow where location data must remain consistent.

---

```flow
flow.type "Country" "$randomPair[Country]";

flow.type "State" "@randomPair[State]";

flow.type "City" "@randomPair[City]";
```

The first call generates the complete location pair.

Subsequent `@randomPair[...]` variables reuse the matching values generated from the same pair.

---

### Available Correlated Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable               | Example Value |
| ---------------------- | ------------- |
| `$randomPair[Country]` | `Canada`      |
| `@randomPair[State]`   | `Ontario`     |
| `@randomPair[City]`    | `Toronto`     |

---

### Variable Descriptions

- **`$randomPair[Country]`** — Generates a new correlated location and returns the country.
- **`@randomPair[State]`** — Returns the state belonging to the generated country.
- **`@randomPair[City]`** — Returns the city belonging to the generated state and country.

## Date & Time Variables

Date & Time Variables generate values relative to the current execution time.

They are useful for testing scheduling, bookings, reminders, reports, subscriptions, expiry dates, timestamps, and any workflow that depends on the current date or time.

---

```flow
flow.type "Today's Date" "$today";

flow.type "Reminder Date" "$tomorrow";

flow.expect text "@today" visible;

flow.expect text "@currentYear" visible;
```

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Date & Time Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable        | Example Value              |
| --------------- | -------------------------- |
| `$today`        | `2026-07-07`               |
| `$tomorrow`     | `2026-07-08`               |
| `$yesterday`    | `2026-07-06`               |
| `$currentYear`  | `2026`                     |
| `$currentMonth` | `July`                     |
| `$timestamp`    | `1783442516`               |
| `$isoTimestamp` | `2026-07-07T19:35:16.482Z` |

---

### Variable Descriptions

- **`$today`** — Generates the current date.
- **`$tomorrow`** — Generates tomorrow's date.
- **`$yesterday`** — Generates yesterday's date.
- **`$currentYear`** — Generates the current year.
- **`$currentMonth`** — Generates the current month.
- **`$timestamp`** — Generates the current Unix timestamp.
- **`$isoTimestamp`** — Generates the current ISO 8601 timestamp.

## Commerce Variables

Commerce Variables generate realistic business and financial data for testing e-commerce platforms, banking applications, payment gateways, invoicing systems, and other commerce-related workflows.

These variables help create dynamic transactional data without relying on hard-coded values.

---

```flow
flow.type "Company Name" "$randomCompany";

flow.type "Amount" "$randomAmount";

flow.select "$randomCurrency" from "Currency";

flow.expect text "@randomTransactionId" visible;
```

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Commerce Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable               | Example Value            |
| ---------------------- | ------------------------ |
| `$randomCompany`       | `Acme Technologies Ltd.` |
| `$randomAmount`        | `2549.99`                |
| `$randomCurrency`      | `USD`                    |
| `$randomTransactionId` | `TXN-8F3A92D7`           |

---

### Variable Descriptions

- **`$randomCompany`** — Generates a realistic company name.
- **`$randomAmount`** — Generates a random monetary amount.
- **`$randomCurrency`** — Generates a supported currency code.
- **`$randomTransactionId`** — Generates a unique transaction identifier.

---

### Supported Currency Codes

| Currency        | ISO Code |
| --------------- | :------: |
| US Dollar       |  `USD`   |
| Euro            |  `EUR`   |
| British Pound   |  `GBP`   |
| Canadian Dollar |  `CAD`   |
| Nigerian Naira  |  `NGN`   |

## Utility Variables

Utility Variables generate commonly used values that don't belong to a specific business domain.

They are useful for generating unique identifiers, random strings, numeric values, execution metadata, and other reusable data required during test execution.

---

```flow
flow.type "Reference ID" "$uuid";

flow.type "Temporary Password" "$randomAlphaNumeric";

flow.expect text "@runId" visible;

flow.expect text "@workerId" visible;
```

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Utility Variables

The following illustrates the type of values that Flowstride may generate during execution.

| Variable              | Example Value                          |
| --------------------- | -------------------------------------- |
| `$uuid`               | `550e8400-e29b-41d4-a716-446655440000` |
| `$randomInt`          | `482`                                  |
| `$randomNumber`       | `98231457`                             |
| `$randomString`       | `kfjwQmLp`                             |
| `$randomAlpha`        | `AbCdEfGh`                             |
| `$randomAlphaNumeric` | `A9k3LmP8`                             |
| `$runId`              | `RUN-20260707-001`                     |
| `$workerId`           | `Worker-1`                             |

---

### Variable Descriptions

- **`$uuid`** — Generates a Version 4 UUID.
- **`$randomInt`** — Generates a random integer.
- **`$randomNumber`** — Generates a random numeric value.
- **`$randomString`** — Generates a random string.
- **`$randomAlpha`** — Generates a random alphabetic string.
- **`$randomAlphaNumeric`** — Generates a random alphanumeric string.
- **`$runId`** — Returns the unique identifier of the current Flowstride execution.
- **`$workerId`** — Returns the identifier of the worker executing the current Scenario.

## Bug Hunter Payloads

Bug Hunter Payloads generate intentionally invalid or potentially dangerous input values for negative testing.

These variables help verify that applications correctly validate user input, handle unexpected values safely, and remain resilient against malformed requests.

---

```flow
flow.type "Email" "$invalidEmail";

flow.type "Username" "$specialChars";

flow.type "Comment" "$overflowString";

flow.type "Search" "$maliciousString";
```

Every generated variable can be reused later in the same Scenario by replacing the `$` prefix with `@`.

---

### Available Bug Hunter Payloads

The following illustrates the type of values that Flowstride may generate during execution.

| Variable           | Example Value                    |
| ------------------ | -------------------------------- |
| `$maliciousString` | `<script>alert('XSS')</script>`  |
| `$invalidEmail`    | `john@@example..com`             |
| `$overflowString`  | `AAAAAAAAAAAAAAAAAAAAAAAA...`    |
| `$specialChars`    | `!@#$%^&*()_+-=[]{}\|;:'",.<>?/` |

---

### Variable Descriptions

- **`$maliciousString`** — Generates a potentially malicious input for testing application security and input sanitization.
- **`$invalidEmail`** — Generates an intentionally malformed email address.
- **`$overflowString`** — Generates an extremely long string for boundary and overflow testing.
- **`$specialChars`** — Generates a collection of special characters for input validation testing.

## All Flowstride Dynamic Variables

- **`$randomFirstName`**
- **`$randomLastName`**
- **`$randomFullName`**
- **`$randomUsername`**
- **`$randomDisplayName`**
- **`$randomJobTitle`**
- **`$randomEmail`**
- **`$randomDomain`**

- **`$randomPhone`**
- **`$randomPhoneNG`**

- **`$randomPassword`**
- **`$randomOtp`**
- **`$randomPin`**
- **`$randomToken`**

- **`$randomCountry`**
- **`$randomState`**
- **`$randomCity`**
- **`$randomStreet`**
- **`$randomAddress`**
- **`$randomZipCode`**

- **`$randomPair[Country]`**
- **`@randomPair[State]`**
- **`@randomPair[City]`**

- **`$today`**
- **`$tomorrow`**
- **`$yesterday`**
- **`$currentYear`**
- **`$currentMonth`**
- **`$timestamp`**
- **`$isoTimestamp`**

- **`$randomCompany`**
- **`$randomAmount`**
- **`$randomCurrency`**
- **`$randomTransactionId`**

- **`$uuid`**
- **`$randomInt`**
- **`$randomNumber`**
- **`$randomString`**
- **`$randomAlpha`**
- **`$randomAlphaNumeric`**
- **`$runId`**
- **`$workerId`**

- **`$maliciousString`**
- **`$invalidEmail`**
- **`$overflowString`**
- **`$specialChars`**
