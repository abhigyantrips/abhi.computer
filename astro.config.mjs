// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://abhi.computer",
	output: "static",

	session: {
		driver: {
			entrypoint: "unstorage/drivers/null",
		},
	},

	adapter: cloudflare({
		imageService: 'cloudflare'
	}),

	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Maple Mono",
			cssVariable: "--font-mono",
		},
	],

	markdown: {
		shikiConfig: {
			theme: "vitesse-dark",
		},
	},

	integrations: [
		mdx(),
		sitemap(),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
