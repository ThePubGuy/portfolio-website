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
    if (targetTab === 'macro-hub' && !macroHubLoaded) {
      fetchIndicesQuotes();
      fetchIndexHistorical('DJI', 'dji-chart');
      fetchIndexHistorical('SPX', 'spx-chart');
      fetchIndexHistorical('IXIC', 'ixic-chart');
      macroHubLoaded = true;
    }
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

  // Macro Hub Functions
  let macroHubLoaded = false;
  const fmpApiKey = 'YOUR_FMP_API_KEY'; // Replace with your actual API key

  async function fetchIndicesQuotes() {
    const url = `https://financialmodelingprep.com/api/v3/quote/DJI,SPX,IXIC?apikey=${fmpApiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      data.forEach(index => {
        const symbol = index.symbol;
        const price = index.price;
        const change = index.change;
        const percent = index.changesPercentage;
        const cardId = symbol.toLowerCase();
        const card = document.getElementById(cardId);
        if (card) {
          card.querySelector('.price').textContent = price.toFixed(2);
          card.querySelector('.change').textContent = change.toFixed(2);
          card.querySelector('.percent').textContent = percent.toFixed(2);
          if (change > 0) card.querySelector('.change').classList.add('positive');
          else if (change < 0) card.querySelector('.change').classList.add('negative');
        }
      });
    } catch (error) {
      console.error('Error fetching indices quotes:', error);
      const container = document.querySelector('.indices-container');
      container.innerHTML = '<p class="error">Failed to load data. Please try again later.</p>';
    }
  }

  async function fetchIndexHistorical(symbol, canvasId) {
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${fmpApiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const historical = data.historical;
      if (historical) {
        const dates = historical.map(d => d.date).reverse();
        const closes = historical.map(d => d.close).reverse();
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: { labels: dates.slice(0, 7), datasets: [{ label: symbol, data: closes.slice(0, 7), borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)' }] },
          options: { scales: { y: { beginAtZero: false } } }
        });
      }
    } catch (error) {
      console.error('Error fetching historical data for', symbol, error);
    }
  }

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
