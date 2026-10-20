// Shared static shell, navigation, theme, and reveal behavior.
(function () {
  "use strict";

  var DARK_QUERY = "(prefers-color-scheme: dark)";

  var navItems = [
    { label: "About us", href: "about/index.html" },
    {
      label: "Solutions",
      items: [
        ["AI Trading", "Velator-style trading systems", "trading-automation/index.html"],
        ["AI Agents", "Practical agents & workflows", "ai-automation/index.html"],
        ["Telegram AI", "Accept User automation", "telegram-automation/index.html"],
        ["AI Apps", "Sites, dashboards & bots", "apps-and-bots/index.html"],
      ],
    },
    {
      label: "Resources",
      items: [
        ["Open Source", "Public repos & coding practice", "open-source/index.html"],
        ["Founder on GitHub", "github.com/ashishkaloge", "https://github.com/ashishkaloge"],
      ],
    },
    { label: "Contact us", href: "contact/index.html" },
  ];

  // Links are prefix-relative (computed from this script's own src) so every
  // page works served over HTTP and opened directly via file://.
  function scriptPrefix() {
    var script =
      document.currentScript || document.querySelector('script[src*="site.js"]');
    var src = script ? script.getAttribute("src") || "" : "";

    src = src.split("#")[0].split("?")[0];
    return src.replace(/_landing\/js\/site\.js$/, "");
  }

  var prefix = scriptPrefix();

  function pagePath() {
    return decodeURIComponent(
      window.location.pathname.replace(/\/$/, "/index.html"),
    );
  }

  function isCurrent(path) {
    if (/^(?:https?:)/.test(path)) return false;
    return pagePath().endsWith("/" + path);
  }

  function linkHref(path) {
    return /^(?:https?:)/.test(path) ? path : prefix + path;
  }

  function externalAttrs(href) {
    return /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener"' : "";
  }

  function caretSvg() {
    return (
      '<svg class="site-header__caret" viewBox="0 0 24 24" aria-hidden="true" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
    );
  }

  function renderNavItem(item) {
    if (item.href) {
      var active = isCurrent(item.href);
      return (
        '<a class="site-header__link' +
        (active ? " is-active" : "") +
        '" href="' +
        linkHref(item.href) +
        '"' +
        (active ? ' aria-current="page"' : "") +
        ">" +
        item.label +
        "</a>"
      );
    }

    var current = item.items.some(function (link) {
      return isCurrent(link[2]);
    });
    var links = item.items
      .map(function (link) {
        var active = isCurrent(link[2]);
        return (
          '<a class="site-header__panel-link' +
          (active ? " is-active" : "") +
          '" href="' +
          linkHref(link[2]) +
          '"' +
          externalAttrs(link[2]) +
          ' role="menuitem">' +
          '<span class="site-header__panel-label">' +
          link[0] +
          "</span>" +
          '<span class="site-header__panel-desc">' +
          link[1] +
          "</span></a>"
        );
      })
      .join("");

    return (
      '<div class="site-header__group' +
      (current ? " is-current" : "") +
      '" data-nav-group>' +
      '<button class="site-header__link site-header__trigger" type="button" ' +
      'aria-expanded="false" aria-haspopup="menu" data-nav-trigger>' +
      item.label +
      caretSvg() +
      "</button>" +
      '<div class="site-header__panel" role="menu" aria-label="' +
      item.label +
      '">' +
      links +
      "</div></div>"
    );
  }

  function renderHeader(root) {
    root.className = "site-header";
    root.innerHTML =
      '<a class="site-header__brand" href="' +
      linkHref("index.html") +
      '">inclineltd.com</a>' +
      '<nav class="site-header__nav" aria-label="Primary navigation">' +
      navItems.map(renderNavItem).join("") +
      "</nav>";
  }

  function initHeader(root) {
    var groups = [].slice.call(root.querySelectorAll("[data-nav-group]"));
    var hoverCapable =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function closeAll(except) {
      groups.forEach(function (group) {
        if (group === except) return;
        group.classList.remove("is-open");
        group
          .querySelector("[data-nav-trigger]")
          .setAttribute("aria-expanded", "false");
      });
    }

    groups.forEach(function (group) {
      var trigger = group.querySelector("[data-nav-trigger]");

      trigger.addEventListener("click", function (event) {
        if (hoverCapable) return;
        event.stopPropagation();
        var open = group.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        closeAll(group);
      });
    });

    document.addEventListener("click", function (event) {
      if (!root.contains(event.target)) closeAll(null);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAll(null);
    });
  }

  var footerCols = [
    [
      "Products",
      [
        ["velator.ai", "https://velator.ai/"],
        ["tradign.com", "https://tradign.com/"],
        // pridie.ai is not live yet; route to the page that previews it.
        ["Pridie (in development)", "apps-and-bots/index.html"],
        ["Accept User bot", "telegram-automation/index.html"],
      ],
    ],
    [
      "Capabilities",
      [
        ["AI Trading", "trading-automation/index.html"],
        ["AI Agents", "ai-automation/index.html"],
        ["AI Apps", "apps-and-bots/index.html"],
      ],
    ],
    [
      "Company",
      [
        ["About us", "about/index.html"],
        ["Open Source", "open-source/index.html"],
        ["Contact", "contact/index.html"],
        ["Start a project", "https://inclineltd.com/contact/"],
      ],
    ],
  ];

  function renderFooter(root) {
    var cols = footerCols
      .map(function (col) {
        var links = col[1]
          .map(function (link) {
            return (
              '<a href="' +
              linkHref(link[1]) +
              '"' +
              externalAttrs(link[1]) +
              ">" +
              link[0] +
              "</a>"
            );
          })
          .join("");
        return (
          '<div class="site-footer__col"><span class="site-footer__col-title">' +
          col[0] +
          "</span>" +
          links +
          "</div>"
        );
      })
      .join("");

    root.innerHTML =
      '<div class="site-footer__inner">' +
      '<div class="site-footer__top">' +
      '<div class="site-footer__brand">' +
      '<a class="site-footer__name" href="' +
      linkHref("index.html") +
      '">inclineltd.com</a>' +
      '<p class="site-footer__tag">AI automation built for production — trading platforms, Telegram automation, and practical AI workflows.</p>' +
      "</div>" +
      '<nav class="site-footer__cols" aria-label="Footer">' +
      cols +
      "</nav>" +
      "</div>" +
      '<div class="site-footer__word" aria-hidden="true">inclineltd</div>' +
      '<div class="site-footer__base">' +
      "<span>&copy; 2026 Incline Ltd. All rights reserved.</span>" +
      '<span class="site-footer__note">Production-minded, proof-led builds.</span>' +
      "</div>" +
      "</div>";
    root.removeAttribute("hidden");
  }

  // Elements tagged data-reveal fade up when they first enter view; the
  // attribute value is the per-element stagger delay in ms. The document is
  // the scroller, so reveals run straight off window scroll.
  function initReveals() {
    var nodes = [].slice.call(document.querySelectorAll("[data-reveal]"));
    var reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!nodes.length) return;

    if (reduceMotion) {
      nodes.forEach(function (node) {
        node.classList.add("is-in");
      });
      return;
    }

    var pending = nodes.slice();

    nodes.forEach(function (node) {
      node.style.transitionDelay =
        (parseInt(node.dataset.reveal, 10) || 0) + "ms";
    });

    function check() {
      var bottom = window.innerHeight;
      pending = pending.filter(function (node) {
        var r = node.getBoundingClientRect();
        // In view (with a small lead-in) → reveal and drop from the queue.
        if (r.top < bottom - 40 && r.bottom > 0) {
          node.classList.add("is-in");
          return false;
        }
        return true;
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        check();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
  }

  // The site follows the device theme; the data-theme attribute stays because
  // preview surfaces key their palettes off it.
  function initTheme() {
    var mediaQuery =
      typeof window.matchMedia === "function" ? window.matchMedia(DARK_QUERY) : null;

    function applyTheme() {
      var theme = mediaQuery && mediaQuery.matches ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
    }

    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", applyTheme);
    }

    applyTheme();
  }

  var header = document.querySelector("[data-site-header]");
  if (header) {
    renderHeader(header);
    initHeader(header);
  }
  var footer = document.querySelector("[data-site-footer]");
  if (footer) renderFooter(footer);
  initReveals();
  initTheme();
})();
