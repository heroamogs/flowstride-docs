# Browser environments and independent users

OS and Cloud support Chromium, Firefox and WebKit, named browser profiles and validated context settings. Choose the browser with `--browser`; choose separate profiles when users need independent cookies, storage, tabs and permissions.

## Grant location and verify the application's result

This fragment assumes a local app at `http://127.0.0.1:3000` with a **Locate me** button and a result element. Put setup/actions under `Given`/`When` in your scenario:

```flow
flow.browser.permissions {
  "permissions": ["geolocation"],
  "origin": "http://127.0.0.1:3000"
};
flow.browser.geolocation {
  "latitude": 6.5244,
  "longitude": 3.3792
};
flow.open "/location";
flow.click button "Locate me";
flow.assert.that {
  "selector": "#location",
  "condition": "containsText",
  "value": "6.5244"
};
```

Set and assert the coordinates your application expects. Granting a permission is distinct from setting a position. Use `flow.browser.clearPermissions {};` under an action block to reset grants, then test your application's next request or denied-state behavior. Permissions differ across browser/OS combinations; verify the selected engine and origin.

## Offline recovery

```flow
flow.open "/connection";
flow.browser.offline {
  "value": true
};
flow.click button "Refresh data";
flow.assert.that {
  "selector": "#connection-state",
  "condition": "text",
  "value": "Offline"
};
flow.browser.offline {
  "value": false
};
flow.click button "Refresh data";
flow.assert.that {
  "selector": "#connection-state",
  "condition": "text",
  "value": "Connected"
};
```

Your application must expose and implement these states. Keep recovery commands under an action block. Offline mode affects the selected profile's browser network, not the direct API adapter or the operating system. A service worker may return cached content; decide whether to test caching or block service workers deliberately.

## Profile settings and environment values

String values inside native command payloads support environment interpolation. For example:

```flow
flow.browser.create {
  "name": "regional-customer",
  "options": {
    "locale": "en-GB",
    "timezoneId": "Africa/Lagos",
    "colorScheme": "dark",
    "reducedMotion": "reduce",
    "httpCredentials": {
      "username": "{{env.HTTP_USER}}",
      "password": "{{env.HTTP_PASSWORD}}"
    }
  }
};
flow.open "/protected";
```

HTTP credentials answer a server's HTTP authentication challenge; they do not fill an application's login form. Verify a protected page or server-observed identity after navigating. New profiles are selected immediately. `flow.browser.use` switches back to an existing live profile.

The JSON configuration loader applies documented overrides such as `BASE_URL`; it does not recursively expand arbitrary `{{env.NAME}}` strings throughout `browserOptions`. Use command payloads for the supported environment-valued options above. [Configuration precedence](/guide/configuration) explains the distinction.

## Proxy and client certificates

A profile's `options.proxy` accepts `server`, optional `bypass`, `username` and `password`. Supply credentials from environment values in a native profile command. Check the server-observed outcome; a context option alone is not evidence that every request used your intended route.

For mutual TLS, `options.clientCertificates` accepts an array of origin-bound certificates with project-local `certPath`/`keyPath`, or `pfxPath`, and optional passphrase. Keep the files and passphrase private. Paths must remain inside the project. Test against your actual mTLS endpoint and selected browser/platform; supplying a client certificate is separate from ignoring server certificate errors.

See [all supported settings](/reference/native-browser-commands#browser-settings), [browser compatibility](/guide/browser-compatibility), and [independent-user examples](/guide/native-browser-workflows#separate-users-in-one-test).

An illustrative profile using a proxy and a private client certificate looks like:

```flow
flow.browser.create {
  "name": "private-api-ui",
  "options": {
    "proxy": {
      "server": "http://127.0.0.1:8080",
      "username": "{{env.PROXY_USER}}",
      "password": "{{env.PROXY_PASSWORD}}"
    },
    "clientCertificates": [
      {
        "origin": "https://internal.example.test",
        "certPath": "fixtures/private/client.crt",
        "keyPath": "fixtures/private/client.key",
        "passphrase": "{{env.CLIENT_KEY_PASSPHRASE}}"
      }
    ]
  }
};
```

This is an environment contract, not a bundled working proxy/certificate. Supply your authorized endpoint, private files and matching credentials, then assert what the server actually receives. Keep those files out of Git and shared evidence.
