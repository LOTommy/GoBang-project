// Get references to the HTML elements for login and signup forms, buttons, and error messages
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// Add a submit event listener to the login form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting by default

    // Get the input values for username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send a POST request to the server with the input data
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    // Parse the server response as JSON
    const responseData = await response.json();

    // If the login is successful, redirect the user to the main page
    if (responseData.redirectTo) {
        const gameId = generateGameId();
        const gameUrl = `/main?username=${encodeURIComponent(username)}&gameId=${encodeURIComponent(gameId)}`;
        window.location.href = gameUrl;
    } else {
        // Display an error message if the login failed
        alert(responseData.message);
    }
});

// Add a submit event listener to the signup form
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from submitting by default
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    // Send a POST request to the server with the input data
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
    });

    // Parse the server response as JSON
    const data = await response.json();

    // If the user registration is successful, switch back to the login form
    if (data.message === 'User registered successfully!') {
        loginError.textContent = '';
        signupError.textContent = '';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        // Display an error message if the registration failed
        signupError.textContent = data.message;
    }
});

// Add click event listeners to the login and signup buttons to switch between forms
loginBtn.addEventListener('click', () => {
    loginError.textContent = '';
    signupError.textContent = '';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

signupBtn.addEventListener('click', () => {
    loginError.textContent = '';
    signupError.textContent = '';
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

// Generate a random game ID
function generateGameId() {
    return Math.random().toString(36).substr(2, 9);
}