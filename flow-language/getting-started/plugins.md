# Extend a flow with plugins

A TypeScript plugin adds a focused application action while Flowstride keeps browser lifecycle, scenario status, cleanup and evidence ownership. OS and Cloud support the common SDK below. Normal npm installation supplies the compatible TypeScript compiler used by the loader.

## Register and invoke an export

Create `plugins/account.ts`:

```ts
import type { FlowstrideSDK } from 'flowstride/dist/types';

export async function verifyHeading(sdk: FlowstrideSDK, data: { text: string }) {
  const page = sdk.browser.page();
  await page.getByRole('heading', { name: data.text, exact: true }).waitFor();
  sdk.run.attach('heading.txt', data.text);
}
```

```flow
Feature: Account verification
  let account = "account";

  Scenario: The account heading is visible
    Given "The account is open"
      flow.open "/account";

    When "The account page loads"
      flow.expect visible "Account";

    Then "The heading matches"
      account.verifyHeading {
        "text": "Account"
      };
```

A bare path resolves under `pluginsDir` (default `plugins`); an explicit path is project-relative. The alias belongs to its Feature or Scenario. Plugin files and resolved symlinks must stay inside the project. Export the named function; a missing export fails explicitly. JSON string values in the call support normal environment and variable interpolation.

## Common SDK contract

| Method | Arguments and result |
| --- | --- |
| `browser.page()` | Current Playwright Page in the selected profile/tab |
| `game` | Native GameSDK methods |
| `api.get(url, headers?)`, `api.delete(url, headers?)` | Promise of the parsed response body |
| `api.post/put/patch(url, body, headers?)` | Promise of the parsed response body; headers are a string map |
| `ui.click(selector)`, `ui.type(selector, text)` | Browser action helpers |
| `ui.getText(selector)` | Trimmed text from the first CSS match |
| `ui.isVisible(selector)` | Promise of a boolean; catches a visibility failure |
| `state.get(key)`, `state.set(key, value)` | Plugin store access |
| `state.delete(key)`, `state.clear()` | Remove one value or clear the plugin store |
| `env.get(key)` | Environment value or `undefined` |
| `expect.visible(selector)` | Wait/check visibility; throw on failure |
| `expect.equals(actual, expected, message?)` | Strict equality check, not a deep object matcher |
| `expect.contains(actual, expected, message?)` | String/array inclusion check |
| `run.device`, `run.artifactsDir` | Active device label and artifact directory |
| `run.attach(name, textOrBuffer)` | Write an attachment and return its actual path |
| `log(message)` | Plugin log entry |
| `utils.sleep(ms)`, `utils.generateId(length?)` | Explicit delay and simple generated ID |

HTTP helpers update the adapter's latest state. Use a native API assertion afterward when status/header checks matter. An API helper returning a body does not itself establish HTTP or business success. Plugin SDK calls can access services and files with the runner's privileges: keep extensions small and reviewable. Plugins are trusted project code, not a sandbox; do not execute unreviewed plugins with application or Cloud secrets. [CI trust boundaries](/security/ci-and-sharing#trust-the-code-before-providing-secrets).

`state` belongs to plugins; it is not automatically the same namespace as DSL `@name` extractions. A return value from an ordinary alias invocation is not automatically a new DSL variable. Use supported extraction or an explicit application contract instead of assuming a return-to-variable binding.

## Attach useful evidence

Use a simple filename such as `account-state.json`; path traversal names are rejected. Flowstride may prefix the name with the flow identity to separate files. Keep and use the returned path rather than guessing it. Attachments are ordinary files: remove secrets before writing them, and apply your artifact retention rules.

## Cloud extras and boundaries

A directly used Cloud plugin manager can additionally expose helpers such as `env.require` and truth assertions. The OS launcher can supply its common PluginManager while executing a compatible Cloud worker, so portable plugins should use the common table above and explicitly validate required environment values.

The `db.connect` and `otp.generate` scaffold surfaces are not a production database driver or a real TOTP implementation. Use a real client in your own narrow plugin when needed. `utils.generateId` is not a security credential or a guaranteed globally unique identifier.

For [exact iframe actions](/guide/tabs-and-iframes), use `sdk.browser.page().frameLocator(...)`. Avoid importing private workers or building a custom `.cjs` runner for a single extension. Native [network, download, clock, accessibility and component commands](/reference/native-browser-commands) already cover many common extensions.
