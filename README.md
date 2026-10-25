---
search: false
---

# Flowstride documentation

The official Flowstride documentation site, built with VitePress. Guides cover OS and Cloud capabilities, manual testing, automation, native CI, browser games, and evidence.

## Run locally

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Open the URL printed in the terminal.

## Validate

```sh
npm run check
```

Checks validate public content, JSON formatting, example asset hashes and the manual design structure, then build the site and verify rendered links and heading anchors, including navigation. Local search is generated during the build.

CI installs the released public OS parser to validate every Flow example, the homepage preview and independent language-rule checks. For local cross-engine validation, set `FLOWSTRIDE_OS_ROOT` and `FLOWSTRIDE_CLOUD_ROOT` to built engine folders before running the same command. Those local paths are not part of the site. Syntax validation does not establish that an illustrative endpoint, account or external service exists; runnable fixtures need execution checks too.

To serve the production build locally:

```sh
npm run preview -- --host 127.0.0.1 --port 5173
```

## Examples

Editable example source lives in `public/examples`. After changing an example, regenerate its downloads and hash manifest:

```sh
python3 scripts/package-examples.py
```

The first-flow guide uses the normal `npm i flowstride` and `npx flowstride init` route, with no separate starter download. The optional storage example is a local demonstration, not a production authentication implementation.

## Editorial rules

- Verify syntax against the parser and behavior against the relevant engine or UI.
- Use two-space indentation in examples. Expand multi-field or nested JSON objects across lines; keep short single-field objects inline with consistent spacing.
- Distinguish native features, project plugins, and suggested team practices.
- Document installation through npm and Cloud account login, including free accounts.
- Keep internal release identifiers and distribution infrastructure out of public content and downloads.
- Never include real credentials, private source, local user paths, or customer data.
- Preserve existing documentation routes where possible.
- Describe evidence access and collaboration limits accurately.

The OS engine is MIT licensed. Cloud includes free accounts and plan-based features.
