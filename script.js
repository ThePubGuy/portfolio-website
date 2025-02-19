document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-link");
    const sections = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            // Get the tab name from the clicked element's data attribute
            const targetTab = this.getAttribute("data-tab");

            // Remove 'active' class from all tabs and sections
            tabs.forEach(t => t.classList.remove("active"));
            sections.forEach(section => section.classList.remove("active"));

            // Add 'active' class to clicked tab and corresponding section
            this.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
        });
    });

    // Ensure the home section is visible by default
    document.getElementById("home").classList.add("active");
});
