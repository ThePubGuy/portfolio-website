document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-link");
    const sections = document.querySelectorAll(".tab-content");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            const targetTab = this.getAttribute("data-tab");

            // Remove 'active' class from all tabs and sections
            tabs.forEach(t => t.classList.remove("active"));
            sections.forEach(section => {
                section.classList.remove("active", "animate__fadeIn");
            });

            // Add 'active' class to clicked tab and corresponding section
            this.classList.add("active");
            const activeSection = document.getElementById(targetTab);
            activeSection.classList.add("active", "animate__animated", "animate__fadeIn");

            // Scroll smoothly to the section
            activeSection.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Hamburger Menu Toggle
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("show");
    });
});
