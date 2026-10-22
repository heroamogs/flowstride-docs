# Your first automated flow

Install Flowstride with npm, initialize a project, and write a test for your application. This guide uses a login page to show browser actions and assertions. Use a test account and adapt the URL, labels, button text, and expected result to your application.

## 1. Install and initialize

In a new project folder, run:

```sh
npm init -y
npm i flowstride
npx flowstride init
```

In an existing npm project, skip `npm init -y`.

`init` creates the workspace folders and `flows/example.flow`, and attempts to install Chromium. It does not create your application or a test account. The generated flow targets a hosted demonstration site; replace its contents with your own test below.

If browser setup did not complete, run:

```sh
npx flowstride install
```

## 2. Configure your application

Create a `.env` file in the project root. Set `BASE_URL` to your application's test URL and add your test account credentials:

```dotenv
BASE_URL=http://127.0.0.1:3000
TEST_EMAIL=tester@example.test
TEST_PASSWORD=replace-with-your-test-account-password
```

Flowstride loads `.env` automatically when you run a flow, in both OS and Cloud. `BASE_URL` is the base for relative browser and API URLs: with the value above, `flow.open "/login";` opens `http://127.0.0.1:3000/login`. You do not need a `flowstride.config.json` file for this setup; the default test folder is `flows`.

For a local application, start it in a separate terminal using its normal startup command and leave it running. For a hosted application, set `BASE_URL` to its test environment URL.

Use credentials for an account that already exists in your test environment. Keep `.env` out of Git and share placeholder values in `.env.example` instead. [Configuration and environments](/guide/configuration) explains profile files and CI secrets.

### Alternative: use a configuration file

You can set the same base URL in `flowstride.config.json` instead:

```json
{
  "testDir": "flows",
  "baseUrl": "http://127.0.0.1:3000"
}
```

Choose either place for the base URL. If both are set, `BASE_URL` takes precedence over `baseUrl`. A configuration file is also useful when you want to customize timeouts, media, or other execution settings.

## 3. Write the flow

Replace the contents of `flows/example.flow` with:

```flow
Feature: Account access

Scenario: A customer can sign in

Given "The login page is open"
  flow.open "/login";

When "The customer enters valid credentials"
  flow.type input "Email" "{{env.TEST_EMAIL}}";
  flow.type input "Password" "{{env.TEST_PASSWORD}}";
  flow.click button "Sign in";

Then "The customer is signed in"
  flow.expect visible "Logout";
```

This example assumes a `/login` page with inputs labeled **Email** and **Password**, a **Sign in** button, and visible **Logout** text after successful login. Change those values to match your application.

`Given` establishes the starting state. `When` performs the customer action. `Then` checks the visible result. Keep the assertion specific enough to distinguish a successful login from the page merely loading.

## 4. Run and inspect

```sh
npx flowstride run flows/example.flow
```

Follow the local dashboard URL printed in the terminal. Select a step to inspect its captured screen and network records. After execution, the dashboard stays open for inspection; stop it with Ctrl+C.

## 5. Run the same flow in CI mode

With your application still available, run:

```sh
npx flowstride run flows/example.flow --ci
```

A successful run exits with code 0 and writes reports under `flowstride-artifacts`. Change the expected **Logout** text to something that is absent, run again, and confirm that the assertion fails with a nonzero exit code. Restore the expected text afterward.

Commit `package.json`, `package-lock.json`, the flow, and any configuration file you added. Supply test credentials through CI secrets. For a local application that Flowstride should start automatically during CI, configure [a managed local server](/guide/configuration#start-a-local-application-for-ci). See [native CI](/guide/native-ci-games) to generate a GitHub Actions workflow.

## Optional: prepare data with an API

Browser and API commands can share a scenario. If your application provides a test-data endpoint, a setup call could look like this:

```flow
flow.post "/api/test/customers" with reqBody
"""
{
  "email": "reader@example.test",
  "name": "Documentation Reader"
}
"""
flow.expect status "201";
```

The endpoint, request fields, response status, authentication, and account preparation must match your application. Flowstride does not create that endpoint. Put setup commands under `Given` in a complete scenario, assert the response, and use the same prepared customer in the browser. See the [API command reference](/reference/api-commands).

## Optional: use VS Code

Open the project folder in VS Code and use the official **Flowstride Automation** extension from publisher **flowstride** for `.flow` highlighting, completions, snippets and the editor's **Run Test** action. The CLI is still installed in your project; the extension does not replace the runtime.

The current extension requires a trusted workspace to run project code. If VS Code cannot find the intended Node executable, configure `flowstride.nodePath` to a Node.js 22.12+ executable. New runtime commands can arrive before editor completions, so the engine's parser and this command reference remain authoritative. You can also use any editor and the terminal commands above.
