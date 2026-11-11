const embedScopes = ["/blog", "/weeknotes", "/snippets", "/whoami"] as const;

export function getEmbedScope(pathname: string) {
	return embedScopes.find((scope) => pathname === scope || pathname.startsWith(`${scope}/`));
}

/** Embed only supported applications; keep canonical links on the public site. */
export function getEmbedUrl(canonicalUrl: string, embeddedOrigin?: string): string {
	const url = new URL(canonicalUrl);
	if (getEmbedScope(url.pathname)) {
		url.pathname = `${url.pathname.replace(/\/+$/, "").replace(/\/embed$/, "")}/embed`;
	}
	if (embeddedOrigin) {
		const origin = new URL(embeddedOrigin);
		if (!["http:", "https:"].includes(origin.protocol)) {
			throw new Error("PUBLIC_ABHI_NOW_ORIGIN must be an HTTP(S) origin");
		}
		return new URL(url.pathname + url.search + url.hash, origin.origin).href;
	}
	return url.href;
}

/** Validate an iframe location and turn its embed URL into a public page URL. */
export function getPublicFrameUrl(
	href: unknown,
	frameOrigin: string,
	publicOrigin: string,
	scope: string
): string | null {
	if (typeof href !== "string") return null;
	try {
		const url = new URL(href);
		if (
			!["http:", "https:"].includes(url.protocol) ||
			url.origin !== frameOrigin ||
			url.username ||
			url.password
		)
			return null;
		const pathname = url.pathname.replace(/\/embed\/?$/, "");
		if (pathname !== scope && !pathname.startsWith(`${scope}/`)) return null;
		return new URL(pathname + url.search + url.hash, publicOrigin).href;
	} catch {
		return null;
	}
}
