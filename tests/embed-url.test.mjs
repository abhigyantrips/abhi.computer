import assert from "node:assert/strict";
import { test } from "node:test";
import { getEmbedUrl, getPublicFrameUrl } from "../src/lib/embed-url.ts";

test("production loads the supported application embed routes", () => {
	for (const path of [
		"/blog",
		"/weeknotes",
		"/snippets",
		"/whoami",
		"/whoami/a-software-developer",
	]) {
		assert.equal(getEmbedUrl(`https://abhi.now${path}`), `https://abhi.now${path}/embed`);
	}
});

test("Projects and paths outside supported application scopes are not rewritten", () => {
	for (const path of ["/projects", "/blogroll", "/", "/whoamigo"]) {
		assert.equal(getEmbedUrl(`https://abhi.now${path}`), `https://abhi.now${path}`);
	}
});

test("embed suffixes are added only once, including with trailing slashes", () => {
	for (const path of ["/blog/", "/blog/embed", "/blog/embed/"]) {
		assert.equal(getEmbedUrl(`https://abhi.now${path}`), "https://abhi.now/blog/embed");
	}
});

test("local embeds preserve application paths, queries and fragments", () => {
	assert.equal(
		getEmbedUrl("https://abhi.now/blog/why-i-write?test=1#paragraph", "http://localhost:4322"),
		"http://localhost:4322/blog/why-i-write/embed?test=1#paragraph"
	);
});

test("an override cannot replace the application path or use a non-HTTP protocol", () => {
	assert.equal(
		getEmbedUrl("https://abhi.now/blog", "http://localhost:4322/other"),
		"http://localhost:4322/blog/embed"
	);
	assert.throws(() => getEmbedUrl("https://abhi.now/blog", "file:///tmp/test"));
});

test("window URLs omit the terminal embed suffix and retain query and fragment", () => {
	for (const suffix of ["/embed", "/embed/"]) {
		assert.equal(
			getPublicFrameUrl(
				`https://abhi.now/blog/post${suffix}?sort=new#paragraph`,
				"https://abhi.now",
				"https://abhi.now",
				"/blog"
			),
			"https://abhi.now/blog/post?sort=new#paragraph"
		);
	}
	assert.equal(
		getPublicFrameUrl(
			"https://abhi.now/blog/embed",
			"https://abhi.now",
			"https://abhi.now",
			"/blog"
		),
		"https://abhi.now/blog"
	);
});

test("local iframe navigation displays public URLs and preserves embed elsewhere in the path", () => {
	assert.equal(
		getPublicFrameUrl(
			"http://localhost:4322/blog/embed-examples/embed#intro",
			"http://localhost:4322",
			"https://abhi.now",
			"/blog"
		),
		"https://abhi.now/blog/embed-examples#intro"
	);
});

test("window URLs reject malformed, foreign, credentialed and out-of-scope destinations", () => {
	for (const href of [
		null,
		{},
		"/blog/post/embed",
		"not a URL",
		"javascript:alert(1)",
		"https://example.com/blog/embed",
		"https://abhi.now.example.com/blog/embed",
		"https://user:pass@abhi.now/blog/embed",
		"https://abhi.now/weeknotes/embed",
		"https://abhi.now/blogroll/embed",
		"https://abhi.now/blog/../projects/embed",
		"https://abhi.now//example.com/blog/embed",
	]) {
		assert.equal(getPublicFrameUrl(href, "https://abhi.now", "https://abhi.now", "/blog"), null);
	}
});
