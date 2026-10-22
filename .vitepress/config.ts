import { defineConfig } from 'vitepress';
import { nav } from './nav';
import { sidebar } from './sidebar';

export default defineConfig({
  title: 'Flowstride Docs',
  titleTemplate: ':title · Flowstride Docs',
  description: 'Practical guides to browser and API automation, manual test design, native CI and browser-game testing with Flowstride.',
  lang: 'en-GB',
  cleanUrls: true,
  ignoreDeadLinks: false,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  markdown: {
    config(md) {
      // Flow placeholders are literal code, not Vue template expressions.
      const inlineCode = md.renderer.rules.code_inline!;
      md.renderer.rules.code_inline = (...args) => inlineCode(...args).replace('<code', '<code v-pre');
    },
    theme: { light: 'github-light', dark: 'github-dark' },
    languages: [{
      name: 'flow', scopeName: 'source.flowstride', aliases: ['flowstride'],
      patterns: [
        { name: 'comment.line.double-slash', match: '//.*$' },
        { name: 'string.quoted.double', begin: '"', end: '"', patterns: [{name:'constant.character.escape',match:'\\\\.'}] },
        { name: 'keyword.control', match: '\\b(?:Feature|Scenario|Given|When|Then|And|let|only|stop)\\b' },
        { name: 'entity.name.function', match: '\\b(?:flow|game)\\.[A-Za-z.]+' },
        { name: 'constant.language', match: '\\b(?:true|false|null|persist|global)\\b' },
        { name: 'constant.numeric', match: '\\b[0-9]+(?:\\.[0-9]+)?\\b' }
      ]
    }]
  },
  themeConfig: {
    logo: { src: '/logo.png', alt: 'Flowstride' },
    siteTitle: 'Flowstride', nav, sidebar,
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous guide', next: 'Next guide' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/heroamogs/flowstride-os' }],
    footer: {
      message: 'OS: MIT licensed. Cloud includes free accounts and plan-based features.',
      copyright: '© 2026 Flowstride · A TESTCRAFT TECH product'
    }
  }
});
