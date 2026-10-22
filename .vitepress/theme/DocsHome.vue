<script setup lang="ts">
const paths = [
  { n: '01', tag: 'AUTOMATE', title: 'Your first working flow', detail: 'Create data with an API, use it in the browser, and verify the outcome. Start with a complete local example.', link: '/guide/your-first-script', action: 'Write a flow' },
  { n: '02', tag: 'TEST MANUALLY', title: 'A case worth repeating', detail: 'Plan the coverage, map the journey, record outcomes, and hand over a defect someone can reproduce.', link: '/manual-workspace/manual-testing', action: 'Open the manual guide' },
  { n: '03', tag: 'RUN IN CI', title: 'From laptop to pipeline', detail: 'Run your existing flows without a custom runner. Keep clear failure status, reports, and evidence.', link: '/guide/native-ci-games', action: 'Set up native CI' },
  { n: '04', tag: 'TEST GAMES', title: 'Beyond the DOM', detail: 'Drive a canvas, inspect game state, compare screens, and select live Three.js objects.', link: '/games/getting-started', action: 'Explore game testing' }
];
const references = [
  ['Language & variables', '/flow-language/getting-started/variables', 'Syntax, scope and generated data'],
  ['Commands & assertions', '/reference/ui-commands', 'Find the action or check you need'],
  ['Sessions & storage', '/flow-language/getting-started/sessions', 'Save and restore authentication state'],
  ['Dashboard & Replay', '/reporting/dashboard', 'Inspect a screen or replay a request'],
  ['OS & Cloud', '/guide/editions', 'Understand the installation and handoff'],
  ['Troubleshooting', '/guide/troubleshooting', 'Resolve common execution problems']
];
</script>
<template>
  <div class="docs-home">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line"></span> THE FLOWSTRIDE HANDBOOK</p>
        <h1 id="home-title">Test the journey.<br><span>Keep the story.</span></h1>
        <p class="hero-lead">Readable automation. Thoughtful manual testing. One place to learn the workflow, from the first step to the evidence.</p>
        <div class="hero-actions">
          <a class="home-button primary" href="/guide/getting-started">Start building <span aria-hidden="true">↗</span></a>
          <a class="home-button secondary" href="/manual-workspace/manual-testing">Explore manual testing <span aria-hidden="true">→</span></a>
        </div>
        <p class="hero-footnote">Browser & API <span>·</span> Manual flows <span>·</span> Native CI <span>·</span> Browser games</p>
      </div>
      <div class="flow-preview" aria-label="An example Flowstride test">
        <div class="preview-title"><span class="file-icon" aria-hidden="true">ƒ</span> flows/customer.flow <span class="preview-pill">FLOW LANGUAGE</span></div>
        <pre v-pre><code><span class="syn-key">Feature:</span> Customer access
<span class="syn-key">Scenario:</span> A customer signs in

<span class="syn-key">Given</span> <span class="syn-string">"A customer exists"</span>
  <span class="syn-call">flow.post</span> <span class="syn-string">"/api/customers"</span>

<span class="syn-key">When</span> <span class="syn-string">"The customer opens the app"</span>
  <span class="syn-call">flow.open</span> <span class="syn-string">"/account"</span>

<span class="syn-key">Then</span> <span class="syn-string">"The account is available"</span>
  <span class="syn-call">flow.expect</span> visible <span class="syn-string">"My account"</span>;</code></pre>
        <div class="preview-bottom"><span class="preview-status"><span aria-hidden="true">✓</span> One readable journey</span><a href="/guide/your-first-script">Try the complete example →</a></div>
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

    <section class="reference-section" aria-labelledby="reference-title">
      <div class="reference-intro"><p class="eyebrow">ALREADY UP AND RUNNING?</p><h2 id="reference-title">Keep the reference<br>within reach.</h2><p>Go straight to the syntax, behavior, or debugging guide you need.</p><a href="/reference/capabilities" class="text-link">Capabilities & current limits →</a></div>
      <div class="reference-grid"><a v-for="[title,link,detail] in references" :key="link" :href="link"><span><strong>{{ title }}</strong><small>{{ detail }}</small></span><span class="ref-arrow" aria-hidden="true">↗</span></a></div>
    </section>

    <aside class="home-release"><span class="release-mark" aria-hidden="true">i</span><p><strong>Start locally. Connect when you need more.</strong> Install Flowstride OS from npm. Connect a free Cloud account to use workspace features within your plan limits.</p><a href="/guide/releases">Installation &amp; updates <span aria-hidden="true">→</span></a></aside>
  </div>
</template>
