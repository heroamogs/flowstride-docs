# Report Playwright Test results in Flowstride

Flowstride (FS) 2.0 includes a reporter for existing Playwright Test suites. Add `flowstride/playwright-reporter` to the reporter list in your JS or TS Playwright configuration.

```js
reporter: [
  ['list'],
  ['flowstride/playwright-reporter'],
],
```

Then run Playwright and open the reports from the same project directory.

```sh
npx playwright test
npx flowstride report
```

Playwright still controls fixtures, parallel workers, retries and the exit code. Flowstride records the completed test outcomes, attempts, durations and failure diagnostics. **Saved Runs** includes these records alongside completed `npx flowstride run --ci` results under `.flowstride/run-history/`. Use `--no-open` to print the report URL. For an active FS run, use `npx flowstride run` to open the live dashboard. [Live dashboard](/reporting/dashboard)

## Share a helper between suites

The packaged `examples/native-workflows/playwright-reporting` folder uses one JS helper to calculate a discount in both a Playwright spec and FS scenario. Copy it to a test project with Flowstride installed. From the copied directory, run `npx playwright test`, then `npx flowstride run flows/discounts.flow --ci`. Open **Saved Runs** to see both results. [JS and TS helpers](/flow-language/getting-started/helpers)

## Attach evidence

Attachments are opt-in. Add an options object to the Flowstride reporter entry with an `attachments` array listing the types to keep. Supported types are `screenshot`, `video`, `trace` and `text`. Screenshot, video and trace imports respect your Flowstride evidence settings. Keep file-backed attachments inside the project and available when Playwright finishes.

Flowstride masks detected secrets in saved failure diagnostics and text attachments. Use `redactEnv` to name extra environment variables whose values should be masked. Review binary evidence before sharing it. [Evidence and privacy](/security/evidence-and-replay)
