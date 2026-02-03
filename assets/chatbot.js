/**
 * Reliable Engineering and Construction Chatbot (vanilla JS)
 * FAQ knowledge base and response generator
 * Only loads on pages with chat widget
 */

(() => {
  "use strict";

  const qs = (sel) => document.querySelector(sel);

  // Company Information Database
  const companyInfo = {
    name: "Reliable Engineering and Construction",
    officeHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
      publicHolidays: "Closed",
    },
    contact: {
      phone: ["+6585864098"],
      email: ["sgsaconstruction@gmail.com", "contact@sgsa.com"],
      address: "Jalan Besar Plaza #02-36, Singapore 208511",
    },
    services: [
      "Carpentry",
      "Electrical",
      "Plumbing",
      "Painting",
      "Hacking Demolition",
      "Tile Laying",
      "Renovation Works",
      "Waterproofing",
      "Aircon Services and Installation",
      "Ceiling and Wall Partitions",
      "Reinstatement Works",
    ],
    about:
      "Reliable Engineering and Construction is a leading construction company in Singapore with over 50 years of experience. We specialize in delivering exceptional construction projects with a commitment to safety, quality, and innovation.",
    experience: "50+ years",
    projectsCompleted: "500+",
    clientSatisfaction: "98%",
  };

  // FAQ Knowledge Base
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
      projectSupervision: "Yes, a dedicated supervisor will manage and monitor site progress.",
    },
    electrical: {
      services: "We provide wiring, rewiring, lighting, sockets, power points, fault repair, and troubleshooting for residential and commercial works. LED and smart system installation available. All works are performed by licensed electricians only.",
      licensed: "Yes, all electrical works are performed by licensed electricians only.",
      wiring: "Yes, we handle new wiring, rewiring, and electrical installations.",
      lighting: "Yes, we install indoor/outdoor lights, sockets, and power points.",
      faultRepair: "Yes, we provide electrical troubleshooting and repairs.",
      certified: "Yes, all works are done by licensed electricians with safety compliance.",
      smartSystems: "Yes, we can install LED, automation, and smart home electrical systems.",
      duration: "Depends on project size; typically 1-7 days for residential areas.",
    },
    plumbing: {
      services: "We handle residential and commercial plumbing including leak repair, burst pipe repair, blockage clearance, fixture installation (taps, sinks, toilets, showers), water heater installation, and pipe replacement.",
      residentialCommercial: "Yes, we cater to homes, offices, and commercial spaces.",
      leaks: "Yes, we provide pipe repairs, leak detection, and replacement.",
      fixtures: "Yes, we install sinks, taps, showers, toilets, and water heaters.",
      blockages: "Yes, we clear blocked drains and maintain plumbing systems.",
      emergency: "We offer fast-response services for urgent plumbing issues.",
      pipeReplacement: "Yes, we replace old or damaged pipes for long-term safety.",
    },
    waterproofing: {
      services: "We provide waterproofing for bathrooms, kitchens, balconies, and rooftops. Services include leak repair and waterproofing using liquid membrane, cementitious, and bitumen systems. Old surface preparation is included. Typical duration is 1-3 days.",
      areas: "Yes, we provide waterproofing for all wet areas including bathrooms, kitchens, balconies, and rooftops.",
      types: "Liquid membrane, cementitious coating, bituminous membranes, and epoxy coatings.",
      duration: "Typically 1-3 days, depending on area size and complexity.",
      leakRepair: "Yes, we identify leaks and provide effective waterproofing repairs.",
      oldSurfaces: "Yes, we prepare and treat old surfaces before waterproofing.",
      included: "Yes, waterproofing is part of wet-area renovation services.",
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
      protection: "Yes, we provide proper masking and protection before painting.",
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
      tileTypes: "Ceramic, porcelain, homogeneous, marble and feature tiles.",
    },
  };

  // Smart Response Generator
  function generateResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // Hours/timing questions
    if (message.includes("open") || message.includes("close") || message.includes("hours") || message.includes("time")) {
      if (message.includes("monday")) {
        return `We're open on Monday from ${companyInfo.officeHours.monday}. How else can we help?`;
      } else if (message.includes("saturday")) {
        return `We're open on Saturday from ${companyInfo.officeHours.saturday}. How else can we help?`;
      } else if (message.includes("sunday")) {
        return `We're ${companyInfo.officeHours.sunday.toLowerCase()} on Sunday. For urgent matters, please call our emergency line.`;
      } else if (message.includes("weekend")) {
        return `Weekend hours: Saturday ${companyInfo.officeHours.saturday}, Sunday ${companyInfo.officeHours.sunday}. How can we assist?`;
      } else {
        return `Our office hours are:\n• Monday-Friday: ${companyInfo.officeHours.monday}\n• Saturday: ${companyInfo.officeHours.saturday}\n• Sunday & Public Holidays: ${companyInfo.officeHours.sunday}`;
      }
    }

    // Contact/Phone questions
    if (message.includes("phone") || message.includes("contact") || message.includes("call") || message.includes("number")) {
      if (message.includes("site manager")) {
      return `Contact us at: ${companyInfo.contact.phone[0]}.`;
    }
    return `You can reach us at:\n• ${companyInfo.contact.phone[0]}`;
    }

    // Email questions
    if (message.includes("email") || message.includes("mail")) {
      return `You can email us at:\n• ${companyInfo.contact.email[0]}\n• ${companyInfo.contact.email[1]}`;
    }

    // Address questions
    if (message.includes("address") || message.includes("location") || message.includes("where")) {
      return `Our address is:\n${companyInfo.contact.address}`;
    }

    // Free Inspection
    if (message.includes("inspection") || (message.includes("free") && (message.includes("site") || message.includes("visit") || message.includes("quote") || message.includes("quotation")))) {
      return `Yes, we offer a free site inspection and a no-obligation quotation. For details, please contact us:\n📞 ${companyInfo.contact.phone[0]}\n📧 ${companyInfo.contact.email[0]}`;
    }

    // Compliance
    if (message.includes("compliance") || message.includes("hdb") || message.includes("bca") || message.includes("pub") || message.includes("regulation") || message.includes("permit")) {
      if (message.includes("permit")) {
        return faqKnowledge.generalRenovation.permits + " For specific permit requirements, please contact us for assistance.";
      }
      return faqKnowledge.generalRenovation.compliance;
    }

    // Project types
    if (message.includes("project type") || message.includes("residential") || message.includes("commercial") || message.includes("industrial")) {
      return faqKnowledge.generalRenovation.projectTypes;
    }

    // Duration
    if (message.includes("duration") || message.includes("how long") || message.includes("timeline") || message.includes("time frame")) {
      return faqKnowledge.generalRenovation.duration;
    }

    // Design
    if (message.includes("design") || message.includes("layout") || message.includes("planning")) {
      return faqKnowledge.generalRenovation.designSupport;
    }

    // Partial renovation
    if (message.includes("partial") || message.includes("kitchen only") || message.includes("bathroom only") || (message.includes("selected") && message.includes("area"))) {
      return faqKnowledge.generalRenovation.partialRenovation;
    }

    // Warranty
    if (message.includes("warranty") || message.includes("guarantee")) {
      return faqKnowledge.generalRenovation.warranty;
    }

    // Stay during renovation
    if (message.includes("stay") || message.includes("live") || (message.includes("during") && message.includes("renovation"))) {
      return faqKnowledge.generalRenovation.stayDuringRenovation;
    }

    // Pricing
    if (message.includes("pricing") || message.includes("price") || message.includes("cost") || message.includes("hidden") || message.includes("transparent")) {
      return faqKnowledge.generalRenovation.pricing;
    }

    // Budget
    if (message.includes("budget") || message.includes("affordable") || message.includes("cheap")) {
      return faqKnowledge.generalRenovation.budget;
    }

    // Hacking
    if (message.includes("hacking") || message.includes("demolition") || message.includes("demolish")) {
      return faqKnowledge.generalRenovation.hacking;
    }

    // Worker safety
    if (message.includes("worker") && (message.includes("safety") || message.includes("insured") || message.includes("trained"))) {
      return faqKnowledge.generalRenovation.workerSafety;
    }

    // Start process
    if (message.includes("start") && (message.includes("process") || message.includes("renovation") || message.includes("how"))) {
      return faqKnowledge.generalRenovation.startProcess;
    }

    // Licensed
    if (message.includes("licensed") && (message.includes("plumber") || message.includes("electrician"))) {
      return faqKnowledge.generalRenovation.licensed;
    }

    // Start immediately
    if (message.includes("start") && (message.includes("immediately") || message.includes("now") || message.includes("when"))) {
      return faqKnowledge.generalRenovation.startImmediately;
    }

    // Material selection
    if (message.includes("material") && (message.includes("selection") || message.includes("choose") || message.includes("help"))) {
      return faqKnowledge.generalRenovation.materialSelection;
    }

    // Changes during renovation
    if (message.includes("change") && (message.includes("during") || message.includes("renovation"))) {
      return faqKnowledge.generalRenovation.changesDuringRenovation;
    }

    // Payment
    if (message.includes("payment") || (message.includes("pay") && message.includes("structure"))) {
      return faqKnowledge.generalRenovation.paymentStructure;
    }

    // Protect furniture
    if (message.includes("protect") || message.includes("furniture") || message.includes("flooring")) {
      return faqKnowledge.generalRenovation.protectFurniture;
    }

    // Occupied units
    if (message.includes("occupied") || (message.includes("live") && message.includes("during"))) {
      return faqKnowledge.generalRenovation.occupiedUnits;
    }

    // Reinstatement
    if (message.includes("reinstatement")) {
      return faqKnowledge.generalRenovation.reinstatement;
    }

    // Night/weekend work
    if (message.includes("night") || message.includes("weekend") || message.includes("after hours")) {
      return faqKnowledge.generalRenovation.nightWeekendWork;
    }

    // Defects
    if (message.includes("defect") || (message.includes("problem") && message.includes("after"))) {
      return faqKnowledge.generalRenovation.defects;
    }

    // Supervision
    if (message.includes("supervisor") || message.includes("supervision") || message.includes("monitor")) {
      return faqKnowledge.generalRenovation.projectSupervision;
    }

    // Electrical
    if (message.includes("electrical") || message.includes("electric") || message.includes("wiring") || message.includes("rewiring") || message.includes("lighting") || message.includes("socket") || message.includes("power point") || message.includes("db") || message.includes("circuit") || message.includes("fault") || message.includes("led") || message.includes("smart system") || message.includes("outlet")) {
      if (message.includes("licensed") || message.includes("electrician") || message.includes("certified")) {
        return faqKnowledge.electrical.certified + "\n\n" + faqKnowledge.electrical.services;
      }
      if (message.includes("wiring") || message.includes("rewiring") || message.includes("installation")) {
        return faqKnowledge.electrical.wiring;
      }
      if (message.includes("lighting") || message.includes("light") || message.includes("outlet")) {
        return faqKnowledge.electrical.lighting;
      }
      if (message.includes("fault") || message.includes("short circuit") || message.includes("troubleshoot")) {
        return faqKnowledge.electrical.faultRepair;
      }
      if (message.includes("smart") || message.includes("led") || message.includes("energy") || message.includes("automation")) {
        return faqKnowledge.electrical.smartSystems;
      }
      if (message.includes("how long") || message.includes("duration") || message.includes("take")) {
        return faqKnowledge.electrical.duration;
      }
      return faqKnowledge.electrical.services;
    }

    // Plumbing
    if (message.includes("plumbing") || message.includes("plumber") || message.includes("leak") || message.includes("burst") || message.includes("pipe") || message.includes("blockage") || message.includes("clog") || message.includes("tap") || message.includes("sink") || message.includes("toilet") || message.includes("shower") || message.includes("water heater") || message.includes("fixture") || message.includes("drain") || message.includes("sewage")) {
      if (message.includes("residential") || message.includes("commercial") || message.includes("both")) {
        return faqKnowledge.plumbing.residentialCommercial;
      }
      if (message.includes("leak") || message.includes("burst")) {
        return faqKnowledge.plumbing.leaks;
      }
      if (message.includes("fixture") || message.includes("tap") || message.includes("toilet") || message.includes("sink") || message.includes("shower")) {
        return faqKnowledge.plumbing.fixtures;
      }
      if (message.includes("clog") || message.includes("blockage") || message.includes("drain") || message.includes("sewage")) {
        return faqKnowledge.plumbing.blockages;
      }
      if (message.includes("emergency") || message.includes("urgent") || message.includes("quick")) {
        return faqKnowledge.plumbing.emergency;
      }
      if (message.includes("replace") && message.includes("pipe")) {
        return faqKnowledge.plumbing.pipeReplacement;
      }
      return faqKnowledge.plumbing.services;
    }

    // Waterproofing
    if (message.includes("waterproof") || message.includes("waterproofing") || message.includes("membrane") || message.includes("cementitious") || message.includes("bitumen") || message.includes("epoxy")) {
      if (message.includes("bathroom") || message.includes("balcony") || message.includes("kitchen") || message.includes("rooftop")) {
        return faqKnowledge.waterproofing.areas;
      }
      if (message.includes("type") || message.includes("what kind") || message.includes("membrane") || message.includes("cementitious") || message.includes("bitumen") || message.includes("epoxy")) {
        return faqKnowledge.waterproofing.types;
      }
      if (message.includes("how long") || message.includes("duration") || message.includes("take")) {
        return faqKnowledge.waterproofing.duration;
      }
      if (message.includes("leak") || message.includes("repair")) {
        return faqKnowledge.waterproofing.leakRepair;
      }
      if (message.includes("old") || message.includes("existing") || message.includes("surface")) {
        return faqKnowledge.waterproofing.oldSurfaces;
      }
      if (message.includes("included") || message.includes("part of") || message.includes("renovate")) {
        return faqKnowledge.waterproofing.included;
      }
      return faqKnowledge.waterproofing.services;
    }

    // Painting
    if (message.includes("paint") || message.includes("painting") || message.includes("painter")) {
      if (message.includes("type") || message.includes("what paint") || message.includes("brand") || message.includes("voc")) {
        return faqKnowledge.painting.paintType;
      }
      if (message.includes("color") || message.includes("colour") || message.includes("recommend")) {
        return faqKnowledge.painting.colorConsultation;
      }
      if (message.includes("occupied") || message.includes("live") || message.includes("during")) {
        return faqKnowledge.painting.occupiedUnits;
      }
      if (message.includes("how long") || message.includes("duration") || message.includes("take")) {
        return faqKnowledge.painting.duration;
      }
      if (message.includes("preparation") || message.includes("surface") || message.includes("sanding") || message.includes("patching")) {
        return faqKnowledge.painting.surfacePreparation;
      }
      if (message.includes("partial") || message.includes("one room") || message.includes("feature wall")) {
        return faqKnowledge.painting.partialPainting;
      }
      if (message.includes("mould") || message.includes("mold") || message.includes("moisture") || message.includes("waterproof")) {
        return faqKnowledge.painting.antiMould;
      }
      if (message.includes("protect") || message.includes("furniture") || message.includes("floor")) {
        return faqKnowledge.painting.protection;
      }
      return faqKnowledge.painting.services;
    }

    // Tiling
    if (message.includes("tile") || message.includes("tiling") || message.includes("grout") || message.includes("sealing")) {
      if (message.includes("supply") || message.includes("provide tile") || message.includes("only installation")) {
        return faqKnowledge.tiling.supply;
      }
      if (message.includes("area") || message.includes("where") || message.includes("bathroom") || message.includes("kitchen") || message.includes("balcony")) {
        return faqKnowledge.tiling.areas;
      }
      if (message.includes("replace") || message.includes("damaged") || message.includes("cracked") || message.includes("repair")) {
        return faqKnowledge.tiling.replacement;
      }
      if (message.includes("waterproof") && message.includes("before")) {
        return faqKnowledge.tiling.waterproofingBefore;
      }
      if (message.includes("how long") || message.includes("duration") || message.includes("take")) {
        return faqKnowledge.tiling.duration;
      }
      if (message.includes("layout") || message.includes("pattern") || message.includes("advice") || message.includes("design")) {
        return faqKnowledge.tiling.layoutAdvice;
      }
      if (message.includes("remove") || message.includes("old tile") || message.includes("hack")) {
        return faqKnowledge.tiling.removeOldTiles;
      }
      if (message.includes("type") || message.includes("what tile") || message.includes("ceramic") || message.includes("porcelain") || message.includes("marble")) {
        return faqKnowledge.tiling.tileTypes;
      }
      return faqKnowledge.tiling.services;
    }

    // Services
    if (message.includes("service") || message.includes("what do you") || message.includes("offer") || message.includes("do you do")) {
      return `We offer:\n• ${companyInfo.services.join("\n• ")}\n\nLearn more on our Services page!`;
    }

    // About
    if (message.includes("about") || message.includes("who are you") || message.includes("company") || message.includes("experience")) {
      return `${companyInfo.about}\n\nOur Stats:\n• Experience: ${companyInfo.experience}\n• Projects: ${companyInfo.projectsCompleted} completed\n• Client Satisfaction: ${companyInfo.clientSatisfaction}`;
    }

    // Project inquiry
    if (message.includes("project") || message.includes("quote") || message.includes("estimate") || message.includes("bid")) {
      return `For project inquiries and quotes, please contact our team:\n📞 ${companyInfo.contact.phone[0]}\n📧 ${companyInfo.contact.email[0]}\n\nOur team will be happy to discuss your construction needs!`;
    }

    // Safety
    if (message.includes("safety") || message.includes("safe")) {
      return "Safety is our top priority! We maintain the highest safety standards and have a zero-accident culture. All projects follow strict safety protocols and compliance regulations. For safety inquiries, please contact us directly.";
    }

    // Default response
    return `Thank you for your inquiry! I'm an AI assistant here to help with basic information about Reliable Engineering and Construction. For specific project details or inquiries, please contact us directly:\n📞 ${companyInfo.contact.phone[0]}\n📧 ${companyInfo.contact.email[0]}`;
  }

  /* ---------------------------------------------
   * Initialize Chat Widget
   * --------------------------------------------- */
  function initChatbot() {
    const chatToggle = qs("#chat-toggle");
    const chatClose = qs("#chat-close");
    const chatWindow = qs("#chat-window");
    const chatForm = qs("#chat-form");
    const chatInput = qs("#chat-input");
    const chatMessages = qs("#chat-messages");

    // Gracefully exit if chat elements don't exist
    if (!chatToggle || !chatWindow || !chatForm || !chatInput || !chatMessages) return;

    chatToggle.addEventListener("click", () => {
      chatWindow.classList.toggle("hidden");
    });

    if (chatClose) {
      chatClose.addEventListener("click", () => {
        chatWindow.classList.add("hidden");
      });
    }

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        // Add user message
        const userMsg = document.createElement("div");
        userMsg.className = "flex justify-end";
        userMsg.innerHTML = `<div class="bg-gray-300 text-gray-900 rounded-lg p-3 max-w-xs"><p class="text-sm">${message}</p></div>`;
        chatMessages.appendChild(userMsg);
        chatInput.value = "";

        // Add bot response after delay
        setTimeout(() => {
          const response = generateResponse(message);
          const replyMsg = document.createElement("div");
          replyMsg.className = "flex items-end space-x-2";
          replyMsg.innerHTML = `<div class="bg-sky-600 text-white rounded-lg p-3 max-w-xs"><p class="text-sm whitespace-pre-line">${response}</p></div>`;
          chatMessages.appendChild(replyMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);

        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();

