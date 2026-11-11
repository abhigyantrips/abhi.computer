export function initializeControlPanel(signal: AbortSignal) {
	const panel = document.querySelector<HTMLElement>("#control-panel")!;
	const trigger = document.querySelector<HTMLButtonElement>("#control-panel-toggle")!;
	const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle")!;
	const fullscreenToggle = document.querySelector<HTMLButtonElement>("#fullscreen-toggle")!;
	const status = panel.querySelector<HTMLElement>("[data-control-status]")!;

	panel.addEventListener(
		"toggle",
		() => {
			const open = panel.matches(":popover-open");
			trigger.setAttribute("aria-expanded", String(open));
			if (open) themeToggle.focus({ preventScroll: true });
		},
		{ signal }
	);

	function syncTheme() {
		const dark = document.documentElement.dataset.theme === "dark";
		themeToggle.setAttribute("aria-pressed", String(dark));
		themeToggle.querySelector("[data-control-state]")!.textContent = dark ? "On" : "Off";
	}
	themeToggle.addEventListener(
		"click",
		() => {
			const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
			document.documentElement.dataset.theme = theme;
			try {
				localStorage.setItem("abhi-computer-theme", theme);
			} catch {
				/* Storage is optional. */
			}
			syncTheme();
		},
		{ signal }
	);
	syncTheme();

	function syncFullscreen() {
		const fullscreen = Boolean(document.fullscreenElement);
		fullscreenToggle.disabled = !document.fullscreenEnabled;
		fullscreenToggle.setAttribute("aria-pressed", String(fullscreen));
		fullscreenToggle.querySelector("[data-control-state]")!.textContent =
			!document.fullscreenEnabled ? "Unavailable" : fullscreen ? "On" : "Off";
	}
	fullscreenToggle.addEventListener(
		"click",
		async () => {
			status.textContent = "";
			fullscreenToggle.disabled = true;
			fullscreenToggle.setAttribute("aria-busy", "true");
			try {
				if (document.fullscreenElement) await document.exitFullscreen();
				else await document.documentElement.requestFullscreen();
			} catch {
				status.textContent = "Couldn’t change fullscreen. Try again.";
			} finally {
				fullscreenToggle.removeAttribute("aria-busy");
				syncFullscreen();
			}
		},
		{ signal }
	);
	document.addEventListener("fullscreenchange", syncFullscreen, { signal });
	syncFullscreen();
}
