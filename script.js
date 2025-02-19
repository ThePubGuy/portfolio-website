console.log("Welcome to my portfolio!");

html {
    scroll-behavior: smooth;
}
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-link");
    const sections = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior

            // Remove 'active' class from all tabs and sections
            tabs.forEach(t => t.classList.remove("active"));
            sections.forEach(section => section.classList.remove("active"));

            // Add 'active' class to clicked tab and corresponding section
            this.classList.add("active");
            document.getElementById(this.getAttribute("data-tab")).classList.add("active");
        });
    });
});
