/**
 * SGSA Homepage Features (vanilla JS)
 * Page-specific logic for index.html only
 * 
 * Components:
 * - Stat counter animation (scroll-triggered)
 * - Testimonial carousel scroll animation
 */

(() => {
  "use strict";

  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------------------------------------------
   * Stat Counter Animation (scroll-triggered)
   * --------------------------------------------- */
  function initStatCounters() {
    const statCounters = qsa(".stat-counter");
    if (!statCounters.length) return;

    let hasAnimated = false;
    const duration = 2000; // 2 seconds animation

    function animateCounters() {
      if (hasAnimated) return;
      hasAnimated = true;

      const startTime = Date.now();

      statCounters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target"));
        const start = 0;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(start + (target - start) * progress);
          counter.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      });
    }

    // Set initial values to 0
    statCounters.forEach((counter) => {
      counter.textContent = "0";
    });

    // Create intersection observer for scroll-triggered animation
    const statSection =
      qs('[class*="mt-20"][class*="pb-16"]') ||
      qs("section.py-24")?.nextElementSibling ||
      qs('[class*="pt-16"]');

    if (statSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              setTimeout(animateCounters, 100);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      observer.observe(statSection);
    } else {
      // Fallback - animate on scroll
      setTimeout(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition > pageHeight / 2 && !hasAnimated) {
          animateCounters();
        }
      }, 1500);
    }

    // Also trigger on scroll as backup
    window.addEventListener("scroll", function () {
      if (!hasAnimated) {
        const firstCounter = statCounters[0];
        if (firstCounter) {
          const counterPosition = firstCounter.getBoundingClientRect();

          if (
            counterPosition.top >= 0 &&
            counterPosition.bottom <=
              (window.innerHeight || document.documentElement.clientHeight)
          ) {
            setTimeout(animateCounters, 100);
          }
        }
      }
    });
  }

  /* ---------------------------------------------
   * Testimonial Cards Scroll Animation
   * --------------------------------------------- */
  function initTestimonialAnimation() {
    const testimonialCards = qsa(
      "div.bg-white.p-8.rounded-lg.shadow-md.border-t-4"
    );
    if (!testimonialCards.length) return;

    // Add keyframe animation styles dynamically
    const styleId = "testimonial-animation-styles";
    if (!qs("#" + styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .testimonial-animate {
          will-change: opacity, transform;
        }
      `;
      document.head.appendChild(style);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay = (index % 6) * 0.15;
            entry.target.style.animation = `fadeInScale 0.6s ease-out ${delay}s forwards`;
            entry.target.classList.add("testimonial-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    testimonialCards.forEach((card) => {
      // Set initial state
      card.style.opacity = "0";
      card.style.transform = "scale(0.95)";
      card.style.transition = "none";
      // Observe
      observer.observe(card);
    });
  }

  /* ---------------------------------------------
   * Initialize homepage features
   * --------------------------------------------- */
  function init() {
    initStatCounters();
    initTestimonialAnimation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

