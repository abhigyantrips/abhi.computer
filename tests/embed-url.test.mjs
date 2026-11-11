import assert from "node:assert/strict";
import { test } from "node:test";
import { getEmbedUrl } from "../src/lib/embed-url.ts";

test("production embeds abhi.now by default", () => {
	assert.equal(getEmbedUrl("https://abhi.now/blog"), "https://abhi.now/blog");
});

test("local embeds preserve application paths, queries and fragments", () => {
	assert.equal(
		getEmbedUrl("https://abhi.now/blog/why-i-write?test=1#paragraph", "http://localhost:4322"),
		"http://localhost:4322/blog/why-i-write?test=1#paragraph"
	);
});

test("an override cannot replace the application path or use a non-HTTP protocol", () => {
	assert.equal(
		getEmbedUrl("https://abhi.now/blog", "http://localhost:4322/other"),
		"http://localhost:4322/blog"
	);
	assert.throws(() => getEmbedUrl("https://abhi.now/blog", "file:///tmp/test"));
});
