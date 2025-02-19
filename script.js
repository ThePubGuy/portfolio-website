document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-link");
    const sections = document.querySelectorAll(".tab-content");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const themeSwitcher = document.querySelector(".theme-switcher");
  
    // Particle Configurations
    const darkParticlesConfig = {
      particles: {
        number: {
          value: 80,
          density: { enable: true, value_area: 800 },
        },
        color: { value: "#ffffff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: { value: 0.5, random: false, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    };
  
    const lightParticlesConfig = {
      particles: {
        number: {
          value: 80,
          density: { enable: true, value_area: 800 },
        },
        color: { value: "#000000" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: { value: 0.5, random: false, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#000000",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 1 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    };
  
    // Initialize particles with dark configuration by default
    particlesJS("particles-js", darkParticlesConfig);
  
    // Tab Switching
    tabs.forEach((tab) => {
      tab.addEventListener("click", function (event) {
        event.preventDefault();
        const targetTab = this.getAttribute("data-tab");
  
        // Remove 'active' class from all tabs and sections
        tabs.forEach((t) => t.classList.remove("active"));
        sections.forEach((section) => {
          section.classList.remove("active", "animate__fadeIn");
        });
  
        // Activate clicked tab and corresponding section
        this.classList.add("active");
        const activeSection = document.getElementById(targetTab);
        activeSection.classList.add("active", "animate__animated", "animate__fadeIn");
  
        // Hide mobile menu after clicking (if applicable)
        if (window.innerWidth <= 768) {
          navLinks.classList.remove("show");
        }
      });
    });
  
    // Hamburger Menu Toggle
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("show");
    });
  
    // Theme Switcher Logic
    themeSwitcher.addEventListener("click", function () {
      document.body.classList.toggle("light-theme");
      let icon = this.querySelector("i");
      if (document.body.classList.contains("light-theme")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        // Reinitialize particles with light configuration
        particlesJS("particles-js", lightParticlesConfig);
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        // Reinitialize particles with dark configuration
        particlesJS("particles-js", darkParticlesConfig);
      }
    });
  });
  