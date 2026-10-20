// Shared, file-safe product preview tabs. Runs after each product definition.
(() => {
  'use strict';

  const registry = window.InclineProductPreviews;
  const roots = document.querySelectorAll('.tp');

  if (!registry || !roots.length) return;

  const devices = [
    { key: 'desktop', screen: '.tp__screen--desktop', figure: '.tp__imac', name: 'Desktop' },
    { key: 'laptop', screen: '.tp__screen--laptop', figure: '.tp__macbook', name: 'Laptop' },
    { key: 'tablet', screen: '.tp__screen--tablet', figure: '.tp__ipad', name: 'Tablet' },
    { key: 'phone', screen: '.tp__screen--phone', figure: '.tp__iphone', name: 'Mobile' },
  ];

  const productSlots = [
    { registryKey: 'tradign', tabLabel: 'velator.ai' },
    { registryKey: 'pridie', tabLabel: 'pridie.ai' },
    { registryKey: 'acceptUser', tabLabel: 'accept user bot' },
  ];

  const safeId = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product';

  const appendScreenContent = (panel, source) => {
    if (typeof source === 'string') {
      panel.innerHTML = source;
      return;
    }

    if (source instanceof HTMLTemplateElement) {
      panel.append(source.content.cloneNode(true));
      return;
    }

    if (source instanceof Node) {
      panel.append(source.cloneNode(true));
    }
  };

  roots.forEach((root, rootIndex) => {
    const inner = root.querySelector('.tp__inner');
    const showcase = root.querySelector('.tp__showcase');
    const head = root.querySelector('.tp__head');
    const eyebrow =
      root.querySelector('.tp__eyebrow-text') ||
      root.querySelector('.tp__eyebrow') ||
      root.querySelector('.tp__heading p');
    const title = root.querySelector('.tp__title') || root.querySelector('.tp__heading h2');

    if (!inner || !showcase || !eyebrow) return;

    const instanceId = `product-preview-${rootIndex + 1}`;
    const tradign = {
      key: 'tradign',
      label: 'velator.ai',
      eyebrow: eyebrow.textContent.trim(),
      title: title ? title.textContent.trim() : '',
      screens: {},
    };
    const products = productSlots.map((slot) => ({
      ...slot,
      definition: slot.registryKey === 'tradign' ? tradign : registry[slot.registryKey],
    }));

    if (products.some((product) => !product.definition?.screens)) return;

    const switcher = document.createElement('div');
    const tablist = document.createElement('div');
    const status = document.createElement('span');

    switcher.className = 'product-switcher';
    tablist.className = 'product-switcher__tabs';
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Product previews');

    status.className = 'product-switcher__status visually-hidden';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');

    showcase.id ||= `${instanceId}-stage`;
    showcase.setAttribute('role', 'tabpanel');

    const panelsByProduct = new Map();

    devices.forEach((device) => {
      const screen = root.querySelector(device.screen);
      if (!screen) return;

      const existingPanel = document.createElement('div');
      existingPanel.className = 'product-preview-panel product-preview-panel--tradign';
      existingPanel.dataset.productPanel = tradign.key;

      while (screen.firstChild) existingPanel.append(screen.firstChild);
      screen.append(existingPanel);

      panelsByProduct.set(
        tradign.key,
        [...(panelsByProduct.get(tradign.key) || []), existingPanel],
      );

      products.slice(1).forEach((product) => {
        const definition = product.definition;
        const panel = document.createElement('div');
        const productKey = definition.key || product.registryKey;

        panel.className = `product-preview-panel product-preview-panel--${safeId(productKey)}`;
        panel.dataset.productPanel = productKey;
        panel.hidden = true;
        appendScreenContent(panel, definition.screens[device.key]);
        screen.append(panel);

        panelsByProduct.set(
          productKey,
          [...(panelsByProduct.get(productKey) || []), panel],
        );
      });
    });

    const tabs = products.map((product, index) => {
      const button = document.createElement('button');
      const productKey = product.definition.key || product.registryKey;

      button.className = 'product-switcher__tab button-ghost';
      button.type = 'button';
      button.id = `${instanceId}-tab-${safeId(productKey)}`;
      button.dataset.product = productKey;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', showcase.id);
      button.setAttribute('aria-selected', String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      button.textContent = product.tabLabel;
      tablist.append(button);
      return button;
    });

    switcher.append(tablist, status);
    if (head) head.append(switcher);
    else inner.insertBefore(switcher, showcase);

    const activate = (nextIndex, options = {}) => {
      const product = products[nextIndex];
      if (!product) return;

      const productKey = product.definition.key || product.registryKey;
      const productName = String(product.definition.label || product.tabLabel);

      products.forEach((candidate, index) => {
        const candidateKey = candidate.definition.key || candidate.registryKey;
        const active = index === nextIndex;

        tabs[index].setAttribute('aria-selected', String(active));
        tabs[index].tabIndex = active ? 0 : -1;
        panelsByProduct.get(candidateKey)?.forEach((panel) => {
          panel.hidden = !active;
        });
      });

      root.dataset.product = productKey;
      showcase.setAttribute('aria-labelledby', tabs[nextIndex].id);
      eyebrow.textContent = product.definition.eyebrow;
      if (title) title.textContent = product.definition.title;

      devices.forEach((device) => {
        const screen = root.querySelector(device.screen);
        const figure = root.querySelector(device.figure);
        if (screen) screen.dataset.product = productKey;
        if (figure) figure.setAttribute('aria-label', `${device.name} preview of ${productName}`);
      });

      if (options.focus) tabs[nextIndex].focus();
      if (options.announce) status.textContent = `${product.tabLabel} preview selected.`;

      root.dispatchEvent(
        new CustomEvent('incline:product-change', {
          bubbles: true,
          detail: { key: productKey },
        }),
      );
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index, { announce: true }));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = index;

        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        activate(nextIndex, { focus: true, announce: true });
      });
    });

    activate(0);
  });
})();
