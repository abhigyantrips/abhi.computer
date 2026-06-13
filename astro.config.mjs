// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://abhi.computer',
  output: 'static',

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Jersey 10',
      cssVariable: '--font-display',
    }
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});