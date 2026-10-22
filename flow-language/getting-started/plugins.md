# Extend a flow with plugins

Use a TypeScript plugin for a focused application-specific action that is not yet native. Keep native CI orchestration in Flowstride rather than replacing it with a project `.cjs` runner.

## Register an alias

Create `plugins/account.ts`:

```ts
import type { FlowstrideSDK } from 'flowstride/dist/types';

export async function verifyHeading(sdk: FlowstrideSDK, data: { text: string }) {
  const page = sdk.browser.page();
  await page
    .getByRole('heading', {
      name: data.text,
      exact: true
    })
    .waitFor();
}
```

Use it in a flow:

```flow
Feature: Account
let account = "account"

Scenario: An account heading is visible

Given "The account is open"
  flow.open "/account";

When "The page is ready"
  flow.expect visible "Account";

Then "The heading matches"
  account.verifyHeading { "text": "Account" }
```

A bare alias path resolves under `pluginsDir` (default `plugins`). An explicit path is project-relative. Plugin files and symlink targets must remain inside the project. The loader expects TypeScript exports.

## SDK surface

| SDK area | Use |
| --- | --- |
| `browser.page()` | Current Playwright Page for a browser extension |
| `game` | Native GameSDK actions without an internal class import |
| `run.device` | Active device profile |
| `run.attach(name, data)` | Write a named attachment under the run artifact directory |
| `ui` | Click, type, visibility and text helpers |
| `api` | Adapter-backed HTTP helpers |
| `state.get/set` | Plugin state store; use explicitly within plugins |
| `env.get` | Read an environment value |
| `expect` | Equality, contains and visibility helpers |
| `log`, `utils` | Logging, sleep and small ID helper |

`state.set` is not the same namespace as DSL `flow.extract` variables. Return values are not automatically bound by the current alias-call grammar. Use explicit plugin state or native extraction instead of inventing `as` syntax after a plugin action.

## Extension boundaries

A Playwright Page is not the Playwright Test runner. Features such as runner fixtures, projects and retries need their own integration; importing `@playwright/test` into both engine paths can cause module-loading conflicts.

Some legacy SDK members are placeholders: `db.connect` is not a production database driver, and `otp.generate` is not a TOTP implementation. Use a suitable library in a project plugin when that behavior is required. Credentials still belong in environment secrets.

In CI, plugin calls are bounded by the configured timeout. A timed-out asynchronous plugin may need its own cancellation/cleanup design; keep long-running external work explicit.
