// Live case previews: hovering or focusing a capability item swaps the device
// panel beside it. Markup contract, inside a [data-case-sync] root:
//   items:  [data-screen="key"]        (list rows; first one starts active)
//   panels: [data-screen-panel="key"]  (device figures; all but one hidden)
// Falls back gracefully: without JS every panel keeps its initial hidden
// state, so the first device still shows.
(() => {
  'use strict';

  document.querySelectorAll('[data-case-sync]').forEach((root) => {
    const items = [...root.querySelectorAll('[data-screen]')];
    const panels = [...root.querySelectorAll('[data-screen-panel]')];

    if (!items.length || !panels.length) return;

    const activate = (key) => {
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.screenPanel !== key;
      });
      items.forEach((item) => {
        item.classList.toggle('is-active', item.dataset.screen === key);
      });
    };

    items.forEach((item) => {
      const show = () => activate(item.dataset.screen);

      item.addEventListener('mouseenter', show);
      item.addEventListener('focusin', show);
      item.addEventListener('click', show);
    });

    activate(items[0].dataset.screen);
  });
})();
