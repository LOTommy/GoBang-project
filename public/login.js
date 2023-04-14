const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`,
    });

    const data = await response.json();

    if (data.loggedIn) {
        const gameId = generateGameId();
        const gameUrl = `/main?username=${encodeURIComponent(username)}&gameId=${encodeURIComponent(gameId)}`;
        window.location.href = gameUrl;
    } else {
        loginError.textContent = data.message;
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${username}&password=${password}`, // Updated this line
    });

    const data = await response.json();

    if (data.message === 'User registered successfully!') {
        loginError.textContent = '';
        signupError.textContent = '';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signupError.textContent = data.message;
    }
});

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

async function login() {
    // Get the form input values
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
        sessionStorage.setItem("username", username);
        window.location.href = responseData.redirectTo;
    } else {
        // Display an error message if the login failed
        alert(responseData.message);
    }
}

function generateGameId() {
    return Math.random().toString(36).substr(2, 9);
}