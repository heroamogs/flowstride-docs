# Why Flowstride?

A useful test tells the next person what the user tried to do, what happened, and how to reproduce a failure. Flowstride keeps those three concerns close together.

## Describe intent in the flow

```flow
flow.click button "Log in" near "Sign up";
flow.type input "Email" "{{env.TEST_EMAIL}}";
flow.type input "Password" "{{env.TEST_PASSWORD}}";
flow.click button "Login";
flow.expect visible "Logout";
```

Readable targets make reviews easier. Element qualifiers, CSS selectors, and spatial relationships let you become more specific when a page has repeated labels. You still need an application with stable, distinguishable controls.

## Keep API setup and browser behavior together

Create data with an API, extract a returned identifier, then use the UI to exercise the customer journey. Both parts share extracted/generated values in the flow file, so you can verify the same entity through each interface. [API and UI in one flow](/guide/api-and-ui) shows the complete journey.

## Use one suite locally and in CI

Interactive runs provide step history, network records, Replay, and local debugging. Native CI runs the `.flow` suite without a custom runner file and produces machine-readable reports. A small generated GitHub workflow handles installation and evidence retention.

## Give manual work a place in the process

Map a user journey, write observable expected results, execute it manually, and preserve the run with defects and evidence. A stable manual case can become an automated scenario later. Conversion is an authoring workflow; there is no automatic canvas-to-DSL converter.

## Know the boundary

Flowstride uses Playwright for browser control, but does not expose every Playwright feature as a native DSL command. It supports Chromium, Firefox and WebKit, with native profiles, retrying assertions, network control, downloads, evidence, accessibility, component tests and browser-game APIs. Browser/device qualification still has [explicit limits](/guide/browser-compatibility). See [capabilities and limits](/reference/capabilities) for the distinction between native features and plugin extensions.
