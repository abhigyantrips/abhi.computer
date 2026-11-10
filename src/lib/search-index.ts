import { getCollection } from "astro:content";
import { parseFeed } from "./rss-search";
import type { SearchEntry } from "./search";

async function feedEntries(app: "blog" | "weeknotes" | "snippets") {
	const response = await fetch(`https://abhi.now/${app}/feed.xml`, {
		signal: AbortSignal.timeout(20_000),
	});
	if (!response.ok) throw new Error(`Could not index ${app} feed: HTTP ${response.status}`);
	return parseFeed(await response.text(), app);
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
	const [things, links, blog, weeknotes, snippets] = await Promise.all([
		getCollection("things", ({ data }) => data.published),
		getCollection("links"),
		feedEntries("blog"),
		feedEntries("weeknotes"),
		feedEntries("snippets"),
	]);
	return [
		...things.map(
			({ id, data }): SearchEntry => ({
				app: "journal",
				title: data.title,
				url: `/things/${id}`,
				date: data.date.toISOString(),
				text: "",
			})
		),
		...links.map(
			({ id, data }): SearchEntry => ({
				app: "journal",
				title: data.link.title,
				url: `/links/${id}`,
				date: data.date.toISOString(),
				text: "",
			})
		),
		...blog,
		...weeknotes,
		...snippets,
	];
}
