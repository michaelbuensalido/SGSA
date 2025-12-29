/**
 * SGSA Site UI (vanilla JS)
 * - Accessible "Our Projects" dropdown (desktop hover + keyboard + click)
 * - Mobile "Our Projects" accordion in the off-canvas menu
 * - Project pages: category filtering + lightbox modal + mobile tap-to-preview overlay
 *
 * NOTE:
 * We intentionally reuse the existing hover overlay system:
 * `.gallery-image-wrapper`, `.gallery-overlay`, `.overlay-active`
 * so the visual behavior stays consistent with your current Completed Projects page.
 */

(() => {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const isCoarsePointer = () =>
    window.matchMedia &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  /* ---------------------------------------------
   * Navbar: Our Projects dropdown (desktop hover, mobile click, keyboard)
   * --------------------------------------------- */
  function initProjectsDropdown() {
    const wrapper = qs("[data-projects-dropdown]");
    if (!wrapper) return;

    const button = qs("[data-projects-dropdown-button]", wrapper);
    const panel = qs("[data-projects-dropdown-panel]", wrapper);
    if (!button || !panel) return;

    let open = false;

    const setOpen = (next) => {
      open = Boolean(next);
      button.setAttribute("aria-expanded", open ? "true" : "false");

      // JS-driven open state for mobile/touch + keyboard.
      // Desktop hover still works via Tailwind group-hover/group-focus-within.
      if (open) {
        panel.style.opacity = "1";
        panel.style.visibility = "visible";
        panel.style.pointerEvents = "auto";
      } else {
        panel.style.opacity = "";
        panel.style.visibility = "";
        panel.style.pointerEvents = "";
      }
    };

    // Toggle on click (important for touch devices).
    button.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(!open);
    });

    // Keyboard support
    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.focus();
      }
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === button) {
        e.preventDefault();
        setOpen(!open);
      }
    });

    // Close when clicking outside.
    document.addEventListener("click", (e) => {
      if (!open) return;
      if (!wrapper.contains(e.target)) setOpen(false);
    });

    // Close when focus leaves the dropdown.
    wrapper.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) setOpen(false);
      }, 0);
    });
  }

  /* ---------------------------------------------
   * Mobile off-canvas: Our Projects accordion
   * --------------------------------------------- */
  function initMobileProjectsAccordion() {
    const btn = qs("#mobile-projects-btn");
    const menu = qs("#mobile-projects-menu");
    const arrow = qs("#mobile-projects-arrow");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const isHidden = menu.classList.contains("hidden");
      menu.classList.toggle("hidden");
      if (arrow) arrow.classList.toggle("rotate-180", isHidden);
      btn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    });
  }

  /* ---------------------------------------------
   * Project pages: Fade in images on load
   * --------------------------------------------- */
  function initProjectImageFadeIn() {
    const grid = qs("[data-project-grid]");
    if (!grid) return;

    qsa("img[data-project-img]", grid).forEach((img) => {
      const onLoad = () => {
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");
      };
      if (img.complete) onLoad();
      else img.addEventListener("load", onLoad, { once: true });
    });
  }

  /* ---------------------------------------------
   * Project pages: Mobile tap-to-preview overlay (keep existing behavior)
   * --------------------------------------------- */
  function initOverlayTap() {
    const wrappers = qsa(".gallery-image-wrapper");
    if (!wrappers.length) return;

    // Only enhance tap behavior on coarse pointer devices.
    if (!isCoarsePointer()) return;

    const closeAll = () => {
      wrappers.forEach((w) => w.classList.remove("overlay-active"));
    };

    wrappers.forEach((wrapper) => {
      wrapper.addEventListener(
        "touchstart",
        (e) => {
          // First tap shows overlay; second tap can proceed to lightbox click.
          const isOpen = wrapper.classList.contains("overlay-active");
          if (!isOpen) {
            e.preventDefault();
            closeAll();
            wrapper.classList.add("overlay-active");
          }
        },
        { passive: false }
      );
    });

    // Close overlay when tapping outside any image
    document.addEventListener(
      "touchstart",
      (e) => {
        if (wrappers.some((w) => w.contains(e.target))) return;
        closeAll();
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------
   * Project pages: Lightbox modal (accessible)
   * --------------------------------------------- */
  function initLightbox() {
    const modal = qs("[data-lightbox]");
    if (!modal) return;

    const backdrop = qs("[data-lightbox-backdrop]", modal);
    const dialog = qs("[data-lightbox-dialog]", modal);
    const img = qs("[data-lightbox-img]", modal);
    const caption = qs("[data-lightbox-caption]", modal);
    const closeBtn = qs("[data-lightbox-close]", modal);
    const triggers = qsa("[data-lightbox-trigger]");

    if (!backdrop || !dialog || !img || !closeBtn) return;

    let lastActive = null;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const getFocusables = () => qsa(focusableSelector, dialog).filter((el) => el.offsetParent !== null);

    const trapFocus = (e) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusables();
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const open = ({ src, alt, label }) => {
      lastActive = document.activeElement;

      img.src = src;
      img.alt = alt || "";
      if (caption) caption.textContent = label || alt || "";

      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-no-scroll");

      // Animate in
      requestAnimationFrame(() => {
        backdrop.classList.remove("opacity-0");
        backdrop.classList.add("opacity-100");
        dialog.classList.remove("opacity-0", "scale-95");
        dialog.classList.add("opacity-100", "scale-100");
      });

      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
      dialog.addEventListener("keydown", trapFocus);
    };

    const close = () => {
      // Animate out
      backdrop.classList.add("opacity-0");
      backdrop.classList.remove("opacity-100");
      dialog.classList.add("opacity-0", "scale-95");
      dialog.classList.remove("opacity-100", "scale-100");

      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-no-scroll");

      window.setTimeout(() => {
        modal.classList.add("hidden");
        img.src = "";
      }, 180);

      document.removeEventListener("keydown", onKeydown);
      dialog.removeEventListener("keydown", trapFocus);

      if (lastActive && typeof lastActive.focus === "function") lastActive.focus();
    };

    const onKeydown = (e) => {
      if (e.key === "Escape") close();
    };

    // Open handlers
    triggers.forEach((a) => {
      a.addEventListener("click", (e) => {
        // On touch devices, first tap is reserved for showing the overlay.
        if (isCoarsePointer() && !a.classList.contains("overlay-active")) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        const src = a.getAttribute("href") || a.getAttribute("data-full") || "";
        const alt = a.getAttribute("data-alt") || qs("img", a)?.getAttribute("alt") || "";
        const label = a.getAttribute("data-label") || "";
        if (!src) return;
        open({ src, alt, label });
      });
    });

    // Close handlers
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initProjectsDropdown();
    initMobileProjectsAccordion();
    initProjectImageFadeIn();
    initOverlayTap();
    initLightbox();
  });
})();

