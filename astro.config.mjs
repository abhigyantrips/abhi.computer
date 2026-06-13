// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Jersey 10',
      cssVariable: '--font-display',
    }
  ],
  
  vite: {
    plugins: [tailwindcss()]
  }
});