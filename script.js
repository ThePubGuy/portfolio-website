document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const tabs = document.querySelectorAll(".tab-link");
  const sections = document.querySelectorAll(".tab-content");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const themeSwitcher = document.querySelector(".theme-switcher");
  const themeIcon = themeSwitcher.querySelector("i");
  const backToTop = document.querySelector(".back-to-top");

  // Particle Configurations
  const baseParticlesConfig = {
    particles: {
      number: { value: window.innerWidth < 768 ? 40 : 80, density: { enable: true, value_area: 800 } },
      shape: { type: "circle", stroke: { width: 0 } },
      opacity: { value: 0.5, random: false, anim: { enable: false } },
      size: { value: 3, random: true, anim: { enable: false } },
      line_linked: { enable: true, distance: 150, opacity: 0.4, width: 1 },
      move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out" }
    },
    interactivity: window.innerWidth < 768 ? { events: {} } : {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
      modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  };

  const particleConfigs = {
    dark: { ...baseParticlesConfig, particles: { ...baseParticlesConfig.particles, color: { value: "#ffffff" }, line_linked: { ...baseParticlesConfig.particles.line_linked, color: "#ffffff" } } },
    light: { ...baseParticlesConfig, particles: { ...baseParticlesConfig.particles, color: { value: "#000000" }, line_linked: { ...baseParticlesConfig.particles.line_linked, color: "#000000" } } }
  };

  // Functions
  const switchTab = (tab) => {
    const targetTab = tab.getAttribute("data-tab");
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active", "animate__animated", "animate__fadeIn"));
    tab.classList.add("active");
    const activeSection = document.getElementById(targetTab);
    activeSection.classList.add("active", "animate__animated", "animate__fadeIn");
    activeSection.addEventListener("animationend", () => {
      activeSection.classList.remove("animate__animated", "animate__fadeIn");
    }, { once: true });
    if (window.innerWidth <= 768) navLinks.classList.remove("show");
    activeSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleMenu = () => navLinks.classList.toggle("show");

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle("light-theme");
    themeIcon.classList.toggle("fa-moon", !isLight);
    themeIcon.classList.toggle("fa-sun", isLight);
    try {
      particlesJS("particles-js", isLight ? particleConfigs.light : particleConfigs.dark);
    } catch (e) {
      console.error("Particles.js failed to load:", e);
    }
    localStorage.setItem("theme", isLight ? "light" : "dark");
  };

  // Initialize Theme and Particles
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    try {
      particlesJS("particles-js", particleConfigs.light);
    } catch (e) {
      console.error("Particles.js failed to load:", e);
    }
  } else {
    try {
      particlesJS("particles-js", particleConfigs.dark);
    } catch (e) {
      console.error("Particles.js failed to load:", e);
    }
  }

  // Back-to-Top Functionality
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 300);
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Event Listeners
  tabs.forEach(tab => tab.addEventListener("click", e => {
    e.preventDefault();
    switchTab(tab);
  }));
  hamburger.addEventListener("click", toggleMenu);
  themeSwitcher.addEventListener("click", toggleTheme);
});