# abhi.computer

## Developing embedded applications

The iframe and its parent need the bridge code from both repositories. Development
embeds `http://localhost:4322` by default, so run both sites locally.

Run `npm run dev -- --port 4322` in `../abhi.now`, then run this in this repository:

```sh
npm run dev -- --port 4321
```

Open `http://localhost:4321/blog`. The iframe loads `/blog/embed` on local `abhi.now`, so cursor
styles and application navigation can be tested together. Blog, Weeknotes,
Snippets and Whoami use embed routes, including Whoami facets inside its iframe;
Projects remains on its normal page because it has no embed variant. To use another origin,
set `PUBLIC_ABHI_NOW_ORIGIN` when starting this site. Deep links, query parameters
and fragments are preserved; canonical and “Open” links still point to the public
site.

Production defaults to `https://abhi.now`. Deploy the changes in both repositories
for the bridge to work publicly. Local build tests do not verify deployed versions.

The control panel's Analytics toggle updates `annu.disabled` and immediately
notifies the embedded application. Cross-tab changes also propagate. Code that
changes the preference in this tab should use `setAnalyticsDisabled()` from
`src/scripts/preferences.ts`; raw localStorage writes do not emit same-tab events.
Setting `localStorage.setItem("annu.disabled", "true")` and reloading also opts out.
The child keeps the parent preference in memory and respects its own independent
opt-out; it does not write parent preferences into its persistent storage. Embedded
analytics waits for the trusted parent's version-1 configuration. A later opt-out
reloads the child if analytics has already started, since Annu has no teardown API.
Parent theme changes also propagate to the open iframe without reloading it.

## Astro starter reference

```sh
pnpm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
