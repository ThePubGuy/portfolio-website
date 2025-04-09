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

    // Macro Hub Data Fetch
    if (targetTab === "macro-hub" && !window.macroHubLoaded) {
      console.log("Loading Macro Hub data");
      fetchIndicesQuotes();
      fetchIndexHistorical("^DJI", "dji-chart");
      fetchIndexHistorical("^GSPC", "spx-chart");
      fetchIndexHistorical("^IXIC", "ixic-chart");
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

  // Macro Hub Functions
  const fmpApiKey = "Xu2OUy8tb3K0eswCJanBbEVGd7k9pRDU";
  const symbolMapping = {
    '^DJI': 'dji',
    '^GSPC': 'spx',
    '^IXIC': 'ixic'
  };

  async function fetchIndicesQuotes() {
    console.log("Fetching indices quotes");
    const url = `https://financialmodelingprep.com/api/v3/quote/^AAPL,^TSLA,^NVDA?apikey=${fmpApiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Raw API response:", data);
      if (!Array.isArray(data)) {
        throw new Error("API response is not an array: " + JSON.stringify(data));
      }
      data.forEach(index => {
        const symbol = index.symbol;
        const cardId = symbolMapping[symbol];
        const card = document.getElementById(cardId);
        if (card) {
          card.querySelector(".price").textContent = index.price ? index.price.toFixed(2) : 'N/A';
          card.querySelector(".change").textContent = index.change ? index.change.toFixed(2) : 'N/A';
          card.querySelector(".percent").textContent = index.changesPercentage ? index.changesPercentage.toFixed(2) : 'N/A';
          if (index.change > 0) card.querySelector(".change").classList.add("positive");
          else if (index.change < 0) card.querySelector(".change").classList.add("negative");
        } else {
          console.warn(`No card found for ${symbol}`);
        }
      });
    } catch (error) {
      console.error("Error fetching indices quotes:", error.message);
      const container = document.querySelector(".indices-container");
      if (container) container.innerHTML = '<p class="error">Failed to load data: ' + error.message + '</p>';
    }
  }

  async function fetchIndexHistorical(symbol, canvasId) {
    console.log(`Fetching historical data for ${symbol}`);
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${fmpApiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const historical = data.historical;
      if (historical && Array.isArray(historical)) {
        console.log(`Historical data for ${symbol}:`, historical);
        const dates = historical.map(d => d.date).reverse();
        const closes = historical.map(d => d.close).reverse();
        const ctx = document.getElementById(canvasId)?.getContext("2d");
        if (ctx) {
          // Get theme-aware colors from CSS variables
          const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-line-color').trim();
          const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-background-color').trim();
          
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: dates.slice(0, 7), // Last 7 days
              datasets: [{
                label: symbol,
                data: closes.slice(0, 7),
                borderColor: lineColor || 'rgba(75, 192, 192, 1)',
                backgroundColor: bgColor || 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                title: {
                  display: true,
                  text: `${symbol} - Last 7 Days`,
                  font: { size: 18 }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Date'
                  },
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 7
                  }
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Index Value'
                  },
                  beginAtZero: false,
                  suggestedMin: Math.min(...closes) * 0.95, // 5% below min
                  suggestedMax: Math.max(...closes) * 1.05  // 5% above max
                }
              }
            }
          });
          console.log(`Chart rendered for ${symbol}`);
        } else {
          console.error(`No canvas found for ${canvasId}`);
        }
      } else {
        throw new Error("Invalid historical data format");
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error.message);
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
