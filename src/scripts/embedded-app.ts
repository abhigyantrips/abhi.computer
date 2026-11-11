import { getPublicFrameUrl } from "../lib/embed-url";
import cursorStyles from "../styles/cursors.css?raw";
import { analyticsDisabled, preferencesChangedEvent } from "./preferences";

/** Called once per desktop page; the frame can reload independently of the shell. */
export function connectEmbeddedApp(frame: HTMLIFrameElement, signal: AbortSignal) {
	const scope = frame.dataset.embedScope ?? "";
	if (!scope || signal.aborted) return;
	const url = new URL(frame.src);
	const displayedUrl = frame.parentElement?.querySelector<HTMLElement>("[data-frame-url]");
	const openLink = frame.parentElement?.querySelector<HTMLAnchorElement>("[data-frame-open]");
	const publicOrigin = openLink ? new URL(openLink.href).origin : null;
	function updateLocation(href: unknown) {
		if (!displayedUrl || !openLink || !publicOrigin) return;
		const publicUrl = getPublicFrameUrl(href, url.origin, publicOrigin, scope);
		if (!publicUrl) return;
		displayedUrl.textContent = publicUrl;
		openLink.href = publicUrl;
	}
	updateLocation(url.href);
	const cursors = cursorStyles
		.replace(
			/url\("(\/[^\"]+)"\)/g,
			(_, path: string) => `url("${new URL(path, location.origin).href}")`
		)
		.replace(/cursor: ([^;]+);/g, "cursor: $1 !important;");
	function configure() {
		frame.contentWindow?.postMessage(
			{
				type: "abhi.computer:configure",
				version: 1,
				scope,
				cursors,
				theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
				annuDisabled: analyticsDisabled(),
			},
			url.origin
		);
	}
	frame.dataset.embedState = "connecting";
	window.addEventListener(
		"message",
		(event) => {
			if (event.source !== frame.contentWindow || event.origin !== url.origin) return;
			if (event.data?.version !== 1) return;
			if (event.data?.type === "abhi.now:ready") configure();
			if (event.data?.type === "abhi.now:configured") frame.dataset.embedState = "configured";
			if (event.data?.type === "abhi.now:location") {
				updateLocation(event.data.href);
			}
		},
		{ signal }
	);
	frame.addEventListener(
		"load",
		() => {
			frame.dataset.embedState = "connecting";
			configure();
		},
		{ signal }
	);
	const themeObserver = new MutationObserver(configure);
	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});
	signal.addEventListener("abort", () => themeObserver.disconnect(), { once: true });
	window.addEventListener(preferencesChangedEvent, configure, { signal });
	window.addEventListener("pageshow", configure, { signal });
	window.addEventListener(
		"storage",
		(event) => {
			if (event.key === "annu.disabled" || event.key === null) configure();
		},
		{ signal }
	);
	configure();
}
