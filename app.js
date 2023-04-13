const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

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

app.use(
    session({
      secret: 'oWM8NSYYQjhq4j',
      resave: false,
      saveUninitialized: true,
    })
  );

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
            req.session.user = {
                username: result[0].username,
                isAdmin: result[0].is_admin,
            };
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

function isAdmin(req, res, next) {
    const userIsAdmin = req.session && req.session.user && req.session.user.isAdmin;
  
    if (userIsAdmin) {
      next();
    } else {
      res.status(403).send('Access denied');
    }
}

app.get('/admin', isAdmin, (req, res) => {
    // Send the admin panel HTML file
    res.sendFile(__dirname + '/public' + '/admin.html');
  });
  
  // Get all users route
  app.get('/admin/users', isAdmin, (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
        return;
      }
      res.json(results);
    });
  });
  
  // Get game records for a specific user
  app.get('/admin/game-records/:username', isAdmin, (req, res) => {
    const { username } = req.params;
    const query = 'SELECT * FROM game_records WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching game records');
        return;
      }
      res.json(results);
    });
  });
  
  // Delete a user route
  app.delete('/admin/delete-user/:username', isAdmin, (req, res) => {
    const { username } = req.params;
    const query = 'DELETE FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
        return;
      }
      res.send('User deleted successfully');
    });
  });
  

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
