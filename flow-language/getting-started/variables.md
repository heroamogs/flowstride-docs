# Variables and scope

Flowstride has environment interpolation, generated values, extracted state and command aliases. They solve different problems; `let` is not a general JavaScript-style variable declaration.

## Environment values

```flow
flow.open "{{env.BASE_URL}}/login";
flow.type "Email" "{{env.TEST_EMAIL}}";
flow.type "Password" "{{env.TEST_PASSWORD}}";
```

Referenced values must exist. Use shell/CI secrets, `.env`, or [environment profiles](/guide/configuration#environment-profiles). Avoid hardcoding credentials into flows.

## Generate once, reuse deliberately

```flow
flow.type "Email" "$randomEmail@example.test";
flow.type "Confirm email" "@randomEmail@example.test";
```

`$` generates a fresh value and remembers it; `@` retrieves that generator's last value. Calling `$randomEmail` twice generates twice. Retrieval before generation fails. Generated data is random, not a seeded deterministic replay.

[Dynamic variables](/flow-language/dynamic-variables/dynamic-variables) lists the available generators.

## Extract response or UI data

```flow
flow.extract resBody "user.id" as "userId";
flow.get "/api/users/@userId";
flow.extract attribute "#order" "data-order-id" as "orderId";
```

Local extracted variables remain available to later scenarios in the same file and reset at the next file. Browser profiles isolate browser storage, not the file's runner variables; use distinct variable names for different users. To explicitly share within a process:

```flow
flow.extract resBody "id" as global "customerId";
flow.get "/api/customers/@global[customerId]";
```

Globals are not a cross-process bus for parallel workers. Prefer independent setup for parallel files. Unknown custom local names can remain literal strings, so a downstream assertion should verify the value you expected to extract.

## Aliases register actions

```flow
Feature: Game smoke test
let game = "flowstride:game"

Scenario: A score changes

Given "The game is open"
  flow.open "/";

When "The player taps"
  game.tap {
    "canvas": "#game",
    "x": 0.5,
    "y": 0.5
  }

Then "The score is one"
  game.expectState {
    "path": "score",
    "equals": 1
  }
```

Feature aliases apply to its scenarios. A scenario can also declare its own alias. Custom aliases point at a project-local plugin; see [plugins](/flow-language/getting-started/plugins).
