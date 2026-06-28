/* ============================================================
   Colton Curtner — interactions
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

  /* ---- Work showcase lightbox (no page redirect) ---- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbBody = document.getElementById("lightboxBody");
    var lbTitle = document.getElementById("lightboxTitle");
    var lbTag = document.getElementById("lightboxTag");
    var lastFocused = null;

    var openLightbox = function (card) {
      lastFocused = card;
      var title = card.getAttribute("data-title") || "";
      var tag = card.getAttribute("data-tag") || "";
      var safeTitle = title.replace(/"/g, "&quot;");
      // Priority: data-url (live iframe preview) → data-img (screenshot) → placeholder.
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
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = lightbox.querySelector(".lightbox-close");
      if (closeBtn) closeBtn.focus();
    };

    var closeLightbox = function () {
      lightbox.hidden = true;
      lbBody.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll(".showcase-card").forEach(function (card) {
      card.addEventListener("click", function () { openLightbox(card); });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target.getAttribute("data-close") === "true") closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
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

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
