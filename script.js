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
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typingRole.textContent = currentRole.substring(0, charIndex--);
  } else {
    typingRole.textContent = currentRole.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentRole.length + 1) {
    isDeleting = true;
    setTimeout(typeRoles, 1200);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRoles, isDeleting ? 55 : 90);
}

typeRoles();

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-link");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

const experienceCards = document.querySelectorAll(".experience-card");

experienceCards.forEach(card => {
  const header = card.querySelector(".experience-header");
  const icon = card.querySelector(".experience-header strong");

  header.addEventListener("click", () => {
    card.classList.toggle("active");
    icon.textContent = card.classList.contains("active") ? "−" : "+";
  });
});

const challengeItems = document.querySelectorAll(".challenge-item");

challengeItems.forEach(item => {
  const header = item.querySelector(".challenge-header");
  const icon = item.querySelector(".challenge-header strong");

  header.addEventListener("click", () => {
    item.classList.toggle("active");
    icon.textContent = item.classList.contains("active") ? "−" : "+";
  });
});

const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

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
  }
});

const copyBtn = document.querySelector(".copy-email-btn");

if (copyBtn) {
  copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText("bonsuarez.discaya@gmail.com");

     copyBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 10.6667C11 10.6667 11.75 10.6667 12.5 12C12.5 12 14.8824 8.66667 17 8"></path>
    <path d="M7 11V9C7 5.70017 7 4.05025 8.02513 3.02513C9.05025 2 10.7002 2 14 2C17.2998 2 18.9497 2 19.9749 3.02513C21 4.05025 21 5.70017 21 9V11C21 14.2998 21 15.9497 19.9749 16.9749C18.9497 18 17.2998 18 14 18C10.7002 18 9.05025 18 8.02513 16.9749C7 15.9497 7 14.2998 7 11Z"></path>
    <path d="M3 6V15C3 18.2998 3 19.9497 4.02513 20.9749C5.05025 22 6.70017 22 10 22H17"></path>
  </svg>
`;

copyBtn.classList.add("copied");

setTimeout(() => {
  copyBtn.innerHTML =
    '<i class="hgi hgi-stroke hgi-rounded hgi-copy-01"></i>';

  copyBtn.classList.remove("copied");
}, 2000);

    } catch (err) {
      console.error(err);
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