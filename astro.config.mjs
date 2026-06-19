// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import rehypeFigure from "@microflash/rehype-figure";

import { codeMetaTransformer } from "./src/lib/shiki-transformers.ts";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://abhi.computer",
	output: "static",

	adapter: cloudflare({
		imageService: "cloudflare",
		sessionKVBindingName: "SESSIONS",
	}),

	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Maple Mono",
			cssVariable: "--font-mono",
		},
	],

	markdown: {
		rehypePlugins: [rehypeFigure],
		shikiConfig: {
			themes: {
				light: "vitesse-light",
				dark: "vitesse-dark",
			},
			transformers: [codeMetaTransformer],
		},
	},

	integrations: [mdx(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
});
