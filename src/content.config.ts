import { glob } from "astro/loaders";

import { z } from "astro/zod";

import { globWithParser } from "@/lib/parsers";
import { defineCollection, reference } from "astro:content";

const things = defineCollection({
	loader: glob({
		base: "./content/things",
		pattern: "**/*.mdx",
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		published: z.boolean().default(true),
		tags: z.array(reference("tags")).optional(),
	}),
});

const links = defineCollection({
	loader: globWithParser({
		base: "./content/links",
		pattern: "**/*.md",
		parser: async (entry) => {
			const { id, data }: { id: string; data: { title?: string; date?: string } } = entry;

			// Use the filename (id) as the epoch timestamp
			data.title = id;
			// If the id is an epoch timestamp, convert it to a Date
			const epochMatch = id.match(/^(\d{10})$/);
			if (epochMatch) {
				const epoch = parseInt(epochMatch[1], 10);
				// Convert to local timezone string
				data.date = new Date(epoch * 1000).toLocaleString();
			} else {
				// fallback: try ISO date or default
				data.date = id.match(/(\d{4}-\d{2}-\d{2})/)?.[0] ?? new Date().toString();
			}

			return entry;
		},
	}),
	schema: z.object({
		link: z.object({
			url: z.url(),
			title: z.string(),
		}),
		date: z.coerce.date(),
		tags: z.array(reference("tags")).optional(),
	}),
});

const tags = defineCollection({
	loader: glob({
		base: "./content/tags",
		pattern: "**/[^_]*.json",
	}),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		link: z.url().optional(),
		color: z.string().optional(),
	}),
});

export const collections = { things, links, tags };
