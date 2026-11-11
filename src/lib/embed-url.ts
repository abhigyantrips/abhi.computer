/** Keep canonical links public while allowing the iframe to use a local abhi.now. */
export function getEmbedUrl(canonicalUrl: string, embeddedOrigin?: string): string {
	const url = new URL(canonicalUrl);
	if (!embeddedOrigin) return url.href;
	const origin = new URL(embeddedOrigin);
	if (!["http:", "https:"].includes(origin.protocol)) {
		throw new Error("PUBLIC_ABHI_NOW_ORIGIN must be an HTTP(S) origin");
	}
	return new URL(url.pathname + url.search + url.hash, origin.origin).href;
}
