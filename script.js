/**
 * PRAVIN CHANDORA — PORTFOLIO CONTROLLER
 * Clean, lightweight, dependency-free JavaScript
 */

// ============================================================================
// USER CONFIGURATION
// To customize links, update this configuration object:
// ============================================================================
const PORTFOLIO_CONFIG = {
  name: "Pravin Chandora",
  email: "pravinchandora4@gmail.com",
  github: "https://github.com/pravin-chandora",
  
  // LinkedIn URL: Set your LinkedIn profile URL below when ready!
  // Example: "https://www.linkedin.com/in/pravinchandora"
  linkedin: "" 
};

// ============================================================================
// INITIALIZATION ON DOM READY
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initLinkedInIntegration();
  initHeaderScroll();
  initMobileMenu();
  initActiveNavSpy();
  initCopyEmail();
  initWorkspaceTilt();
  updateCurrentYear();
});

/**
 * Configure the LinkedIn card based on PORTFOLIO_CONFIG
 */
function initLinkedInIntegration() {
  const linkedinCard = document.getElementById("linkedinCard");
  const linkedinBtn = document.getElementById("linkedinButton");
  const linkedinBtnText = document.getElementById("linkedinButtonText");
  const linkedinPlaceholder = document.getElementById("linkedinPlaceholderText");
  const linkedinDesc = document.getElementById("linkedinDesc");

  if (!linkedinBtn) return;

  if (PORTFOLIO_CONFIG.linkedin && PORTFOLIO_CONFIG.linkedin.trim() !== "") {
    // If a valid LinkedIn URL has been provided by the user
    linkedinBtn.href = PORTFOLIO_CONFIG.linkedin.trim();
    linkedinBtn.target = "_blank";
    linkedinBtn.rel = "noopener noreferrer";
    linkedinBtn.classList.remove("btn-disabled-look");
    linkedinBtn.removeAttribute("aria-label");
    if (linkedinBtnText) linkedinBtnText.textContent = "Connect on LinkedIn";
    if (linkedinPlaceholder) {
      linkedinPlaceholder.textContent = PORTFOLIO_CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, "");
    }
  } else {
    // LinkedIn URL not yet configured: keep it as a clean editable placeholder
    linkedinBtn.href = "#";
    linkedinBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("To add LinkedIn: Set 'linkedin' in script.js or edit index.html");
    });
  }
}

/**
 * Handle sticky header blur and border on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/**
 * Mobile Navigation Drawer Toggle & Behavior
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-drawer .btn");

  if (!menuToggle || !mobileDrawer) return;

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.classList.toggle("is-active", !isExpanded);
    mobileDrawer.classList.toggle("open", !isExpanded);
    mobileDrawer.setAttribute("aria-hidden", String(isExpanded));
    document.body.style.overflow = isExpanded ? "" : "hidden";
  };

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.classList.remove("is-active");
    mobileDrawer.classList.remove("open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close when clicking outside drawer content
  mobileDrawer.addEventListener("click", (e) => {
    if (e.target === mobileDrawer) {
      closeMenu();
    }
  });

  // Close on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
      closeMenu();
    }
  });
}

/**
 * Active Navigation Link Spy via IntersectionObserver
 */
function initActiveNavSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * Copy Email to Clipboard with Toast Notification
 */
function initCopyEmail() {
  const copyBtn = document.getElementById("copyEmailBtn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    const email = PORTFOLIO_CONFIG.email;
    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (err) {
        copied = false;
      }
    }

    // Fallback if clipboard API fails
    if (!copied) {
      try {
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        copied = true;
      } catch (e) {
        copied = false;
      }
    }

    if (copied) {
      showToast("Email copied to clipboard!");
    } else {
      showToast("Unable to copy. Please use mailto link.");
    }
  });
}

/**
 * Lightweight 3D Tilt Effect on Developer Workspace Visual
 */
function initWorkspaceTilt() {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const scene = document.getElementById("heroVisualScene");
  const viewport = document.getElementById("workspace3d");

  if (!scene || !viewport) return;

  // Only apply tilt on desktop pointers
  if (window.innerWidth <= 768) return;

  let ticking = false;

  const onMouseMove = (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = scene.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Subtle angles
        const rotateX = 6 - deltaY * 12;
        const rotateY = -8 + deltaX * 14;

        viewport.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        ticking = false;
      });
      ticking = true;
    }
  };

  const onMouseLeave = () => {
    viewport.style.transform = "rotateX(6deg) rotateY(-8deg)";
  };

  scene.addEventListener("mousemove", onMouseMove);
  scene.addEventListener("mouseleave", onMouseLeave);
}

/**
 * Toast Notification Helper
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const toastMsg = document.getElementById("toastMessage");

  if (!toast) return;

  if (toastMsg) {
    toastMsg.textContent = message;
  }

  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/**
 * Update current year in the footer dynamically
 */
function updateCurrentYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
