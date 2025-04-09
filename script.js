document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, initializing script");

  // DOM Elements
  const tabs = document.querySelectorAll(".tab-link");
  const sections = document.querySelectorAll(".tab-content");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const themeSwitcher = document.querySelector(".theme-switcher");
  const themeIcon = themeSwitcher.querySelector("i");
  const backToTop = document.querySelector(".back-to-top");

  console.log("Found tabs:", tabs.length);
  console.log("Found sections:", sections.length);
  console.log("Hamburger:", hamburger);
  console.log("Nav links:", navLinks);
  console.log("Theme switcher:", themeSwitcher);
  console.log("Back to top:", backToTop);

  // Particle Configurations
  const baseParticlesConfig = {
    particles: {
      number: { value: window.innerWidth < 768 ? 40 : 80, density: { enable: true, value_area: 800 } },
      shape: { type: "circle", stroke: { width: 0 } },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
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

  // Initialize Particles.js
  console.log("Attempting to initialize Particles.js");
  if (typeof particlesJS === "undefined") {
    console.error("Particles.js library not loaded");
  } else {
    try {
      const savedTheme = localStorage.getItem("theme");
      particlesJS("particles-js", savedTheme === "light" ? particleConfigs.light : particleConfigs.dark);
      console.log("Particles.js initialized successfully");
    } catch (e) {
      console.error("Particles.js initialization failed:", e);
    }
  }

  // Tab Switching Function
  const switchTab = (tab) => {
    console.log("Switching to tab:", tab.dataset.tab);
    const targetTab = tab.getAttribute("data-tab");
    tabs.forEach(t => t.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active", "animate__animated", "animate__fadeIn"));
    tab.classList.add("active");
    const activeSection = document.getElementById(targetTab);
    if (!activeSection) {
      console.error(`No section found with ID: ${targetTab}`);
      return;
    }
    activeSection.classList.add("active", "animate__animated", "animate__fadeIn");
    activeSection.addEventListener("animationend", () => {
      activeSection.classList.remove("animate__animated", "animate__fadeIn");
    }, { once: true });
    if (window.innerWidth <= 768) navLinks.classList.remove("show");
    activeSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // Macro Hub Data Fetch for Gainers and Losers
    if (targetTab === "macro-hub" && !window.macroHubLoaded) {
      console.log("Loading Macro Hub data: Gainers and Losers");
      fetchTopGainers();
      fetchTopLosers();
      window.macroHubLoaded = true;
    }
  };

  // Toggle Mobile Menu
  const toggleMenu = () => {
    console.log("Toggling mobile menu");
    navLinks.classList.toggle("show");
  };

  // Toggle Theme
  const toggleTheme = () => {
    console.log("Toggling theme");
    const isLight = document.body.classList.toggle("light-theme");
    themeIcon.classList.toggle("fa-moon", !isLight);
    themeIcon.classList.toggle("fa-sun", isLight);
    if (typeof particlesJS !== "undefined") {
      try {
        particlesJS("particles-js", isLight ? particleConfigs.light : particleConfigs.dark);
        console.log("Theme switched, Particles.js updated");
      } catch (e) {
        console.error("Particles.js update failed:", e);
      }
    }
    localStorage.setItem("theme", isLight ? "light" : "dark");
  };

  // Macro Hub Functions for Gainers and Losers
  const fmpApiKey = "Xu2OUy8tb3K0eswCJanBbEVGd7k9pRDU";

  async function fetchTopGainers() {
    console.log("Fetching top gainers");
    const url = `https://financialmodelingprep.com/api/v3/gainers?apikey=${fmpApiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Gainers data received:", data);
      const topGainers = data.slice(0, 5); // Limit to top 5
      const container = document.querySelector(".gainers-container");
      if (container) {
        container.innerHTML = topGainers.map(stock => `
          <div class="stock-card positive">
            <h3>${stock.ticker}</h3>
            <p>Change: +${stock.changes?.toFixed(2) || 'N/A'} (+${stock.changesPercentage?.toFixed(2) || 'N/A'}%)</p>
            <p>Price: $${stock.price?.toFixed(2) || 'N/A'}</p>
          </div>
        `).join("");
      } else {
        console.warn("Gainers container not found");
      }
    } catch (error) {
      console.error("Error fetching gainers:", error);
      const container = document.querySelector(".gainers-container");
      if (container) container.innerHTML = "<p class='error'>Failed to load gainers data. Please try again later.</p>";
    }
  }

  async function fetchTopLosers() {
    console.log("Fetching top losers");
    const url = `https://financialmodelingprep.com/api/v3/losers?apikey=${fmpApiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Losers data received:", data);
      const topLosers = data.slice(0, 5); // Limit to top 5
      const container = document.querySelector(".losers-container");
      if (container) {
        container.innerHTML = topLosers.map(stock => `
          <div class="stock-card negative">
            <h3>${stock.ticker}</h3>
            <p>Change: ${stock.changes?.toFixed(2) || 'N/A'} (${stock.changesPercentage?.toFixed(2) || 'N/A'}%)</p>
            <p>Price: $${stock.price?.toFixed(2) || 'N/A'}</p>
          </div>
        `).join("");
      } else {
        console.warn("Losers container not found");
      }
    } catch (error) {
      console.error("Error fetching losers:", error);
      const container = document.querySelector(".losers-container");
      if (container) container.innerHTML = "<p class='error'>Failed to load losers data. Please try again later.</p>";
    }
  }

  // Theme Initialization
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }

  // Event Listeners
  tabs.forEach(tab => {
    console.log("Attaching listener to tab:", tab.dataset.tab);
    tab.addEventListener("click", e => {
      console.log("Tab clicked:", tab.dataset.tab);
      e.preventDefault();
      switchTab(tab);
    });
  });

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  } else {
    console.error("Hamburger button not found");
  }

  if (themeSwitcher) {
    themeSwitcher.addEventListener("click", toggleTheme);
  } else {
    console.error("Theme switcher not found");
  }

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 300);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    console.error("Back-to-top button not found");
  }
});
