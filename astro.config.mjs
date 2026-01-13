// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],

  adapter: node({
    mode: 'standalone'
  }),

  vite: {
    plugins: [tailwindcss()]
  }
});