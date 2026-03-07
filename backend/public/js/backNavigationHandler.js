// Ensure the initial state is pushed on page load
// window.addEventListener("load", function () {
//     history.pushState(null, "", location.href);
// });

// window.addEventListener("popstate", function (event) {
//     Swal.fire({
//         title: "Are you sure you want to go back?",
//         text: "You might lose unsaved changes!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, go back",
//         cancelButtonText: "No, stay here",
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Redirect to a specific page (e.g., dashboard)
//             window.location.href = "/pages/home"; // Update to your desired URL
//         } else {
//             // Block the back action by pushing the current state again
//             history.pushState(null, "", location.href);
//             return;
//         }
//     });
// });

// Prevent accidental navigation by keyboard shortcuts (like Alt + ← or Cmd + [)
// window.addEventListener("beforeunload", function (event) {
//     // Custom message is ignored by most browsers, but this will still work as a safety measure
//     // event.preventDefault();
//     // event.returnValue = "";
//     Swal.fire({
//         title: "Are you sure you want to go back?",
//         text: "You will direct to home page!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, go back",
//         cancelButtonText: "No, stay here",
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Redirect to a specific page (e.g., dashboard)
//             window.location.href = "/pages/home"; // Update to your desired URL
//         } else {
//             // Block the back action by pushing the current state again
//             history.pushState(null, "", location.href);
//             return;
//         }
//     });
// });

// 

// // Push the initial state on page load to prevent back navigation issues

// // Listen to the back/forward navigation event
// window.addEventListener("popstate", function (event) {
//     // Prevent the back action by immediately pushing the state again
//     history.pushState(null, "", location.href);

//     // Show the confirmation dialog
//     Swal.fire({
//         title: "Are you sure you want to go back?",
//         text: "You will be directed to the home page!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, go back",
//         cancelButtonText: "No, stay here",
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Allow the back action by going to the home page
//             window.location.href = "/pages/home";
//         }
//     });
// });



// // Push the initial state right when the script runs
// history.pushState({ page: 1 }, "", location.href);

// // Listen to the back/forward navigation event
// window.addEventListener("popstate", function (event) {
//     window.addEventListener("load", function () {
//         history.pushState(null, "", location.href);
//         Swal.fire({
//             title: "Are you sure you want to go back?",
//             text: "You will be directed to the home page!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes, go back",
//             cancelButtonText: "No, stay here",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Allow the back action by going to the home page
//                 window.location.href = "/pages/home";
//             }
//         });
//     });
//     // Prevent going back by pushing the state again immediately
//     history.pushState({ page: 1 }, "", location.href);

//     // Show the confirmation dialog
//     Swal.fire({
//         title: "Are you sure you want to go back?",
//         text: "You will be directed to the home page!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, go back",
//         cancelButtonText: "No, stay here",
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Allow the back action by navigating to the home page
//             window.location.href = "/pages/home"; // Update to your desired URL
//         }
//     });
// });



document.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        // Prevent the default link behavior
        e.preventDefault();

        // Get the target URL
        const targetUrl = this.getAttribute("href");

        // Navigate to the target page without adding to the history stack
        window.location.replace(targetUrl);
    });
});