// Mounts a product preview screen from the shared registry into a standalone
// device frame on a route page. Markup contract:
//   <div class="product-preview-panel product-preview-panel--<key>"
//        data-product-preview="<registryKey>" data-device="phone"></div>
// The registry definitions live in _landing/js/product-previews/*.js and store
// each screen as an HTML string, template, or node — same shapes the home
// switcher consumes.
(() => {
  'use strict';

  const mounts = document.querySelectorAll('[data-product-preview]');

  if (!mounts.length) return;

  const registry = window.InclineProductPreviews || {};

  const append = (mount, source) => {
    if (typeof source === 'string') {
      mount.innerHTML = source;
      return;
    }

    if (source instanceof HTMLTemplateElement) {
      mount.append(source.content.cloneNode(true));
      return;
    }

    if (source instanceof Node) {
      mount.append(source.cloneNode(true));
    }
  };

  mounts.forEach((mount) => {
    const definition = registry[mount.dataset.productPreview];
    const screen = definition?.screens?.[mount.dataset.device || 'phone'];

    if (screen) append(mount, screen);
  });
})();
