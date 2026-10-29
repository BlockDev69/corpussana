// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify({
    // Le site n'utilise pas d'Edge Functions : inutile de lancer leur émulateur Deno en dev
    devFeatures: { edgeFunctions: false },
  }),
});
