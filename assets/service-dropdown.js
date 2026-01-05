/**
 * SGSA Service Type Dropdown (vanilla JS)
 * For pages with Residential/Commercial service selection
 * Used on: electrical.html, plumbing.html
 */

(() => {
  "use strict";

  function initServiceTypeDropdown() {
    const dropdownBtn = document.getElementById("service-type-dropdown-btn");
    const dropdownMenu = document.getElementById("service-type-dropdown-menu");
    const dropdownArrow = document.getElementById("dropdown-arrow");
    const selectedText = document.getElementById("selected-service-text");
    const serviceOptions = document.querySelectorAll(".service-option");
    const residentialServices = document.getElementById("residential-services");
    const commercialServices = document.getElementById("commercial-services");

    // Gracefully exit if elements don't exist
    if (!dropdownBtn || !dropdownMenu) return;

    // Toggle dropdown
    dropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = !dropdownMenu.classList.contains("hidden");

      if (isOpen) {
        dropdownMenu.classList.add("hidden");
        if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
        dropdownBtn.setAttribute("aria-expanded", "false");
      } else {
        dropdownMenu.classList.remove("hidden");
        if (dropdownArrow) dropdownArrow.style.transform = "rotate(180deg)";
        dropdownBtn.setAttribute("aria-expanded", "true");
      }
    });

    // Select service option
    serviceOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const selectedValue = this.getAttribute("data-value") || this.getAttribute("data-service");
        const selectedLabel = this.textContent.trim();

        // Update selected text
        if (selectedText) selectedText.textContent = selectedLabel;

        // Close dropdown
        dropdownMenu.classList.add("hidden");
        if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
        dropdownBtn.setAttribute("aria-expanded", "false");

        // Update active state
        serviceOptions.forEach((opt) => {
          opt.classList.remove("bg-slate-50", "text-slate-900");
          opt.classList.add("text-slate-600");
        });
        this.classList.add("bg-slate-50", "text-slate-900");
        this.classList.remove("text-slate-600");

        // Show/hide service sections
        if (residentialServices && commercialServices) {
          if (selectedValue === "residential") {
            residentialServices.classList.remove("hidden");
            commercialServices.classList.add("hidden");
          } else if (selectedValue === "commercial") {
            residentialServices.classList.add("hidden");
            commercialServices.classList.remove("hidden");
          }
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
        if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
        dropdownBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Keyboard navigation
    dropdownBtn.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdownMenu.classList.add("hidden");
        if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
        dropdownBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initServiceTypeDropdown);
  } else {
    initServiceTypeDropdown();
  }
})();

