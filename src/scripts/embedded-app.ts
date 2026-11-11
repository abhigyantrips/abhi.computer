import cursorStyles from "../styles/cursors.css?raw";

/** Called once per desktop page; the frame can reload independently of the shell. */
export function connectEmbeddedApp(frame: HTMLIFrameElement, signal: AbortSignal) {
	const url = new URL(frame.src);
	const scope = `/${frame.title}`;
	const cursors = cursorStyles
		.replace(
			/url\("(\/[^\"]+)"\)/g,
			(_, path: string) => `url("${new URL(path, location.origin).href}")`
		)
		.replace(/cursor: ([^;]+);/g, "cursor: $1 !important;");
	function configure() {
		let annuDisabled = false;
		try {
			annuDisabled = localStorage.getItem("annu.disabled") === "true";
		} catch {}
		frame.contentWindow?.postMessage(
			{ type: "abhi.computer:configure", scope, cursors, annuDisabled },
			url.origin
		);
	}
	window.addEventListener(
		"message",
		(event) => {
			if (
				event.source === frame.contentWindow &&
				event.origin === url.origin &&
				event.data?.type === "abhi.now:ready"
			)
				configure();
		},
		{ signal }
	);
	frame.addEventListener("load", configure, { signal });
	window.addEventListener(
		"storage",
		(event) => {
			if (event.key === "annu.disabled" || event.key === null) configure();
		},
		{ signal }
	);
	configure();
}
