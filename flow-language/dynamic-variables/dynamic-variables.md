# Dynamic data

Use `$name` to generate a fresh value and `@name` to reuse its most recently generated value in the active generator memory. These are test-data helpers, not credentials for a real service or a seeded random replay system.

Generator memory resets for each file and can be reused by later scenarios in that file. Generating again replaces that generator's last value. Browser profiles do not create separate generator memory; use extracted names when users need distinct data.

## Identifiers and numbers

`$uuid`, `$timestamp`, `$isoTimestamp`, `$randomInt`, `$randomNumber`, `$randomString`, `$randomAlpha`, `$randomAlphaNumeric`, `$runId`, `$workerId`.

## People and accounts

`$randomFirstName`, `$randomLastName`, `$randomFullName`, `$randomUsername`, `$randomDisplayName`, `$randomJobTitle`, `$randomEmail`, `$randomPhone`, `$randomPhoneNG`, `$randomDomain`, `$randomPassword`, `$randomOtp`, `$randomPin`, `$randomToken`.

## Places

`$randomCountry`, `$randomState`, `$randomCity`, `$randomStreet`, `$randomAddress`, `$randomZipCode`.

## Dates

`$today`, `$tomorrow`, `$yesterday`, `$currentYear`, `$currentMonth`.

## Commerce and input boundaries

`$randomCompany`, `$randomAmount`, `$randomCurrency`, `$randomTransactionId`, `$maliciousString`, `$invalidEmail`, `$overflowString`, `$specialChars`.

## Keep correlated data together

Independent random country/state/city calls can describe different places. Generate a location pair once, then retrieve its associated fields:

```flow
flow.select "$randomPair[Country]" from "Country";
flow.select "@randomPair[State]" from "State";
flow.select "@randomPair[City]" from "City";
```

Calling another `$randomPair[...]` creates a new triplet. The correlation comes from the bundled location data, not a live address-validation service.

## Domain overrides

```flow
flow.type "Email" "$randomEmail@example.test";
flow.type "Confirm email" "@randomEmail@example.test";
```

An overridden domain changes the generated address. It does not provision a mailbox. The Cloud FlowMail service has its own supported addresses and entitlements.

## Boundary payloads

`$maliciousString`, `$invalidEmail`, `$overflowString`, and `$specialChars` draw from bundled payloads. They help exercise input handling but do not establish a security audit or exhaustive fuzzing coverage.

`$randomPassword`, `$randomToken`, `$randomOtp` and `$randomPin` generate test strings; they do not acquire a valid application token or retrieve a delivered OTP. Use [FlowMail](/flow-language/flow-commands/flow.mail.getotp) for its supported Cloud inbox workflow.
