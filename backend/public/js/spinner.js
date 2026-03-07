window.addEventListener("load", function () {
   
        const pageLoader = document.getElementById("page-loader");
        const mainContent = document.getElementById("main-content");

        pageLoader.style.display = "none"; // Hide loader
        mainContent.style.visibility = "visible"; // Show content
        mainContent.style.opacity = "1";
});