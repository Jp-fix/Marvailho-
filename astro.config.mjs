// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://exemple.tld',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
  markdown: {
    smartypants: true,
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
