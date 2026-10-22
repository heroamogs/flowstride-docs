import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import DocsHome from './DocsHome.vue';
import Layout from './Layout.vue';
import './custom.css';
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) { app.component('DocsHome', DocsHome); }
} satisfies Theme;
