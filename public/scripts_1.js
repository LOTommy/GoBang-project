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
        window.location.href = '/main';
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
        body: 'username=${username}&password=${password}',
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
