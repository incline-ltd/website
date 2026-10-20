# Incline website architecture

A plain HTML, CSS, and JavaScript example of the [Incline website](https://inclineltd.com/). It shows how shared navigation, design tokens, route pages, and interactive product previews work without a framework, bundler, or package install.

This is a sanitized architecture example. The contact form is a local demo that sends and stores nothing. Production deployment files, form services, credentials, and private repository history are excluded. Updates are reviewed separately, so this repository is not an automatic mirror of the live site.

## Run locally

From the repository root, run

```sh
python3 -m http.server 8103 --bind 127.0.0.1
```

Open [the local demo](http://127.0.0.1:8103/). Use sample text in the [contact form demo](http://127.0.0.1:8103/contact/).

There is no build step. Node.js 22 or newer is only needed for the checks.

## Explore the code

| Path | Purpose |
| --- | --- |
| `index.html` and route folders | Page content, metadata, and shared shell mounts |
| `_landing/styles/tokens.css` | Shared colors, typography, spacing, and theme values |
| `_landing/styles/` | Base styles, reusable components, and page sections |
| `_landing/js/site.js` | Shared navigation, footer, theme, and reveal behavior |
| `_landing/js/product-previews/` | Static product preview content |
| `_landing/js/product-switcher.js` | Product tabs inside shared device frames |
| `_landing/js/route-preview.js` | Preview mounts on individual route pages |
| `_landing/js/contact-form.js` | Local form validation and demo feedback |
| `scripts/` | Static validation and favicon generation |

Read [ARCHITECTURE.md](ARCHITECTURE.md) for the page and script flow.

## Check changes

```sh
node scripts/validate-static.mjs
node --test
git diff --check
```

Also check the changed pages in a browser at desktop and phone widths. Try keyboard navigation and both device themes. The repository has no automatic GitHub Pages deployment.

## Reuse

The source code is available under the [MIT license](LICENSE). Incline, Velator, Tradign, and Pridie names, logos, brand assets, and marketing copy are reserved under [BRANDING.md](BRANDING.md). Replace those elements before publishing a derivative site.

See [CONTRIBUTING.md](CONTRIBUTING.md) for changes and [SECURITY.md](SECURITY.md) for private security reports.
