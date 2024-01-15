document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3050/elcyckel/v1/users');
        const users = await response.json();

        // Check if the provided email and password match any user in the retrieved data
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Successful login
            console.log('Login successful');

            // Store user information in local storage
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            // Redirect to the user page
            window.location.href = '/user'; // Replace with your desired route
        } else {
            // Failed login, handle the error (show an error message, etc.)
            console.error('Login failed');
            // Optionally display an error message on the login form
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally display an error message on the login form
    }
});
