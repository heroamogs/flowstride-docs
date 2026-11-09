# Files, data and run control

These commands work in Flowstride OS and Cloud. Use project-relative paths and small, synthetic fixtures. The examples put app controls and routes under test. Replace the names with your own app’s labels and endpoints.

## Select files and folders

`flow.files.select` fills a labelled file input or activates a visible control that opens a file chooser. Supply one `target` or `selector`, and one of `files` or `directory`. Use `timeout` in milliseconds if the target or chooser needs more time.

For a multi-file input labelled Attach documents, create the two files below inside your project. The app should display their names after selection.

```flow
flow.files.select {
  "target": {
    "text": "Attach documents",
    "element": "input"
  },
  "files": ["fixtures/invoice.txt", "fixtures/receipt.txt"]
};
flow.expect visible "invoice.txt";
flow.expect visible "receipt.txt";
```

Use a one-item array for a single file. Use an empty array with the direct file input to clear its selection.

```flow
flow.files.select {
  "target": {
    "text": "Attach documents",
    "element": "input"
  },
  "files": []
};
```

For a folder input labelled Attach folder, create `fixtures/contracts` with files such as `current.txt` and `archive/previous.txt`. The app’s input must support directory selection.

```flow
flow.files.select {
  "target": {
    "text": "Attach folder",
    "element": "input"
  },
  "directory": "fixtures/contracts"
};
flow.expect visible "2 files selected";
```

Folder selection keeps relative paths. The command accepts up to 100 files, 20 MiB per file and 50 MiB total. Use ordinary files in the project. The app controls when selected files are actually submitted. [Simple uploads](/flow-language/flow-commands/flow.upload).

## Load a fixture

A fixture is test data you prepare ahead of time. You might save a sample customer once, then load those details whenever you test the customer form.

`flow.data.load` reads prepared data and binds it to a local variable named with `as`. Save the following as `fixtures/customer.json`.

```json
{
  "name": "Ada Obi",
  "city": "Lagos",
  "active": true
}
```

```flow
flow.data.load {
  "file": "fixtures/customer.json",
  "as": "customer"
};
flow.type input "Customer name" "@customer.name";
flow.assert.value {
  "actual": "@customer.active",
  "operator": "equals",
  "expected": true
};
```

JSON booleans, numbers, arrays and objects keep their types when a supported field reads a whole reference such as `"@customer.active"`. Typing in a field uses the string representation.

## Read a local file

`flow.file.read` shares the fixture reader. Use it to inspect a project file, such as a CSV you saved from a browser download. The `format` is `json`, `csv` or `text`. Flowstride infers JSON and CSV by extension and otherwise reads text.

Save this as `fixtures/customers.csv`.

```csv
name,city
"Ada, Obi",Lagos
Nneka Eze,Abuja
```

```flow
flow.file.read {
  "file": "fixtures/customers.csv",
  "format": "csv",
  "as": "customers"
};
flow.assert.value {
  "actual": "@customers[0].name",
  "operator": "equals",
  "expected": "Ada, Obi"
};
```

CSV cells are strings, even for numeric text. JSON supplies typed fields. Text is read as a single string. All three formats use UTF-8 and a 1 MiB file limit. Use regular project files and keep private configuration and credentials outside the fixture inputs.

## Run a scenario once per row

`flow.data.cases` repeats the complete scenario for each JSON object or CSV record. Put it first in `Given` and use a fixed project-relative path. The default variable is `@case`. Set `as` to choose another name.

Save this as `fixtures/customers.json`. The form in this example has labelled Customer name and City inputs.

```json
[
  {
    "name": "Ada Obi",
    "city": "Lagos"
  },
  {
    "name": "Nneka Eze",
    "city": "Abuja"
  }
]
```

```flow
Feature: Enter customer data

Scenario: Fill the form with each customer
  Given "A customer row and a clean form"
    flow.data.cases { "file": "fixtures/customers.json" };
    flow.open "/customers/new";

  When "The customer details are entered"
    flow.type input "Customer name" "@case.name";
    flow.type input "City" "@case.city";

  Then "The form contains this row's values"
    flow.expect value input "Customer name" "@case.name";
    flow.expect value input "City" "@case.city";
```

You can point the same example at `fixtures/customers.csv` above. Datasets contain 1–1,000 rows. Flowstride starts each row from the scenario’s starting runner state. Use isolated backend records or registered cleanup for writes made to the application.

## Seed generated values

If a generated email triggers a bug, a fixed seed lets you generate the same email again while you investigate. Set `flow.data.seed` before generating anything you want to repeat. With the same seed, flow file, scenario, row and generator order, the generated random values repeat. Timestamp generators still use the real clock.

```flow
flow.data.seed "customer-signup-regression";
flow.type input "Email" "$randomEmail@example.test";
flow.expect value input "Email" "@randomEmail@example.test";
```

Reapplying a seed restarts the generator sequence and clears its remembered values. Use test-only data. Repeatable identifiers can collide with records left behind by an earlier run.

## Reuse command fragments

If several tests fill in the same search form, save those steps once as a fragment and call it from each test. When the form changes, you can update the shared steps in one place.

`flow.call` inserts commands from a project-relative `.flowpart` file. Use a fixed path. A fragment contains commands and can call another fragment. Put `Feature`, `Scenario`, `Given`, `When`, `And` and `Then` in the caller’s `.flow` file.

Save the following as `steps/fill-search.flowpart`.

```flow
flow.clear input "Search";
flow.type input "Search" "Abuja";
flow.press "Enter" on input "Search";
```

```flow
Feature: Customer search

Scenario: Reuse the search interaction
  Given "The search page is open"
    flow.open "/customers";

  When "Search for customers in Abuja"
    flow.call "steps/fill-search.flowpart";

  Then "The result identifies the selected city"
    flow.expect visible "Results for Abuja";
```

A fragment called from `And` must expand to supported assertions. Case declarations and conditional skips belong in the caller’s `Given`. Recursive calls fail with the fragment’s source location.

## Register cleanup

`flow.cleanup.register` queues a DELETE for the configured application origin. Register it immediately after creating a disposable record. This example assumes `POST /api/orders` returns an `id`, and the app provides GET and DELETE for that ID.

```flow
Feature: Disposable order

Scenario: Read an order and remove it after the attempt
  Given "An order is created in the test environment"
    flow.api.request {
      "method": "POST",
      "url": "/api/orders",
      "json": {
        "sku": "DOCS-001",
        "quantity": 2
      }
    };
    flow.expect status "201";
    flow.extract resBody "id" as "orderId";
    flow.cleanup.register {
      "method": "DELETE",
      "url": "/api/orders/@orderId"
    };

  When "The order is read back"
    flow.api.request { "url": "/api/orders/@orderId" };

  Then "The stored quantity is correct"
    flow.expect status "200";
    flow.expect resBody "quantity" equals "2";
```

Configure `BASE_URL` or `baseUrl`. Flowstride resolves the URL and captures the API default headers at registration. Supply cleanup authorization through those headers or a supported application cleanup URL. A named context’s cookie jar and request-only headers are separate.

Cleanup runs in reverse registration order after the scenario attempt, including before a retry and during cooperative cancellation. It expects a 2xx response and has a bounded deadline. A forced process termination can prevent cleanup. Register it in an existing block and let the runner execute it after the attempt.

## Skip a scenario for one browser

`flow.skipIf` records a scenario skip when the run’s browser matches `browser`. The supported values are `chromium`, `firefox` and `webkit`. Add a reason that explains the prerequisite. Put the command first in `Given`, or immediately after `flow.data.cases` when the scenario has a dataset.

```flow
Feature: Recorded speech

Scenario: Verify the transcript from a fixture
  Given "The speech fixture is available"
    flow.skipIf {
      "browser": "webkit",
      "reason": "Microphone fixture injection requires Chromium"
    };
    flow.injectAudio "fixtures/voice-note.wav";
    flow.open "/transcription";

  When "The application records the sample"
    flow.click button "Start recording";
    flow.waitForPipeline;
    flow.click button "Stop recording";

  Then "The transcript includes the spoken sentence"
    flow.expect transcript contains "delivery arrived";
```

This example skips WebKit. Run the microphone flow with Chromium, which supports audio-file injection. A skip applies to the single browser specified. [Audio fixture setup](/guide/audio-to-text).

## Select scenarios by tag

Put a comma-separated `Tags:` line immediately after the scenario title. Use letters, digits, underscores or hyphens, starting with a letter or digit. Tags are case-insensitive. Each scenario can declare up to 32 tags.

```flow
Feature: Order lookup

Scenario: Open the order history
Tags: smoke, orders
  Given "The customer has an account"
    flow.open "/account";

  When "The customer opens order history"
    flow.click link "Orders";

  Then "Order history is displayed"
    flow.expect visible "Order history";
```

```sh
npx flowstride run flows --tag smoke
npx flowstride run flows --ci --tag smoke --tag orders
```

Repeated `--tag` options select scenarios matching any supplied tag. The filter applies to scenarios in the chosen file or directory. Use `scenarioTags` in [configuration](/guide/configuration) for a default list. CLI tags replace that list for the run. A run with no matching scenarios reports the selection error. Remove any `only.Scenario` focus marker for a suite-wide tag run.

## Execution controls

### Deliberate wait

`flow.wait` sleeps for the given milliseconds. Use it when a deliberate delay is part of the test, such as waiting before a second click in a debounce check. For an expected change, use a retrying assertion or an event wait so it can finish as soon as the change occurs.

```flow
flow.click button "Request code";
flow.wait 750;
flow.click button "Request code";
```

It accepts an integer from 0 to 86,400,000, or a quoted whole variable such as `"{{env.WAIT_MS}}"` that resolves to an integer.

### Test log

`flow.log` adds a note to the execution output and local dashboard logs. Use it to explain an important transition. Supported variables can be interpolated. Keep credentials and private test data out of the message.

```flow
flow.log "Order submitted. Checking the confirmation page.";
```

### Interactive pause

`flow.pause` suspends execution until you resume it in Flowstride’s default dashboard. Run the flow interactively to inspect the current state. It fails in CI because the run has no person to resume it.

```flow
flow.pause "Inspect the delivery form, then resume";
flow.click button "Continue to payment";
```

### Action pacing

`flow.pace` adds a delay before supported browser actions for the current scenario. Use it to make actions easier to follow in the default test view. Set it back to zero to restore normal speed. It takes milliseconds from 0 to 60,000 or a quoted whole variable that resolves to that integer.

```flow
flow.pace 250;
flow.type input "City" "Lagos";
flow.click button "Find delivery options";
flow.pace 0;
```

### Continue checking after a failure

Use `flow.soft` for independent checks whose failures should be reported together. The example assumes a checkout form with two required fields. If the email check fails, the password check still runs and the scenario is marked failed. [Supported soft assertions](/reference/assertions#continue-after-a-failed-assertion).

```flow
flow.soft expect visible "Email";
flow.soft expect visible "Password";
```

Use `flow.try` for an optional action, for example dismissing a banner that may be absent. A skipped optional action has its own result. The subsequent steps keep their own pass or fail marks.

```flow
flow.try click button "Dismiss welcome banner";
flow.expect visible "Order history";
```
