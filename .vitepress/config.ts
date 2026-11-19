import { defineConfig } from 'vitepress';
import { nav } from './nav';
import { sidebar } from './sidebar';

export default defineConfig({
  title: 'Flowstride Docs',
  titleTemplate: ':title · Flowstride Docs',
  description: 'Learn Flowstride (FS) 2.0 with runnable browser and API tests, JavaScript and TypeScript helpers, fixtures and CI guides.',
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
        { name: 'keyword.control', match: '\\b(?:Feature|Scenario|Given|When|Then|And|let|import|from|as|only|stop)\\b' },
        { name: 'entity.name.function', match: '\\b(?:flow|game)\\.[A-Za-z_][A-Za-z0-9_.]*' },
        { name: 'constant.language', match: '\\b(?:true|false|null|persist|global|page)\\b' },
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/heroamogs/flowstride' }],
    footer: {
      message: 'Flowstride is MIT licensed. Flowstride Cloud offers free and paid workspace plans.',
      copyright: '© 2026 Flowstride · A TESTCRAFT TECH product'
    }
  }
});
