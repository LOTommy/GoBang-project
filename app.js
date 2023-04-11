const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Replace the placeholders with your actual MySQL database credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'remoteuser',
    password: '338rkoqg',
    database: 'gobang'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public' + '/index.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            res.json({ message: 'Login successful', redirectTo: '/main' });
        } else {
            res.json({ message: 'Incorrect username or password' });
        }
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserQuery, [username], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while checking the username' });
            return;
        }

        if (result.length > 0) {
            res.json({ message: 'Username is already taken' });
        } else {
            const createUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(createUserQuery, [username, password], (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'An error occurred while creating the user' });
                    return;
                }

                res.json({ message: 'User registered successfully!' });
            });
        }
    });
});


app.get('/main', (req, res) => {
    // Handle main page request
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
