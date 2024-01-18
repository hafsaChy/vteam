// logout.js
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logout-button').addEventListener('click', function () {
        // Add your logout logic here (e.g., clear local storage, redirect, or make a server request)
        console.log('Logout button clicked');

        // For example, you can redirect to the login page
        window.location.href = '/'; // Replace with your login route
    });
});

