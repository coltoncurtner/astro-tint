/* ============================================================
   Astro Tint Solutions — interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      }
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Work gallery: category filter ---- */
  var workFilters = document.querySelectorAll(".work-filter");
  var workItems = Array.prototype.slice.call(document.querySelectorAll(".work-item"));
  var workEmpty = document.querySelector(".work-empty");
  if (workFilters.length && workItems.length) {
    var applyFilter = function (cat) {
      var shown = 0;
      workItems.forEach(function (item) {
        var match = cat === "all" || item.getAttribute("data-cat") === cat;
        item.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (workEmpty) workEmpty.hidden = shown > 0;
    };
    workFilters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        workFilters.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        applyFilter(btn.getAttribute("data-filter") || "all");
      });
    });
  }

  /* ---- Work gallery lightbox (photos, with prev/next) ---- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbBody = document.getElementById("lightboxBody");
    var lbTitle = document.getElementById("lightboxTitle");
    var lbTag = document.getElementById("lightboxTag");
    var lastFocused = null;
    var allCards = Array.prototype.slice.call(document.querySelectorAll(".work-card"));
    var galleryList = [];   // cards currently navigable (respects the active filter)
    var galleryIndex = 0;

    // Inject prev/next controls once.
    var panel = lightbox.querySelector(".lightbox-panel");
    var prevBtn = document.createElement("button");
    var nextBtn = document.createElement("button");
    prevBtn.type = nextBtn.type = "button";
    prevBtn.className = "lightbox-nav lightbox-prev";
    nextBtn.className = "lightbox-nav lightbox-next";
    prevBtn.setAttribute("aria-label", "Previous photo");
    nextBtn.setAttribute("aria-label", "Next photo");
    prevBtn.innerHTML = "‹";
    nextBtn.innerHTML = "›";
    if (panel) { panel.appendChild(prevBtn); panel.appendChild(nextBtn); }

    var renderCard = function (card) {
      var title = card.getAttribute("data-title") || "";
      var tag = card.getAttribute("data-tag") || "";
      var safeTitle = title.replace(/"/g, "&quot;");
      var url = card.getAttribute("data-url");
      var img = card.getAttribute("data-img");
      lbTitle.innerHTML = title;
      lbTag.innerHTML = tag;
      if (url) {
        lbBody.innerHTML = '<iframe class="lightbox-frame" src="' + url.replace(/"/g, "&quot;") +
          '" title="' + safeTitle + ' live preview" loading="lazy" referrerpolicy="no-referrer"></iframe>';
      } else if (img) {
        lbBody.innerHTML = '<img src="' + img + '" alt="' + safeTitle + '" />';
      } else {
        lbBody.innerHTML = '<div class="lightbox-ph"><strong>' + title + '</strong><span class="muted">Project photos coming soon</span></div>';
      }
    };

    var updateNav = function () {
      var many = galleryList.length > 1;
      prevBtn.hidden = nextBtn.hidden = !many;
    };

    var openLightbox = function (card) {
      lastFocused = card;
      // Navigate only within cards visible under the current filter.
      galleryList = allCards.filter(function (c) {
        var item = c.closest(".work-item");
        return !item || !item.classList.contains("is-hidden");
      });
      galleryIndex = galleryList.indexOf(card);
      if (galleryIndex < 0) { galleryList = [card]; galleryIndex = 0; }
      renderCard(card);
      updateNav();
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = lightbox.querySelector(".lightbox-close");
      if (closeBtn) closeBtn.focus();
    };

    var step = function (dir) {
      if (galleryList.length < 2) return;
      galleryIndex = (galleryIndex + dir + galleryList.length) % galleryList.length;
      renderCard(galleryList[galleryIndex]);
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      lbBody.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    allCards.forEach(function (card) {
      card.addEventListener("click", function () { openLightbox(card); });
    });
    prevBtn.addEventListener("click", function () { step(-1); });
    nextBtn.addEventListener("click", function () { step(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target.getAttribute("data-close") === "true") closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---- Sticky mobile CTA (show past hero, hide near booking/footer) ---- */
  var mcta = document.getElementById("mobileCta");
  if (mcta) {
    var heroSec = document.querySelector(".hero");
    var hideTargets = [document.getElementById("book"), document.querySelector(".site-footer")].filter(Boolean);
    var visibleState = new WeakMap();

    var refreshMcta = function () {
      var inHideZone = hideTargets.some(function (t) { return visibleState.get(t); });
      var pastHero = window.scrollY > (heroSec ? heroSec.offsetHeight * 0.6 : 400);
      mcta.classList.toggle("show", pastHero && !inHideZone);
    };

    if ("IntersectionObserver" in window && hideTargets.length) {
      var mctaIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visibleState.set(e.target, e.isIntersecting); });
        refreshMcta();
      }, { threshold: 0.02 });
      hideTargets.forEach(function (t) { mctaIo.observe(t); });
    }
    window.addEventListener("scroll", refreshMcta, { passive: true });
    refreshMcta();
  }

  /* ---- Tint-darkness simulator (VLT preview) ---- */
  var sim = document.getElementById("simulator");
  if (sim) {
    var simStage = sim.querySelector(".sim-stage");
    var simBtns = Array.prototype.slice.call(sim.querySelectorAll(".sim-btn"));
    var simVlt = sim.querySelector("[data-sim-vlt]");
    // darker tint (lower VLT) => more overlay opacity. Illustrative, not exact.
    var vltToOpacity = function (vlt) { return Math.max(0, Math.min(0.85, (100 - vlt) / 100 * 0.82)); };
    var setVlt = function (vlt) {
      if (simStage) simStage.style.setProperty("--tint", String(vltToOpacity(vlt)));
      if (simVlt) simVlt.textContent = vlt + "%";
    };
    simBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        simBtns.forEach(function (b) { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        setVlt(parseInt(btn.getAttribute("data-vlt"), 10) || 35);
      });
    });
    var simActive = sim.querySelector(".sim-btn.is-active") || simBtns[0];
    if (simActive) setVlt(parseInt(simActive.getAttribute("data-vlt"), 10) || 35);
  }

  /* ---- Before / after tint reveal slider ---- */
  Array.prototype.slice.call(document.querySelectorAll(".ba-slider")).forEach(function (slider) {
    var range = slider.querySelector(".ba-range");
    var setPos = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty("--pos", pct + "%");
      if (range && Number(range.value) !== Math.round(pct)) range.value = String(Math.round(pct));
    };
    // keyboard accessibility via the (visually hidden) range input
    if (range) {
      range.style.pointerEvents = "none"; // let the slider own pointer drags
      range.addEventListener("input", function () { setPos(Number(range.value)); });
    }
    // pointer drag anywhere on the image
    var dragging = false;
    var fromClientX = function (clientX) {
      var rect = slider.getBoundingClientRect();
      setPos(((clientX - rect.left) / rect.width) * 100);
    };
    slider.addEventListener("pointerdown", function (e) {
      dragging = true;
      try { slider.setPointerCapture(e.pointerId); } catch (err) { /* non-capturable pointer */ }
      fromClientX(e.clientX);
      if (range) range.focus({ preventScroll: true });
    });
    slider.addEventListener("pointermove", function (e) { if (dragging) fromClientX(e.clientX); });
    var endDrag = function () { dragging = false; };
    slider.addEventListener("pointerup", endDrag);
    slider.addEventListener("pointercancel", endDrag);
    setPos(range ? Number(range.value) : 50);
  });

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
