# Architecture

Each route is an HTML document with its own content and metadata. Shared CSS and classic JavaScript files provide the shell and interactions. A static server can serve the files directly.

## Page flow

1. The browser loads the page and local stylesheets. A small inline script applies the device theme before the page paints.
2. Deferred scripts run in document order. `site.js` fills the header and footer mounts, sets the current navigation item, and attaches theme and reveal behavior.
3. Scripts look for their own `data-*` mounts and return when a page does not contain them. Each page loads the interactions it uses.
4. Product definitions register their preview content before the switcher or route preview script mounts it.

The document scrolls beneath a sticky header. Relative asset links and navigation paths allow the same folder structure to work on a local server. `site.js` derives the navigation prefix from its own script path.

## Styles

`tokens.css` owns the shared design values. `reset.css` sets browser defaults, `primitives.css` provides small reusable rules, and `components.css` styles shared components. `sections.css` covers page sections. Product previews have separate stylesheets for their device frames and screen content.

The font stacks use fonts available on the device. No remote font download is required. Theme changes follow the device preference.

## Preview content

The product wall starts with static markup. `product-proof.js` adds local interactions, while `product-switcher.js` switches the content inside the same device frames.

The Pridie and Accept User definitions live in `product-previews/` and register on `window.InclineProductPreviews`. `route-preview.js` uses that registry to mount a chosen product and device on a route page. `case-sync.js` connects capability rows to the adjacent preview panels.

These definitions contain trusted repository content. Their HTML insertion helpers are not a general sanitizer for user input.

Chat and terminal animations are scripted demonstrations. Product values are illustrative. These previews do not connect to product accounts, trading services, or an AI provider.

## Contact form

The contact page demonstrates browser validation and status feedback. Its fieldset starts disabled. `contact-form.js` attaches the local handlers before enabling the fields, so a missing script leaves the form inactive.

Submitting valid sample input only changes the local demo status. There is no endpoint, request, browser storage, or delivery claim. The contact page links to the live website for actual enquiries.

## Repository boundary

This repository contains a reviewed public example with fresh history. The live website has a separate release process. Production form services, deployment configuration, hosting details, and credentials do not belong here.

The validation workflow checks the example. It does not deploy the company website or enable GitHub Pages. Public updates are selected and reviewed; there is no automatic synchronization with production.
