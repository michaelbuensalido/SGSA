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
  
  // Make initProjectsDropdown available globally for fallback initialization
  let initProjectsDropdownFn = null;

  const isCoarsePointer = () =>
    window.matchMedia &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  /* ---------------------------------------------
   * Navbar: Our Projects dropdown (desktop hover, mobile click, keyboard)
   * --------------------------------------------- */
  let dropdownInitAttempts = 0;
  function initProjectsDropdown() {
    const wrapper = qs("[data-projects-dropdown]");
    if (!wrapper) {
      // Retry once after a short delay if element not found (for slow-loading pages)
      if (dropdownInitAttempts < 1 && document.readyState !== 'complete') {
        dropdownInitAttempts++;
        setTimeout(initProjectsDropdown, 50);
      }
      return;
    }

    const button = qs("[data-projects-dropdown-button]", wrapper);
    const panel = qs("[data-projects-dropdown-panel]", wrapper);
    if (!button || !panel) {
      // Retry once if button or panel not found
      if (dropdownInitAttempts < 1 && document.readyState !== 'complete') {
        dropdownInitAttempts++;
        setTimeout(initProjectsDropdown, 50);
      }
      return;
    }
    
      // Reset attempts counter on success
      dropdownInitAttempts = 0;

    let open = false;
    
    // Store function reference globally for fallback access
    initProjectsDropdownFn = initProjectsDropdown;

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

    // Toggle on click and touch (important for touch devices).
    const handleToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!open);
    };
    
    // Support both click and touchstart for better mobile compatibility
    button.addEventListener("click", handleToggle);
    button.addEventListener("touchstart", (e) => {
      // Only handle if it's a direct touch (not a click that followed)
      if (e.cancelable) {
        e.preventDefault();
      }
      handleToggle(e);
    }, { passive: false });

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

    // Close when clicking/touching outside.
    const handleOutsideClick = (e) => {
      if (!open) return;
      if (!wrapper.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    // Close when focus leaves the dropdown.
    wrapper.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) setOpen(false);
      }, 0);
    });
  }
  
  // Expose function globally for fallback initialization
  window.initProjectsDropdown = initProjectsDropdown;

 /* ---------------------------------------------
   * Mobile off-canvas: Our Projects accordion
   * --------------------------------------------- */
 let mobileAccordionInitAttempts = 0;
 function initMobileProjectsAccordion() {
   const btn = qs("#mobile-projects-btn");
   const menu = qs("#mobile-projects-menu");
   const arrow = qs("#mobile-projects-arrow");
   
   if (!btn || !menu) {
     // Retry up to 5 times if elements not found
     if (mobileAccordionInitAttempts < 5) {
       mobileAccordionInitAttempts++;
       setTimeout(initMobileProjectsAccordion, 100);
     }
     return;
   }

   // Reset attempts counter on success
   mobileAccordionInitAttempts = 0;
   
   // Mark as initialized to prevent duplicate event listeners
   if (btn.hasAttribute('data-accordion-initialized')) {
     return;
   }
   btn.setAttribute('data-accordion-initialized', 'true');

   const handleToggle = (e) => {
     e.preventDefault();
     e.stopPropagation();
     const isHidden = menu.classList.contains("hidden");
     menu.classList.toggle("hidden");
     if (arrow) arrow.classList.toggle("rotate-180", isHidden);
     btn.setAttribute("aria-expanded", isHidden ? "true" : "false");
   };

   // Support both click and touchstart for better mobile compatibility
   btn.addEventListener("click", handleToggle);
   btn.addEventListener("touchstart", (e) => {
     if (e.cancelable) {
       e.preventDefault();
     }
     handleToggle(e);
   }, { passive: false });
 }
 
 // Expose function globally for fallback initialization
 window.initMobileProjectsAccordion = initMobileProjectsAccordion;
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
      
      // Check if image is already loaded (including cached images)
      if (img.complete && img.naturalHeight !== 0) {
        // Image is already loaded, show it immediately
        onLoad();
      } else if (img.complete && img.naturalHeight === 0) {
        // Image failed to load, show it anyway (might be broken image icon)
        onLoad();
      } else {
        // Wait for image to load
        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", () => {
          // Even on error, show the image
          img.classList.remove("opacity-0");
          img.classList.add("opacity-100");
        }, { once: true });
        
        // Fallback: if image doesn't trigger load event within 2 seconds, show it anyway
        setTimeout(() => {
          if (img.classList.contains("opacity-0")) {
            onLoad();
          }
        }, 2000);
      }
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

  // Initialize functions
  let initialized = false;
  function init() {
    if (initialized) return; // Prevent double initialization
    initialized = true;
    initProjectsDropdown();
    initMobileProjectsAccordion();
    initProjectImageFadeIn();
    initOverlayTap();
    initLightbox();
  }

  // Initialize based on DOM ready state
  // This handles all cases: regular scripts, deferred scripts, and async scripts
  if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM is already parsed (interactive) or complete
    // Run immediately using setTimeout to ensure it runs after current stack
    setTimeout(init, 0);
  }
  
  // Also listen for DOMContentLoaded as a backup (safe even if already fired)
  // This ensures initialization happens even if timing is off
  document.addEventListener("DOMContentLoaded", init);
})();

 // Company Information Database
 const companyInfo = {
  name: "SGSA Construction",
  officeHours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed",
    publicHolidays: "Closed"
  },
  contact: {
    phone: ["+6560254678", "+6591758912"],
    email: ["sgsaconstruction@gmail.com", "contact@sgsa.com"],
    address: "Jalan Besar Plaza #02-36, Singapore 208511"
  },
  services: [
    "Residential Development",
    "Commercial & Retail",
    "Infrastructure & Civil Works",
    "Specialized Construction",
    "Design-Build",
    "Project Management"
  ],
  about: "SGSA Construction is a leading construction company in Singapore with over 50 years of experience. We specialize in delivering exceptional construction projects with a commitment to safety, quality, and innovation.",
  experience: "50+ years",
  projectsCompleted: "500+",
  clientSatisfaction: "98%"
};

// =============================================
// FAQ KNOWLEDGE BASE (Approved Content)
// =============================================
const faqKnowledge = {
  generalRenovation: {
    inspection: "Yes, we offer a free site inspection and a no-obligation quotation.",
    compliance: "Yes, all our renovation works comply with HDB, BCA and PUB regulations where applicable.",
    projectTypes: "Yes, we undertake residential, commercial and industrial renovation projects.",
    services: "We provide complete renovation services including civil, carpentry, electrical, plumbing, painting and reinstatement works.",
    duration: "Project duration depends on scope and size; we will provide a clear timeline after site inspection.",
    designSupport: "Yes, we provide layout planning and design support based on your requirements.",
    partialRenovation: "Yes, we handle partial renovations such as kitchen, bathroom or selected areas.",
    warranty: "Yes, we provide workmanship warranty subject to agreed terms and conditions.",
    permits: "Yes, we assist with all necessary permits and submissions required for renovation works.",
    stayDuringRenovation: "It depends on the renovation scope; our team will advise after site assessment.",
    pricing: "Yes, our quotations are clear, detailed and transparent with no hidden charges.",
    budget: "Yes, we can propose suitable options and materials to match your budget.",
    hacking: "Yes, we provide hacking, demolition and reinstatement services.",
    workerSafety: "Yes, all our workers are trained, insured and follow site safety regulations.",
    startProcess: "Simply leave your contact details or request a site inspection and our team will assist you.",
    licensed: "Yes, all plumbing and electrical works are carried out by licensed professionals.",
    startImmediately: "Start dates depend on project scope and approvals; we will confirm after site inspection.",
    materialSelection: "Yes, we guide you on material selection based on budget and design needs.",
    changesDuringRenovation: "Yes, changes are possible subject to feasibility, cost and timeline adjustment.",
    paymentStructure: "Payments are made in stages according to project progress.",
    protectFurniture: "Yes, we take proper protection measures during renovation.",
    occupiedUnits: "Yes, we can plan works to minimise disruption where possible.",
    reinstatement: "Yes, we provide full reinstatement and handover-ready solutions.",
    nightWeekendWork: "Yes, subject to approval, we can arrange after-hours works for commercial projects.",
    defects: "We will attend to defects within the warranty period.",
    projectSupervision: "Yes, a dedicated supervisor will manage and monitor site progress."
  },
  electrical: {
    services: "We provide wiring, rewiring, lighting, sockets, power points, fault repair, and troubleshooting for residential and commercial works. LED and smart system installation available. All works are performed by licensed electricians only.",
    licensed: "Yes, all electrical works are performed by licensed electricians only.",
    wiring: "Yes, we handle new wiring, rewiring, and electrical installations.",
    lighting: "Yes, we install indoor/outdoor lights, sockets, and power points.",
    faultRepair: "Yes, we provide electrical troubleshooting and repairs.",
    certified: "Yes, all works are done by licensed electricians with safety compliance.",
    smartSystems: "Yes, we can install LED, automation, and smart home electrical systems.",
    duration: "Depends on project size; typically 1-7 days for residential areas."
  },
  plumbing: {
    services: "We handle residential and commercial plumbing including leak repair, burst pipe repair, blockage clearance, fixture installation (taps, sinks, toilets, showers), water heater installation, and pipe replacement.",
    residentialCommercial: "Yes, we cater to homes, offices, and commercial spaces.",
    leaks: "Yes, we provide pipe repairs, leak detection, and replacement.",
    fixtures: "Yes, we install sinks, taps, showers, toilets, and water heaters.",
    blockages: "Yes, we clear blocked drains and maintain plumbing systems.",
    emergency: "We offer fast-response services for urgent plumbing issues.",
    pipeReplacement: "Yes, we replace old or damaged pipes for long-term safety."
  },
  waterproofing: {
    services: "We provide waterproofing for bathrooms, kitchens, balconies, and rooftops. Services include leak repair and waterproofing using liquid membrane, cementitious, and bitumen systems. Old surface preparation is included. Typical duration is 1-3 days.",
    areas: "Yes, we provide waterproofing for all wet areas including bathrooms, kitchens, balconies, and rooftops.",
    types: "Liquid membrane, cementitious coating, bituminous membranes, and epoxy coatings.",
    duration: "Typically 1-3 days, depending on area size and complexity.",
    leakRepair: "Yes, we identify leaks and provide effective waterproofing repairs.",
    oldSurfaces: "Yes, we prepare and treat old surfaces before waterproofing.",
    included: "Yes, waterproofing is part of wet-area renovation services."
  },
  painting: {
    services: "We provide professional painting services for residential and commercial properties, including interior and exterior painting, feature walls, and touch-up works.",
    paintType: "We use high-quality, low-VOC paints from trusted brands.",
    colorConsultation: "Yes, we provide colour consultation based on your space and lighting.",
    occupiedUnits: "Yes, we can carry out repainting with minimal disturbance.",
    duration: "Typically, 3-7 days, depending on area size and scope.",
    surfacePreparation: "Yes, surface cleaning, patching and sanding are included.",
    partialPainting: "Yes, partial painting works are available.",
    antiMould: "Yes, we offer anti-mould and moisture-resistant paint options.",
    protection: "Yes, we provide proper masking and protection before painting."
  },
  tiling: {
    services: "We provide tile laying and surface works including tile installation, replacement, grouting, and sealing for floors and walls.",
    supply: "We provide both tile supply and installation services.",
    areas: "Bathrooms, kitchens, living areas, balconies and outdoor areas.",
    replacement: "Yes, we provide tile replacement and repair services.",
    waterproofingBefore: "Yes, waterproofing is done prior to tiling for wet areas.",
    duration: "Usually 3-5 days, depending on tile type and area size.",
    layoutAdvice: "Yes, we assist with tile size, pattern and layout planning.",
    removeOldTiles: "Yes, hacking and disposal of old tiles can be arranged.",
    tileTypes: "Ceramic, porcelain, homogeneous, marble and feature tiles."
  }
};

// Smart Response Generator
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  
  // Hours/timing questions
  if (message.includes('open') || message.includes('close') || message.includes('hours') || message.includes('time')) {
    if (message.includes('monday')) {
      return `We're open on Monday from ${companyInfo.officeHours.monday}. How else can we help?`;
    } else if (message.includes('saturday')) {
      return `We're open on Saturday from ${companyInfo.officeHours.saturday}. How else can we help?`;
    } else if (message.includes('sunday')) {
      return `We're ${companyInfo.officeHours.sunday.toLowerCase()} on Sunday. For urgent matters, please call our emergency line.`;
    } else if (message.includes('weekend')) {
      return `Weekend hours: Saturday ${companyInfo.officeHours.saturday}, Sunday ${companyInfo.officeHours.sunday}. How can we assist?`;
    } else {
      return `Our office hours are:\n• Monday-Friday: ${companyInfo.officeHours.monday}\n• Saturday: ${companyInfo.officeHours.saturday}\n• Sunday & Public Holidays: ${companyInfo.officeHours.sunday}`;
    }
  }
  
  // Contact/Phone questions
  if (message.includes('phone') || message.includes('contact') || message.includes('call') || message.includes('number')) {
    if (message.includes('site manager')) {
      return `Our Site Manager's contact: ${companyInfo.contact.phone[1]}. You can reach them for project-specific inquiries.`;
    }
    return `You can reach us at:\n• Main: ${companyInfo.contact.phone[0]}\n• Site Manager: ${companyInfo.contact.phone[1]}`;
  }
  
  // Email questions
  if (message.includes('email') || message.includes('mail')) {
    return `You can email us at:\n• ${companyInfo.contact.email[0]}\n• ${companyInfo.contact.email[1]}`;
  }
  
  // Address questions
  if (message.includes('address') || message.includes('location') || message.includes('where')) {
    return `Our address is:\n${companyInfo.contact.address}`;
  }
  
  // =============================================
  // FAQ INTENT MATCHING (New Content)
  // =============================================
  
  // General Renovation Questions - Free Inspection
  if (message.includes('inspection') || (message.includes('free') && (message.includes('site') || message.includes('visit') || message.includes('quote') || message.includes('quotation')))) {
    return `Yes, we offer a free site inspection and a no-obligation quotation. For details, please contact us:\n📞 ${companyInfo.contact.phone[0]}\n📧 ${companyInfo.contact.email[0]}`;
  }
  
  if (message.includes('compliance') || message.includes('hdb') || message.includes('bca') || message.includes('pub') || message.includes('regulation') || message.includes('permit')) {
    if (message.includes('permit')) {
      return faqKnowledge.generalRenovation.permits + ` For specific permit requirements, please contact us for assistance.`;
    }
    return faqKnowledge.generalRenovation.compliance;
  }
  
  if (message.includes('project type') || message.includes('residential') || message.includes('commercial') || message.includes('industrial')) {
    return faqKnowledge.generalRenovation.projectTypes;
  }
  
  if (message.includes('duration') || message.includes('how long') || message.includes('timeline') || message.includes('time frame')) {
    return faqKnowledge.generalRenovation.duration;
  }
  
  if (message.includes('design') || message.includes('layout') || message.includes('planning')) {
    return faqKnowledge.generalRenovation.designSupport;
  }
  
  if (message.includes('partial') || message.includes('kitchen only') || message.includes('bathroom only') || (message.includes('selected') && message.includes('area'))) {
    return faqKnowledge.generalRenovation.partialRenovation;
  }
  
  if (message.includes('warranty') || message.includes('guarantee')) {
    return faqKnowledge.generalRenovation.warranty;
  }
  
  if (message.includes('stay') || message.includes('live') || (message.includes('during') && message.includes('renovation'))) {
    return faqKnowledge.generalRenovation.stayDuringRenovation;
  }
  
  if (message.includes('pricing') || message.includes('price') || message.includes('cost') || message.includes('hidden') || message.includes('transparent')) {
    return faqKnowledge.generalRenovation.pricing;
  }
  
  if (message.includes('budget') || message.includes('affordable') || message.includes('cheap')) {
    return faqKnowledge.generalRenovation.budget;
  }
  
  if (message.includes('hacking') || message.includes('demolition') || message.includes('demolish')) {
    return faqKnowledge.generalRenovation.hacking;
  }
  
  if (message.includes('worker') && (message.includes('safety') || message.includes('insured') || message.includes('trained'))) {
    return faqKnowledge.generalRenovation.workerSafety;
  }
  
  // General Renovation - Additional Questions
  if (message.includes('start') && (message.includes('process') || message.includes('renovation') || message.includes('how'))) {
    return faqKnowledge.generalRenovation.startProcess;
  }
  
  if (message.includes('licensed') && (message.includes('plumber') || message.includes('electrician'))) {
    return faqKnowledge.generalRenovation.licensed;
  }
  
  if (message.includes('start') && (message.includes('immediately') || message.includes('now') || message.includes('when'))) {
    return faqKnowledge.generalRenovation.startImmediately;
  }
  
  if (message.includes('material') && (message.includes('selection') || message.includes('choose') || message.includes('help'))) {
    return faqKnowledge.generalRenovation.materialSelection;
  }
  
  if (message.includes('change') && (message.includes('during') || message.includes('renovation'))) {
    return faqKnowledge.generalRenovation.changesDuringRenovation;
  }
  
  if (message.includes('payment') || (message.includes('pay') && message.includes('structure'))) {
    return faqKnowledge.generalRenovation.paymentStructure;
  }
  
  if (message.includes('protect') || (message.includes('furniture') || message.includes('flooring'))) {
    return faqKnowledge.generalRenovation.protectFurniture;
  }
  
  if (message.includes('occupied') || (message.includes('live') && message.includes('during'))) {
    return faqKnowledge.generalRenovation.occupiedUnits;
  }
  
  if (message.includes('reinstatement')) {
    return faqKnowledge.generalRenovation.reinstatement;
  }
  
  if (message.includes('night') || message.includes('weekend') || message.includes('after hours')) {
    return faqKnowledge.generalRenovation.nightWeekendWork;
  }
  
  if (message.includes('defect') || (message.includes('problem') && message.includes('after'))) {
    return faqKnowledge.generalRenovation.defects;
  }
  
  if (message.includes('supervisor') || message.includes('supervision') || message.includes('monitor')) {
    return faqKnowledge.generalRenovation.projectSupervision;
  }
  
  // Electrical Works Questions
  if (message.includes('electrical') || message.includes('electric') || message.includes('wiring') || message.includes('rewiring') || message.includes('lighting') || message.includes('socket') || message.includes('power point') || message.includes('db') || message.includes('circuit') || message.includes('fault') || message.includes('led') || message.includes('smart system') || message.includes('outlet')) {
    if (message.includes('licensed') || message.includes('electrician') || message.includes('certified')) {
      return faqKnowledge.electrical.certified + `\n\n${faqKnowledge.electrical.services}`;
    }
    if (message.includes('wiring') || message.includes('rewiring') || message.includes('installation')) {
      return faqKnowledge.electrical.wiring;
    }
    if (message.includes('lighting') || message.includes('light') || message.includes('outlet')) {
      return faqKnowledge.electrical.lighting;
    }
    if (message.includes('fault') || message.includes('short circuit') || message.includes('troubleshoot')) {
      return faqKnowledge.electrical.faultRepair;
    }
    if (message.includes('smart') || message.includes('led') || message.includes('energy') || message.includes('automation')) {
      return faqKnowledge.electrical.smartSystems;
    }
    if (message.includes('how long') || message.includes('duration') || message.includes('take')) {
      return faqKnowledge.electrical.duration;
    }
    return faqKnowledge.electrical.services;
  }
  
  // Plumbing Works Questions
  if (message.includes('plumbing') || message.includes('plumber') || message.includes('leak') || message.includes('burst') || message.includes('pipe') || message.includes('blockage') || message.includes('clog') || message.includes('tap') || message.includes('sink') || message.includes('toilet') || message.includes('shower') || message.includes('water heater') || message.includes('fixture') || message.includes('drain') || message.includes('sewage')) {
    if (message.includes('residential') || message.includes('commercial') || message.includes('both')) {
      return faqKnowledge.plumbing.residentialCommercial;
    }
    if (message.includes('leak') || message.includes('burst')) {
      return faqKnowledge.plumbing.leaks;
    }
    if (message.includes('fixture') || message.includes('tap') || message.includes('toilet') || message.includes('sink') || message.includes('shower')) {
      return faqKnowledge.plumbing.fixtures;
    }
    if (message.includes('clog') || message.includes('blockage') || message.includes('drain') || message.includes('sewage')) {
      return faqKnowledge.plumbing.blockages;
    }
    if (message.includes('emergency') || message.includes('urgent') || message.includes('quick')) {
      return faqKnowledge.plumbing.emergency;
    }
    if (message.includes('replace') && message.includes('pipe')) {
      return faqKnowledge.plumbing.pipeReplacement;
    }
    return faqKnowledge.plumbing.services;
  }
  
  // Waterproofing Questions
  if (message.includes('waterproof') || message.includes('waterproofing') || message.includes('membrane') || message.includes('cementitious') || message.includes('bitumen') || message.includes('epoxy')) {
    if (message.includes('bathroom') || message.includes('balcony') || message.includes('kitchen') || message.includes('rooftop')) {
      return faqKnowledge.waterproofing.areas;
    }
    if (message.includes('type') || message.includes('what kind') || message.includes('membrane') || message.includes('cementitious') || message.includes('bitumen') || message.includes('epoxy')) {
      return faqKnowledge.waterproofing.types;
    }
    if (message.includes('how long') || message.includes('duration') || message.includes('take')) {
      return faqKnowledge.waterproofing.duration;
    }
    if (message.includes('leak') || message.includes('repair')) {
      return faqKnowledge.waterproofing.leakRepair;
    }
    if (message.includes('old') || message.includes('existing') || message.includes('surface')) {
      return faqKnowledge.waterproofing.oldSurfaces;
    }
    if (message.includes('included') || message.includes('part of') || message.includes('renovate')) {
      return faqKnowledge.waterproofing.included;
    }
    return faqKnowledge.waterproofing.services;
  }
  
  // Painting Questions
  if (message.includes('paint') || message.includes('painting') || message.includes('painter')) {
    if (message.includes('type') || message.includes('what paint') || message.includes('brand') || message.includes('voc')) {
      return faqKnowledge.painting.paintType;
    }
    if (message.includes('color') || message.includes('colour') || message.includes('recommend')) {
      return faqKnowledge.painting.colorConsultation;
    }
    if (message.includes('occupied') || message.includes('live') || message.includes('during')) {
      return faqKnowledge.painting.occupiedUnits;
    }
    if (message.includes('how long') || message.includes('duration') || message.includes('take')) {
      return faqKnowledge.painting.duration;
    }
    if (message.includes('preparation') || message.includes('surface') || message.includes('sanding') || message.includes('patching')) {
      return faqKnowledge.painting.surfacePreparation;
    }
    if (message.includes('partial') || message.includes('one room') || message.includes('feature wall')) {
      return faqKnowledge.painting.partialPainting;
    }
    if (message.includes('mould') || message.includes('mold') || message.includes('moisture') || message.includes('waterproof')) {
      return faqKnowledge.painting.antiMould;
    }
    if (message.includes('protect') || message.includes('furniture') || message.includes('floor')) {
      return faqKnowledge.painting.protection;
    }
    return faqKnowledge.painting.services;
  }
  
  // Tiling Questions
  if (message.includes('tile') || message.includes('tiling') || message.includes('grout') || message.includes('sealing')) {
    if (message.includes('supply') || message.includes('provide tile') || message.includes('only installation')) {
      return faqKnowledge.tiling.supply;
    }
    if (message.includes('area') || message.includes('where') || message.includes('bathroom') || message.includes('kitchen') || message.includes('balcony')) {
      return faqKnowledge.tiling.areas;
    }
    if (message.includes('replace') || message.includes('damaged') || message.includes('cracked') || message.includes('repair')) {
      return faqKnowledge.tiling.replacement;
    }
    if (message.includes('waterproof') && message.includes('before')) {
      return faqKnowledge.tiling.waterproofingBefore;
    }
    if (message.includes('how long') || message.includes('duration') || message.includes('take')) {
      return faqKnowledge.tiling.duration;
    }
    if (message.includes('layout') || message.includes('pattern') || message.includes('advice') || message.includes('design')) {
      return faqKnowledge.tiling.layoutAdvice;
    }
    if (message.includes('remove') || message.includes('old tile') || message.includes('hack')) {
      return faqKnowledge.tiling.removeOldTiles;
    }
    if (message.includes('type') || message.includes('what tile') || message.includes('ceramic') || message.includes('porcelain') || message.includes('marble')) {
      return faqKnowledge.tiling.tileTypes;
    }
    return faqKnowledge.tiling.services;
  }
  
  // Services questions
  if (message.includes('service') || message.includes('what do you') || message.includes('offer') || message.includes('do you do')) {
    return `We offer:\n• ${companyInfo.services.join('\n• ')}\n\nLearn more on our Services page!`;
  }
  
  // About company
  if (message.includes('about') || message.includes('who are you') || message.includes('company') || message.includes('experience')) {
    return `${companyInfo.about}\n\nOur Stats:\n• Experience: ${companyInfo.experience}\n• Projects: ${companyInfo.projectsCompleted} completed\n• Client Satisfaction: ${companyInfo.clientSatisfaction}`;
  }
  
  // Project inquiry
  if (message.includes('project') || message.includes('quote') || message.includes('estimate') || message.includes('bid')) {
    return `For project inquiries and quotes, please contact our team:\n📞 ${companyInfo.contact.phone[0]}\n📧 ${companyInfo.contact.email[0]}\n\nOur team will be happy to discuss your construction needs!`;
  }
  
  // Safety questions
  if (message.includes('safety') || message.includes('safe')) {
    return `Safety is our top priority! We maintain the highest safety standards and have a zero-accident culture. All projects follow strict safety protocols and compliance regulations. For safety inquiries, please contact us directly.`;
  }
  
  // Default response (fallback to human follow-up)
  return `Thank you for your inquiry! I'm an AI assistant here to help with basic information about SGSA Construction. For specific project details or inquiries, please contact us directly:\n📞 ${companyInfo.contact.phone[0]}\n📧 ${companyInfo.contact.email[0]}`;
}


const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('hidden');
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message) {
    
    const userMsg = document.createElement('div');
    userMsg.className = 'flex justify-end';
    userMsg.innerHTML = `<div class="bg-gray-300 text-gray-900 rounded-lg p-3 max-w-xs"><p class="text-sm">${message}</p></div>`;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';

   
    setTimeout(() => {
      const response = generateResponse(message);
      const replyMsg = document.createElement('div');
      replyMsg.className = 'flex items-end space-x-2';
      replyMsg.innerHTML = `<div class="bg-sky-600 text-white rounded-lg p-3 max-w-xs"><p class="text-sm whitespace-pre-line">${response}</p></div>`;
      chatMessages.appendChild(replyMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

 // Off-canvas mobile menu
 const mobileMenuBtn = document.getElementById('mobile-menu-btn');
 const mobileMenuPanel = document.getElementById('mobile-menu-panel');
 const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
 const mobileMenuClose = document.getElementById('mobile-menu-close');
 function openMobileMenu() { mobileMenuPanel.classList.add('active'); mobileMenuOverlay.classList.add('active'); document.body.classList.add('menu-open'); }
 function closeMobileMenu() { mobileMenuPanel.classList.remove('active'); mobileMenuOverlay.classList.remove('active'); document.body.classList.remove('menu-open'); }
 if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
 if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
 if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
 const mobileMenuLinks = mobileMenuPanel?.querySelectorAll('a:not([href="#"])');
 mobileMenuLinks?.forEach(link => { link.addEventListener('click', () => { setTimeout(closeMobileMenu, 150); }); });
 // Mobile handyman accordion
 const mobileHandymanBtn = document.getElementById('mobile-handyman-btn');
 const mobileHandymanMenu = document.getElementById('mobile-handyman-menu');
 const mobileHandymanArrow = document.getElementById('mobile-handyman-arrow');
 if (mobileHandymanBtn && mobileHandymanMenu && mobileHandymanArrow) { mobileHandymanBtn.addEventListener('click', () => { mobileHandymanMenu.classList.toggle('hidden'); mobileHandymanArrow.classList.toggle('rotate-180'); }); }
 // Mobile renovation accordion
 const mobileRenovationBtn = document.getElementById('mobile-renovation-btn');
 const mobileRenovationMenu = document.getElementById('mobile-renovation-menu');
 const mobileRenovationArrow = document.getElementById('mobile-renovation-arrow');
 if (mobileRenovationBtn && mobileRenovationMenu && mobileRenovationArrow) { mobileRenovationBtn.addEventListener('click', () => { mobileRenovationMenu.classList.toggle('hidden'); mobileRenovationArrow.classList.toggle('rotate-180'); }); }
 // Navbar scroll effect
 const navbar = document.getElementById('navbar');
 const navLinks = navbar?.querySelectorAll('.nav-link');
 const mobileMenuButton = document.getElementById('mobile-menu-btn');
 if (navbar && navLinks) {
   window.addEventListener('scroll', () => {
     if (window.scrollY > 50) {
       navbar.classList.add('bg-white', 'shadow-lg'); navbar.classList.remove('bg-transparent');
       navLinks.forEach(link => { link.classList.remove('text-white', 'hover:text-sky-400'); link.classList.add('text-sky-600', 'hover:text-sky-500'); });
       if (mobileMenuButton) { mobileMenuButton.classList.remove('text-white', 'hover:text-sky-400'); mobileMenuButton.classList.add('text-gray-800', 'hover:text-sky-600'); }
     } else {
       navbar.classList.remove('bg-white', 'shadow-lg'); navbar.classList.add('bg-transparent');
       navLinks.forEach(link => { link.classList.remove('text-sky-600', 'hover:text-sky-500'); link.classList.add('text-white', 'hover:text-sky-400'); });
       if (mobileMenuButton) { mobileMenuButton.classList.remove('text-gray-800', 'hover:text-sky-600'); mobileMenuButton.classList.add('text-white', 'hover:text-sky-400'); }
     }
   });
 }