<script setup lang="ts">
const paths = [
  { n: '01', tag: 'AUTOMATE', title: 'Your first working flow', detail: 'Install Flowstride, configure your application, and verify a browser journey. Add API setup when your test needs it.', link: '/guide/your-first-script', action: 'Write a flow' },
  { n: '02', tag: 'TEST MANUALLY', title: 'A case worth repeating', detail: 'Plan the coverage, map the journey, record outcomes, and hand over a defect someone can reproduce.', link: '/manual-workspace/manual-testing', action: 'Open the manual guide' },
  { n: '03', tag: 'RUN IN CI', title: 'From laptop to pipeline', detail: 'Run your existing flows without a custom runner. Keep clear failure status, reports, and evidence.', link: '/guide/native-ci-games', action: 'Set up native CI' },
  { n: '04', tag: 'TEST GAMES', title: 'Beyond the DOM', detail: 'Drive a canvas, inspect game state, compare screens, and select live Three.js objects.', link: '/games/getting-started', action: 'Explore game testing' }
];
const features = [
  {
    "title": "API + UI, together",
    "detail": "Create through an API, extract a value and verify the same record in the browser.",
    "link": "/guide/api-and-ui"
  },
  {
    "title": "Email OTP journeys",
    "detail": "Reuse generated credentials and retrieve a delivered code through FlowMail.",
    "link": "/guide/email-otp"
  },
  {
    "title": "Tables and cells",
    "detail": "Find a row, act inside a cell and carry extracted data into another page.",
    "link": "/guide/table-testing"
  },
  {
    "title": "Tabs and iframes",
    "detail": "Move between windows and verify controls inside embedded documents.",
    "link": "/guide/tabs-and-iframes"
  },
  {
    "title": "Audio-to-text",
    "detail": "Feed a microphone fixture and verify the transcript your application produces.",
    "link": "/guide/audio-to-text"
  },
  {
    "title": "Forms and dates",
    "detail": "Select dependent options, set dates and check the exact accepted values.",
    "link": "/guide/forms-and-dates"
  },
  {
    "title": "Independent users",
    "detail": "Keep customer and admin browser profiles independently signed in.",
    "link": "/guide/native-browser-workflows#separate-users-in-one-test"
  },
  {
    "title": "Network and downloads",
    "detail": "Mock responses, wait for events and verify exported files natively.",
    "link": "/guide/native-browser-workflows#mock-requests-and-wait-for-network-events"
  },
  {
    "title": "Accessible components",
    "detail": "Mount a component, check its behavior and inspect accessibility regressions.",
    "link": "/guide/component-testing"
  },
  {
    "title": "Useful failure evidence",
    "detail": "Read target and condition results, actual values, call logs and source locations.",
    "link": "/guide/assertions-and-diagnostics"
  },
  {
    "title": "Data and saved sessions",
    "detail": "Generate once, reuse deliberately and restore origin-scoped browser storage.",
    "link": "/flow-language/getting-started/variables"
  },
  {
    "title": "Canvas and Three.js games",
    "detail": "Drive input, select objects and verify exposed game state and rendering.",
    "link": "/games/getting-started"
  }
];
const references = [
  ['Language & variables', '/flow-language/getting-started/variables', 'Syntax, scope and generated data'],
  ['Commands & assertions', '/reference/ui-commands', 'Find the action or check you need'],
  ['Sessions & storage', '/flow-language/getting-started/sessions', 'Save and restore authentication state'],
  ['Dashboard & Replay', '/reporting/dashboard', 'Inspect a screen or replay a request'],
  ['OS & Cloud', '/guide/editions', 'Understand the installation and handoff'],
  ['Native browser workflows', '/guide/native-browser-workflows', 'Profiles, mocks, downloads, accessibility and components'],
  ['API and UI together', '/guide/api-and-ui', 'Prepare data and verify the browser journey in one flow'],
  ['Troubleshooting', '/guide/troubleshooting', 'Resolve common execution problems']
];
</script>
<template>
  <div class="docs-home">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> THE FLOWSTRIDE HANDBOOK</p>
        <h1 id="home-title">Test the journey.<br><span>Keep the story.</span></h1>
        <p class="hero-lead">Browser, API and game automation in readable flows. Manual tests with clear steps, outcomes and evidence. Learn the complete journey, from setup to CI and diagnosis.</p>
        <div class="hero-actions">
          <a class="home-button primary" href="/guide/getting-started">Start building <span aria-hidden="true">↗</span></a>
          <a class="home-button secondary" href="/manual-workspace/manual-testing">Explore manual testing <span aria-hidden="true">→</span></a>
        </div>
        <p class="hero-footnote">Browser & API <span>·</span> Manual flows <span>·</span> Native CI <span>·</span> Browser games</p>
      </div>
      <div class="flow-preview" aria-label="An example Flowstride test">
        <div class="preview-title"><span class="file-icon" aria-hidden="true">ƒ</span> flows/order.flow <span class="preview-pill">FLOW LANGUAGE</span></div>
        <pre v-pre><code><span class="syn-key">Feature:</span> Order verification
<span class="syn-key">Scenario:</span> API and browser agree

<span class="syn-key">Given</span> <span class="syn-string">"The order exists"</span>
  <span class="syn-call">flow.get</span> <span class="syn-string">"/api/orders/FS-101"</span>;
  <span class="syn-call">flow.expect</span> status <span class="syn-string">"200"</span>;
  <span class="syn-call">flow.extract</span> resBody <span class="syn-string">"id"</span> as <span class="syn-string">"orderId"</span>;

<span class="syn-key">When</span> <span class="syn-string">"The same order is opened"</span>
  <span class="syn-call">flow.open</span> <span class="syn-string">"/orders/@orderId"</span>;

<span class="syn-key">Then</span> <span class="syn-string">"Its identifier is visible"</span>
  <span class="syn-call">flow.expect</span> text <span class="syn-string">"@orderId"</span>;</code></pre>
        <div class="preview-bottom"><span class="preview-status"><span aria-hidden="true">✓</span> One readable journey</span><a href="/guide/api-and-ui">Build an API + UI journey →</a></div>
      </div>
    </section>

    <section class="learning-section" aria-labelledby="learning-title">
      <div class="section-heading"><div><p class="eyebrow">CHOOSE YOUR STARTING POINT</p><h2 id="learning-title">What are you testing today?</h2></div><span class="section-aside">Practical guides. Clear next steps.</span></div>
      <div class="learning-grid">
        <a v-for="path in paths" :key="path.n" :href="path.link" class="learning-card">
          <div class="card-top"><span class="card-number">{{ path.n }}</span><span class="card-tag">{{ path.tag }}</span><span class="card-arrow" aria-hidden="true">↗</span></div>
          <h3>{{ path.title }}</h3><p>{{ path.detail }}</p><span class="card-action">{{ path.action }} <span aria-hidden="true">→</span></span>
        </a>
      </div>
    </section>

    <section class="workflow-section" aria-labelledby="workflow-title">
      <div class="section-heading"><div><p class="eyebrow">FROM A SIMPLE CHECK TO A COMPLETE JOURNEY</p><h2 id="workflow-title">Explore what your flows can do.</h2></div><a class="text-link" href="/guide/feature-map">See the feature map →</a></div>
      <div class="workflow-grid"><a v-for="feature in features" :key="feature.link" :href="feature.link" class="workflow-card"><h3>{{ feature.title }} <span aria-hidden="true">↗</span></h3><p>{{ feature.detail }}</p></a></div>
    </section>

    <section class="reference-section" aria-labelledby="reference-title">
      <div class="reference-intro"><p class="eyebrow">ALREADY UP AND RUNNING?</p><h2 id="reference-title">Keep the reference<br>within reach.</h2><p>Go straight to the syntax, behavior, or debugging guide you need.</p><a href="/reference/capabilities" class="text-link">Capabilities & current limits →</a></div>
      <div class="reference-grid"><a v-for="[title,link,detail] in references" :key="link" :href="link"><span><strong>{{ title }}</strong><small>{{ detail }}</small></span><span class="ref-arrow" aria-hidden="true">↗</span></a></div>
    </section>

    <aside class="home-release"><span class="release-mark" aria-hidden="true">i</span><p><strong>Start locally. Connect when you need more.</strong> Install Flowstride OS from npm. Connect a free Cloud account to use workspace features within your plan limits.</p><a href="/guide/releases">Installation &amp; updates <span aria-hidden="true">→</span></a></aside>
  </div>
</template>
