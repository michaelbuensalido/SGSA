/**
 * SGSA Core UI (vanilla JS)
 * Centralized shared logic for all pages
 * 
 * Components:
 * - Navbar scroll effect
 * - Mobile menu panel (open/close/toggle)
 * - Mobile accordions (handyman, renovation, projects)
 * - SGSA Scroll Reveal system
 * - Page transitions
 */

(() => {
  "use strict";

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------
   * Mobile Menu Panel (Dropdown from top)
   * --------------------------------------------- */
  function initMobileMenu() {
    const mobileMenuBtn = qs("#mobile-menu-btn");
    const mobileMenuPanel = qs("#mobile-menu-panel");
    const mobileMenuOverlay = qs("#mobile-menu-overlay");
    const mobileMenuClose = qs("#mobile-menu-close");

    if (!mobileMenuBtn || !mobileMenuPanel) return;

    function openMobileMenu() {
      mobileMenuPanel.classList.add("active");
      mobileMenuBtn.classList.add("active"); // Hamburger to X
      mobileMenuBtn.setAttribute("aria-expanded", "true");
      if (mobileMenuOverlay) mobileMenuOverlay.classList.add("active");
      document.body.classList.add("menu-open");
    }

    function closeMobileMenu() {
      mobileMenuPanel.classList.remove("active");
      mobileMenuBtn.classList.remove("active"); // X to Hamburger
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
      document.body.classList.remove("menu-open");
    }

    // Toggle on button click
    mobileMenuBtn.addEventListener("click", () => {
      if (mobileMenuPanel.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close button (if exists)
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMobileMenu);
    }

    // Overlay click
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener("click", closeMobileMenu);
    }

    // Close on link click
    const mobileMenuLinks = qsa('a:not([href="#"])', mobileMenuPanel);
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setTimeout(closeMobileMenu, 150);
      });
    });
  }

  /* ---------------------------------------------
   * Mobile Accordions (Handyman, Renovation, Projects)
   * --------------------------------------------- */
  function initMobileAccordions() {
    // Handyman accordion
    const handymanBtn = qs("#mobile-handyman-btn");
    const handymanMenu = qs("#mobile-handyman-menu");
    const handymanArrow = qs("#mobile-handyman-arrow");

    if (handymanBtn && handymanMenu) {
      handymanBtn.addEventListener("click", () => {
        handymanMenu.classList.toggle("hidden");
        if (handymanArrow) handymanArrow.classList.toggle("rotate-180");
      });
    }

    // Renovation accordion
    const renovationBtn = qs("#mobile-renovation-btn");
    const renovationMenu = qs("#mobile-renovation-menu");
    const renovationArrow = qs("#mobile-renovation-arrow");

    if (renovationBtn && renovationMenu) {
      renovationBtn.addEventListener("click", () => {
        renovationMenu.classList.toggle("hidden");
        if (renovationArrow) renovationArrow.classList.toggle("rotate-180");
      });
    }

    // Projects accordion
    const projectsBtn = qs("#mobile-projects-btn");
    const projectsMenu = qs("#mobile-projects-menu");
    const projectsArrow = qs("#mobile-projects-arrow");

    if (projectsBtn && projectsMenu) {
      projectsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = projectsMenu.classList.contains("hidden");
        projectsMenu.classList.toggle("hidden");
        if (projectsArrow) projectsArrow.classList.toggle("rotate-180", isHidden);
        projectsBtn.setAttribute("aria-expanded", isHidden ? "true" : "false");
      });
    }
  }

  /* ---------------------------------------------
   * Desktop Projects Dropdown
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

    button.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(!open);
    });

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

    document.addEventListener("click", (e) => {
      if (!open) return;
      if (!wrapper.contains(e.target)) setOpen(false);
    });

    wrapper.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) setOpen(false);
      }, 0);
    });
  }

  /* ---------------------------------------------
   * Navbar Scroll Effect
   * Works for both homepage (transparent) and other pages (white)
   * --------------------------------------------- */
  function initNavbarScroll() {
    const navbar = qs("#navbar");
    if (!navbar) return;

    const navLinks = qsa(".nav-link", navbar);
    const mobileMenuBtn = qs("#mobile-menu-btn", navbar);
    const callButton = qs('a[href^="tel:"]', navbar);
    
    // Detect if this is the homepage
    const isHomePage = window.location.pathname.endsWith("index.html") || 
                       window.location.pathname === "/" || 
                       window.location.pathname.endsWith("/");

    const applyScrolledState = () => {
      navbar.classList.add("navbar-scrolled", "bg-white", "shadow-md");
      navbar.classList.remove("bg-transparent");
      
      // Change text colors to dark (for all pages when scrolled)
      navLinks.forEach((link) => {
        link.classList.remove("text-white", "hover:text-sky-400");
        link.classList.add("text-slate-700", "hover:text-cyan-600");
      });
      
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove("text-white", "hover:text-sky-400");
        mobileMenuBtn.classList.add("text-slate-700", "hover:text-cyan-600");
      }
      
      if (callButton) {
        callButton.classList.remove("bg-red-600", "hover:bg-red-700");
        callButton.classList.add("bg-cyan-600", "hover:bg-cyan-700");
      }
    };

    const applyTopState = () => {
      navbar.classList.remove("navbar-scrolled");
      
      if (isHomePage) {
        // Homepage at top: transparent with white text
        navbar.classList.remove("bg-white", "shadow-md");
        navbar.classList.add("bg-transparent");
        
        navLinks.forEach((link) => {
          link.classList.remove("text-slate-700", "hover:text-cyan-600");
          link.classList.add("text-white", "hover:text-sky-400");
        });
        
        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove("text-slate-700", "hover:text-cyan-600");
          mobileMenuBtn.classList.add("text-white", "hover:text-sky-400");
        }
        
        if (callButton) {
          callButton.classList.remove("bg-cyan-600", "hover:bg-cyan-700");
          callButton.classList.add("bg-red-600", "hover:bg-red-700");
        }
      } else {
        // Other pages at top: white with dark text, no shadow
        navbar.classList.add("bg-white");
        navbar.classList.remove("shadow-md");
      }
    };

    // Scroll event listener
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        applyScrolledState();
      } else {
        applyTopState();
      }
    }, { passive: true });

    // Set initial state
    if (window.scrollY > 20) {
      applyScrolledState();
    } else {
      applyTopState();
    }
  }

  /* ---------------------------------------------
   * SGSA Scroll Reveal System
   * Handles .sgsa-reveal, .scroll-animate, and .about-animate classes
   * --------------------------------------------- */
  function initScrollReveal() {
    const revealElements = qsa(".sgsa-reveal, .sgsa-reveal-children, .sgsa-line, .sgsa-vline");
    const scrollAnimateElements = qsa(".scroll-animate, .about-animate");
    
    if (!revealElements.length && !scrollAnimateElements.length) return;

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.85;

      // Handle SGSA reveal classes (adds .visible class)
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          el.classList.add("visible");
        }
      });

      // Handle scroll-animate and about-animate classes (adds .animated class)
      scrollAnimateElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerPoint) {
          el.classList.add("animated");
        }
      });
    };

    // Initial check
    revealOnScroll();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            revealOnScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------
   * Page Transitions (Enhanced)
   * Calm, professional, SGSA-signature transitions
   * --------------------------------------------- */
  function initPageTransitions() {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Ensure body is visible for reduced motion users
      document.body.classList.add("page-loaded");
      document.body.classList.remove("page-loading");
      return;
    }

    // Fade-in on page load
    const fadeInPage = () => {
      document.body.classList.remove("page-loading");
      requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
      });
    };

    // Check if page is already loaded
    if (document.readyState === "complete") {
      fadeInPage();
    } else {
      window.addEventListener("load", fadeInPage);
    }

    // Image loading handler - prevent content jumps
    const handleImageLoading = () => {
      const images = qsa("img:not(.no-transition):not(nav img):not(header img):not(footer img):not(.logo img)");

      images.forEach((img) => {
        // Skip small icons and decorative images
        if (img.width < 50 && img.height < 50) {
          img.classList.add("loaded");
          return;
        }

        if (img.complete && img.naturalHeight !== 0) {
          // Already loaded
          img.classList.add("loaded");
          img.setAttribute("data-loaded", "true");
        } else {
          // Not loaded yet - add load listener
          img.addEventListener(
            "load",
            () => {
              requestAnimationFrame(() => {
                img.classList.add("loaded");
                img.setAttribute("data-loaded", "true");
              });
            },
            { once: true }
          );

          // Fallback for images that fail to load
          img.addEventListener(
            "error",
            () => {
              img.classList.add("loaded");
              img.setAttribute("data-loaded", "true");
            },
            { once: true }
          );
        }
      });
    };

    // Run image handler after DOM is ready
    handleImageLoading();

    // Fade-out on navigation
    const handleLinkClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Skip external, anchor, mailto, tel, and new-tab links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        link.getAttribute("target") === "_blank"
      ) {
        return;
      }

      e.preventDefault();

      // Add exiting class for fade-out
      document.body.classList.remove("page-loaded");
      document.body.classList.add("page-exiting");

      // Mobile gets shorter transition (500ms), desktop gets 600ms
      const fadeOutDuration = window.innerWidth <= 768 ? 500 : 600;

      setTimeout(() => {
        window.location.href = href;
      }, fadeOutDuration);
    };

    document.addEventListener("click", handleLinkClick);
  }

  /* ---------------------------------------------
   * Initialize all core components
   * --------------------------------------------- */
  function init() {
    initMobileMenu();
    initMobileAccordions();
    initProjectsDropdown();
    initNavbarScroll();
    initScrollReveal();
    initPageTransitions();
  }

  // Add initial loading class immediately
  if (document.body) {
    document.body.classList.add("page-loading");
  } else {
    // Body not ready yet, add on DOM ready
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("page-loading");
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

