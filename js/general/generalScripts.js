document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("#navbar a");

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            // Remove the active class from all links
            navLinks.forEach(link => link.classList.remove("active"));

            // Add the active class to the clicked link
            this.classList.add("active");
        });
    });

    // Optional: Automatically set the active class based on the current URL
    const currentPage = window.location.pathname.split("/").pop();
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});
