const API_URL = "https://script.google.com/macros/s/AKfycbyvGochPac0GII-rveDp37btpV97r10bgMF0fS3NdCHZ2cxAPLFvdHFMxp2CgVLIBn0/exec";

const roles = [
  "Junior Web Developer",
  "Project Manager",
  "Project Coordinator",
  "Business Analyst"
];

const typingRole = document.getElementById("typing-role");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRoles() {
  if (!typingRole) return;

  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    charIndex = Math.min(charIndex + 1, currentRole.length);
    typingRole.textContent = currentRole.substring(0, charIndex);

    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeRoles, 1200);
      return;
    }
  } else {
    charIndex = Math.max(charIndex - 1, 0);
    typingRole.textContent = currentRole.substring(0, charIndex);

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeRoles, isDeleting ? 55 : 90);
}

typeRoles();

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-link");

function updateActiveNav() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const hash = href.includes("#") ? href.split("#").pop() : "";
    link.classList.toggle("active", hash === currentSection);
  });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

const experienceCards = document.querySelectorAll(".experience-card");

experienceCards.forEach((card) => {
  const header = card.querySelector(".experience-header");
  const icon = card.querySelector(".experience-header strong");

  if (!header || !icon) return;

  header.addEventListener("click", () => {
    card.classList.toggle("active");
    icon.textContent = card.classList.contains("active") ? "−" : "+";
  });
});

const neonProjectCards = document.querySelectorAll(".neon-project-card");

neonProjectCards.forEach((card) => {
  const learnMoreBtn = card.querySelector(".learn-more-btn");
  const backBtn = card.querySelector(".flip-back-btn");

  function showBack() {
    card.classList.add("is-flipped");
  }

  function showFront() {
    card.classList.remove("is-flipped");
  }

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showBack();
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showFront();
    });
  }

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("is-flipped");
    }
  });
});

const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.textContent = "Sending...";

    const formData = new FormData(contactForm);
    const data = {
      type: "message",
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(data)
      });

      formStatus.textContent = "Message sent successfully!";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = "Something went wrong. Please try again.";
      console.error(error);
    }
  });
}

const copyBtn = document.querySelector(".copy-email-btn");

if (copyBtn) {
  copyBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText("bonsuarez.discaya@gmail.com");

      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 10.6667C11 10.6667 11.75 10.6667 12.5 12C12.5 12 14.8824 8.66667 17 8"></path>
          <path d="M7 11V9C7 5.70017 7 4.05025 8.02513 3.02513C9.05025 2 10.7002 2 14 2C17.2998 2 18.9497 2 19.9749 3.02513C21 4.05025 21 5.70017 21 9V11C21 14.2998 21 15.9497 19.9749 16.9749C18.9497 18 17.2998 18 14 18C10.7002 18 9.05025 18 8.02513 16.9749C7 15.9497 7 14.2998 7 11Z"></path>
          <path d="M3 6V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H17"></path>
        </svg>
      `;

      copyBtn.classList.add("copied");

      setTimeout(() => {
        copyBtn.innerHTML = '<i class="hgi hgi-stroke hgi-rounded hgi-copy-01"></i>';
        copyBtn.classList.remove("copied");
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  });
}

function getDeviceType() {
  return window.innerWidth <= 768 ? "Mobile" : "Desktop";
}

function getBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  return "Unknown";
}

function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "MacOS";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  return "Unknown";
}

async function trackPortfolioView() {
  if (!document.querySelector("#home")) return;

  const today = new Date().toISOString().split("T")[0];
  const lastTrackedDate = localStorage.getItem("portfolioViewDate");

  if (lastTrackedDate === today) return;

  const viewData = {
    type: "view",
    page: "Portfolio",
    device: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screenWidth: window.innerWidth
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(viewData)
    });

    localStorage.setItem("portfolioViewDate", today);
  } catch (error) {
    console.error("View tracking failed:", error);
  }
}

trackPortfolioView();

const themeButtons = document.querySelectorAll(".theme-toggle");
const savedTheme = localStorage.getItem("portfolioTheme") || "dark";

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolioTheme", theme);

  themeButtons.forEach((button) => {
    const isLight = theme === "light";
    button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    button.innerHTML = isLight
      ? '<i class="hgi hgi-stroke hgi-rounded hgi-sun-03"></i>'
      : '<i class="hgi hgi-stroke hgi-rounded hgi-moon-02"></i>';
  });
}

setTheme(savedTheme);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
});

const logoSkills = document.querySelectorAll(".logo-skill");

logoSkills.forEach((skill) => {
  skill.setAttribute("tabindex", "0");

  skill.addEventListener("click", (event) => {
    event.stopPropagation();

    logoSkills.forEach((item) => {
      if (item !== skill) item.classList.remove("show-label");
    });

    skill.classList.toggle("show-label");
  });
});

document.addEventListener("click", () => {
  logoSkills.forEach((skill) => {
    skill.classList.remove("show-label");
  });
});

/* ===========================
   Desktop Glitter Cursor
=========================== */

const customCursor = document.querySelector(".custom-cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)");

if (customCursor && finePointer.matches) {
  document.body.classList.add("has-custom-cursor");

  const cursorColors = [
    { color: "#d96b6b", glow: "rgba(217, 107, 107, 0.42)" },
    { color: "#a855f7", glow: "rgba(168, 85, 247, 0.44)" },
    { color: "#22d3ee", glow: "rgba(34, 211, 238, 0.42)" },
    { color: "#facc15", glow: "rgba(250, 204, 21, 0.4)" },
    { color: "#fb7185", glow: "rgba(251, 113, 133, 0.42)" },
    { color: "#4ade80", glow: "rgba(74, 222, 128, 0.4)" }
  ];

  let cursorX = -100;
  let cursorY = -100;
  let colorIndex = 0;
  let lastGlitterAt = 0;

  function applyCursorColor() {
    const palette = cursorColors[colorIndex];
    document.documentElement.style.setProperty("--cursor-color", palette.color);
    document.documentElement.style.setProperty("--cursor-glow", palette.glow);
  }

  function positionCursor() {
    customCursor.style.transform = `translate3d(${cursorX - 17}px, ${cursorY - 17}px, 0)`;
    requestAnimationFrame(positionCursor);
  }

  function createGlitter(x, y, burst = false) {
    const particle = document.createElement("span");
    const starParticle = Math.random() > 0.58;

    particle.className = starParticle ? "cursor-glitter is-star" : "cursor-glitter";
    if (starParticle) particle.textContent = Math.random() > 0.5 ? "✦" : "✧";

    const distance = burst ? 34 + Math.random() * 28 : 10 + Math.random() * 16;
    const angle = Math.random() * Math.PI * 2;
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;
    const size = starParticle ? 7 + Math.random() * 6 : 4 + Math.random() * 4;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty("--glitter-x", `${xOffset}px`);
    particle.style.setProperty("--glitter-y", `${yOffset}px`);
    particle.style.setProperty("--particle-size", `${size}px`);

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 760);
  }

  window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    customCursor.classList.add("is-visible");

    const now = performance.now();
    if (now - lastGlitterAt > 45) {
      createGlitter(cursorX, cursorY);
      lastGlitterAt = now;
    }
  });

  document.documentElement.addEventListener("mouseleave", () => {
    customCursor.classList.remove("is-visible");
  });

  document.documentElement.addEventListener("mouseenter", () => {
    customCursor.classList.add("is-visible");
  });

  window.addEventListener("mousedown", () => {
    colorIndex = (colorIndex + 1) % cursorColors.length;
    applyCursorColor();
    customCursor.classList.add("is-clicking");

    for (let i = 0; i < 9; i += 1) {
      createGlitter(cursorX, cursorY, true);
    }
  });

  window.addEventListener("mouseup", () => {
    customCursor.classList.remove("is-clicking");
  });

  applyCursorColor();
  positionCursor();
}

