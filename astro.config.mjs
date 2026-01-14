// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Solo usamos la integración oficial (compatible con Tailwind v3)
  integrations: [tailwind()],

  // Importante para SSR
  output: 'server',

  adapter: node({
    mode: 'standalone'
  }),
});