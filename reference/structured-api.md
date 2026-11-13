# Structured API requests and network control

Both Flowstride engines can send direct API requests and observe requests made by the browser. Both can be used in the same scenario. Use [direct API commands](/reference/api-commands) for setup and service checks. Use browser routes and observers to test what the page sends and receives.

## Requests

`flow.api.request` sends a request and sets the current API response for `flow.expect`, `flow.extract` and `flow.api.expectSchema`. Use a full HTTP(S) URL or configure `BASE_URL` in `.env` or `baseUrl` in your configuration for relative URLs. The default method is GET. Other methods are HEAD, OPTIONS, POST, PUT, PATCH and DELETE.

| Field | Use |
| --- | --- |
| `url`, `method` | Target endpoint and HTTP method |
| `query` | Query parameters. Arrays send repeated keys |
| `headers` | String header names and values. Use environment variables for authorization |
| `json`, `form`, `multipart`, `body`, `binary` | Choose one body source when the method accepts a body |
| `timeout` | Request deadline in milliseconds, up to 120,000 |
| `followRedirects` | Defaults to `false`. Explicit following is limited to the same origin and up to five redirects |
| `saveAs` | Save a successful response body to private local API evidence using a simple filename |

GET and HEAD take no body. Structured requests manage HTTP framing headers. Text responses used for assertions have a 1 MiB limit, while binary responses and saves can use up to 20 MiB. Request body content is limited to 20 MiB.

### Query parameters and JSON

This search API accepts repeated city parameters, and the create endpoint accepts a JSON order.

```flow
flow.api.request {
  "url": "/api/orders",
  "query": {
    "city": ["Lagos", "Abuja"],
    "page": 1
  }
};
flow.expect status "200";

flow.api.request {
  "method": "POST",
  "url": "/api/orders",
  "json": {
    "sku": "DOCS-001",
    "quantity": 2,
    "priority": false
  },
  "timeout": 15000
};
flow.expect status "201";
flow.extract resBody "id" as "orderId";
```

JSON preserves types. Query and form scalars are encoded as text. A whole reference to a stored JSON value can be used within the supported typed fields.

### URL-encoded form and plain text

Use `form` for an endpoint that accepts `application/x-www-form-urlencoded`. For a text endpoint, put the literal text in `body`.

```flow
flow.api.request {
  "method": "POST",
  "url": "/api/preferences",
  "form": {
    "city": "Lagos",
    "channels": ["email", "sms"]
  }
};
flow.expect status "200";

flow.api.request {
  "method": "POST",
  "url": "/api/notes",
  "body": "Customer will collect this order at the depot."
};
flow.expect status "201";
```

### Multipart upload

A multipart request sends several pieces of data together. Think of filling in a description, attaching a PDF, and submitting both in one form.

Create `fixtures/document.pdf` in your project. The server receives a text field named `description` and a file part named `file`. Flowstride supplies the multipart content type and boundary.

```flow
flow.api.request {
  "method": "POST",
  "url": "/api/documents",
  "multipart": {
    "description": "Test document",
    "file": {
      "path": "fixtures/document.pdf",
      "contentType": "application/pdf"
    }
  },
  "timeout": 15000
};
flow.expect status "201";
```

A multipart request accepts up to 64 fields. A file part takes a project-local `path` and an optional `contentType`. Flowstride uses the basename as the uploaded filename. Omit a manual `Content-Type` header for multipart.

### Binary request and response

`binary` sends the contents of the fixture directly as the HTTP body. `saveAs` writes the successful response body under `.flowstride/api-responses/` with a flow-specific prefix. Check status and headers as usual.

```flow
flow.api.request {
  "method": "PUT",
  "url": "/api/reports/FS-102",
  "binary": {
    "path": "fixtures/report.pdf",
    "contentType": "application/pdf"
  }
};
flow.expect status "204";

flow.api.request {
  "url": "/api/reports/FS-102",
  "saveAs": "report.pdf"
};
flow.expect status "200";
flow.expect resHeader "content-type" equals "application/pdf";
```

### Redirects and response headers

Check a redirect as returned or opt in to following it. The example assumes a GET route at `/orders/latest` that redirects to a same-origin JSON endpoint.

```flow
flow.api.request { "url": "/orders/latest" };
flow.expect status "302";

flow.api.request {
  "url": "/orders/latest",
  "followRedirects": true
};
flow.expect status "200";
```

Use HEAD to check response headers without requesting the body, or OPTIONS to check what the endpoint advertises. The redirect policy blocks a change of origin or an automatic redirect that would resend a write request.

## Named API contexts

A customer can place an order and an administrator can approve it in the same test. Give each user a named API context so you can switch between their requests while keeping their sign-ins separate.

`flow.api.create` configures a named client with a base URL, optional default `headers` and a separate cookie jar when `cookies` is `true`. `flow.api.use` selects it. Requests from that context stay on its configured origin. The last response is also kept separately in each context.

This example assumes the application accepts a test administrator token at `/api/me`. If the app uses cookies instead, sign in with a request in that context and let its jar store the returned cookies. Enable cookie handling for each context that needs it.

```flow
flow.api.create {
  "name": "administrator",
  "baseUrl": "{{env.API_URL}}",
  "headers": {
    "Authorization": "Bearer {{env.ADMIN_TEST_TOKEN}}"
  },
  "cookies": true
};
flow.api.use { "name": "administrator" };
flow.api.request { "url": "/api/me" };
flow.expect resBody "role" equals "admin";
flow.api.use { "name": "default" };
flow.api.close { "name": "administrator" };
```

If `baseUrl` is omitted, the context uses the run’s configured base URL. `flow.api.close` removes the named client and its state. The `default` context stays available. Selecting an API context also affects ordinary API requests. To act as that person in the browser, establish a browser session explicitly. [API and UI sessions](/guide/api-and-ui).

## Polling

An export may take a few seconds after the server accepts it. Polling means asking “Is it ready yet?” at regular intervals so the test can continue as soon as the file is ready.

`flow.api.poll` sends repeated GET requests within a single deadline. Use it for a job or status resource whose JSON response changes over time. Supply `path` and a typed `equals` value. The interval defaults to 500 ms and can be 50–30,000 ms.

```flow
flow.api.request {
  "method": "POST",
  "url": "/api/jobs",
  "json": {
    "kind": "order-export"
  }
};
flow.expect status "202";
flow.extract resBody "id" as "jobId";
flow.api.poll {
  "url": "/api/jobs/@jobId",
  "path": "status",
  "equals": "completed",
  "interval": 500,
  "timeout": 15000
};
flow.extract resBody "downloadUrl" as "exportUrl";
```

The check needs a 2xx JSON response and the expected field value. Flowstride retries a mismatched result and HTTP 404, 408, 425, 429 or 5xx. Other HTTP errors, such as 401, stop polling. A transport error can also stop it. The report shows the last observed response and the attempt count on failure. [JSON Schema and polling assertions](/reference/assertions#api-contracts-and-polling).

## Browser network

Use browser routing and observers for requests generated by the application page in the current profile. Direct API requests follow their own transport. If a service worker handles the traffic, use a browser profile with `serviceWorkers: "block"` for tests that need interception.

### Routes

Suppose you want to check the **No orders found** screen for an account that usually has orders. A route can give the browser an empty list just for that test, so you can check how the page behaves.

`flow.network.route` matches a URL and optionally an HTTP method. It can fulfill a mock response, patch a real response, continue with optional request changes or abort the request. Add `delay` in milliseconds to simulate latency. The limit is 120,000 ms.

This route delays the response to a POST containing `operationName: "GetOrders"` and returns an empty list. Other POST bodies fall through to the next handler or the real service.

```flow
flow.network.route {
  "name": "slow-orders",
  "url": "**/api/orders",
  "method": "POST",
  "requestBody": {
    "path": "operationName",
    "equals": "GetOrders"
  },
  "mode": "fulfill",
  "json": [],
  "delay": 1500,
  "times": 1
};
flow.click button "Load orders";
flow.expect visible "No orders found";
flow.network.unroute { "name": "slow-orders" };
```

The body predicate reads a JSON field by its dotted path or array index and compares its typed value. A missing field, a non-JSON body or a body larger than 1 MiB falls through. Only matching requests consume `times`. When that count is exhausted, further requests fall through and the route can be removed or replaced.

| Mode | What happens |
| --- | --- |
| `fulfill` | Return a synthetic response with optional `status`, `headers`, `contentType` and one of `json`, text `body` or project-local `fixture` |
| `patch` | Fetch the actual response and shallow-merge a `json` object or replace its body |
| `continue` | Forward the request, optionally changing `request.url`, `request.method`, `request.headers` or `request.body` |
| `abort` | Block the matching request |

### Capture an event

When you click **Place order**, the server’s response can arrive before the click step finishes. Start listening first so the test can inspect that response afterward.

`flow.network.arm` watches for a matching request or response. Set `kind` to `request` for outgoing traffic or keep the default `response`. Use `status` to filter responses and `method` to filter either kind. The deadline starts at arming. After the trigger, `flow.network.wait` waits for and retains one captured event.

```flow
flow.network.arm {
  "name": "orderResponse",
  "url": "**/api/orders",
  "kind": "response",
  "method": "POST",
  "timeout": 5000
};
flow.click button "Place order";
flow.network.wait { "name": "orderResponse" };
flow.network.expect {
  "name": "orderResponse",
  "status": 201
};
flow.extract network "orderResponse" "body.orderId" as "orderId";
flow.expect visible "Order @orderId placed";
```

Here `body.orderId` is a field in the captured response, and `@orderId` is the value saved for the next step. Use `*` within a URL segment or `**` across segments. A capture has a 20 MiB body limit. [All network assertion inputs](/reference/assertions#flow-network-expect).
