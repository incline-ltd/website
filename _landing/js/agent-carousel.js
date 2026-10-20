// Agent workflow carousel (ai-automation). Four workflow slides with
// prev/next arrows and a counter, mirroring the tradign.com trust carousel:
// auto-advances gently while on screen; the first manual interaction hands
// control to the reader for good.
(function () {
  "use strict";

  var root = document.querySelector("[data-acar]");
  if (!root) return;

  var slides = [].slice.call(root.querySelectorAll(".acar__slide"));
  var counter = root.querySelector("[data-acar-cur]");
  var prevBtn = root.querySelector("[data-acar-prev]");
  var nextBtn = root.querySelector("[data-acar-next]");

  var index = 0;
  var autoRotate = !(
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  var visible = false;
  var timer = null;

  function show(next, fromLeft) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("acar__slide--left", fromLeft);
      slide.classList.toggle("acar__slide--active", i === index);
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    counter.textContent =
      index + 1 < 10 ? "0" + (index + 1) : String(index + 1);
  }

  function syncAuto() {
    if (visible && autoRotate && !timer) {
      // Re-check the flag inside the callback: a tick already queued when the
      // reader takes over must not advance the slide under them.
      timer = setInterval(function () {
        if (autoRotate) show(index + 1, false);
      }, 6500);
    } else if ((!visible || !autoRotate) && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  prevBtn.addEventListener("click", function () {
    autoRotate = false;
    syncAuto();
    show(index - 1, true);
  });
  nextBtn.addEventListener("click", function () {
    autoRotate = false;
    syncAuto();
    show(index + 1, false);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        visible = entries[0].isIntersecting;
        syncAuto();
      },
      { threshold: 0.35 },
    ).observe(root);
  } else {
    visible = true;
    syncAuto();
  }
})();
