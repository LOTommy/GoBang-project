// Import required libraries and modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');

// Define constants
const boardSize = 19; // or any other value you want for the board size
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIO(server);

// Initialize game storage
const games =  {};
let nextGameId = 1; // Or any initial value you want

// Set up Socket.IO connection event handling
io.on('connection', (socket) => {
  // Log user connection
  console.log('User connected');

  // Handle user joining a game
  socket.on('joinGame', (data) => {
    // Get username from the received data
    const { username } = data;

    // Find a game with an open slot or create a new game if none are available
    let game = Object.values(games).find((game) => game.players.length < 2);

    if (!game) {
      // Create a new game with a unique ID, empty players array, and an empty board
      game = {
        id: nextGameId++,
        players: [],
        board: Array.from({ length: boardSize }, () => Array(boardSize).fill(null)),
      };
      games[game.id] = game;
    }

    // Add the player to the game and store the player's socket
    game.players.push({ username, socket });

    // Emit a 'playerJoined' event with the assigned game ID and player number
    socket.emit('playerJoined', {
      gameId: game.id,
      playerNumber: game.players.length,
      username,
    });

    // Log the user joining the game
    console.log(`User ${username} joined game ${game.id}`);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle user making a move
  socket.on('move', (data) => {
    // Log user move
    console.log(`User ${data.username} made a move in game ${data.gameId}`);

    // Update the game state on the server
    if (games[data.gameId]) {
      games[data.gameId].board[data.move.row][data.move.col] = data.move.piece;
      games[data.gameId].currentPlayer = data.move.nextPlayer;
    }

    // Broadcast the move to other users in the same room
    socket.to(data.gameId).emit('playerMove', { username: data.username, move: data.move });
  });

  // Handle game state update
  socket.on('gameUpdate', (data) => {
    // Log game update
    console.log(`Game ${data.gameId} updated`);

    // Update the game state on the server
    if (games[data.gameId]) {
      games[data.gameId] = data.newState;
    }

    // Broadcast the game update to other users in the same room
    socket.to(data.gameId).emit('gameStateChanged', { gameId: data.gameId, newState: data.newState });
  });
});

// Configure the MySQL database connection and connect to it
const db = mysql.createConnection({
  host: 'csci3100-mysql-server.mysql.database.azure.com',
  user: 'ylm',
  password: 'ibTdY8Kp99gSF6',
  database: 'gobang'
});

db.connect((err) => {
if (err) throw err;
// Log successful database connection
console.log('Connected to the database');
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure session middleware
app.use(
session({
  secret: 'oWM8NSYYQjhq4j',
  resave: false,
  saveUninitialized: true,
})
);

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Define the root route to serve the login page
app.get('/', (req, res) => {
res.sendFile(__dirname + '/public' + '/login.html');
});

// Define the login route to handle user authentication
app.post('/login', (req, res) => {
// Get the submitted username and password from the request body
const { username, password } = req.body;

// Define the SQL query to fetch user data based on the provided username and password
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.query(query, [username, password], (err, result) => {
  if (err) throw err;

  // Check if the provided credentials match a user in the database
  if (result.length > 0) {
    // Set the session user data
    req.session.user = {
      username: result[0].username,
      isAdmin: result[0].is_admin,
    };
    // Send a JSON response with a success message and a redirection URL
    res.json({ message: 'Login successful', redirectTo: result[0].is_admin ? '/admin' : '/main' });
  } else {
    // Send a JSON response with an error message
    res.json({ message: 'Incorrect username or password' });
  }
});
});

// Define the registration route to handle user registration
app.post('/register', (req, res) => {
// Get the submitted username and password from the request body
const { username, password } = req.body;

// Define the SQL query to check if the provided username already exists in the database
const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
db.query(checkUserQuery, [username], (err, result) => {
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while checking the username' });
    return;
  }

  // Check if the provided username is already taken
  if (result.length > 0) {
    res.json({ message: 'Username is already taken' });
  } else {
    // Define the SQL query to insert the new user into the database
    const createUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(createUserQuery, [username, password], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while creating the user' });
        return;
      }

      // Send a JSON response with a success message
      res.json({ message: 'User registered successfully!' });
    });
  }
});
});

// Define the main route to serve the game board HTML file
app.get('/main', (req, res) => {
res.sendFile(__dirname + '/public' + '/gameboard.html');
});

// Define the logout route to destroy the user session and redirect to the login page
app.get('/logout', (req, res) => {
req.session.destroy();
res.redirect('/');
});

// Define the isAdmin middleware function to check if a user is an admin
function isAdmin(req, res, next) {
  const userIsAdmin = req.session && req.session.user && req.session.user.isAdmin;

  if (userIsAdmin) {
    next(); // Continue to the next middleware or route handler
  } else {
    res.status(403).send('Access denied'); // Return a 403 Forbidden status if the user is not an admin
  }
}

// Define the admin route to serve the admin panel HTML file, protected by the isAdmin middleware
app.get('/admin', isAdmin, (req, res) => {
  res.sendFile(__dirname + '/public' + '/admin.html');
});

// Define the route to get all users, protected by the isAdmin middleware
app.get('/admin/users', isAdmin, (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results); // Return the fetched users as JSON
  });
});

// Define the route to get game records for a specific user, protected by the isAdmin middleware
app.get('/admin/game-records/:username', isAdmin, (req, res) => {
  const { username } = req.params;
  const query = 'SELECT * FROM game_records WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching game records');
      return;
    }
    res.json(results); // Return the fetched game records as JSON
  });
});

// Define the route to delete a user, protected by the isAdmin middleware
app.delete('/admin/delete-user/:username', isAdmin, (req, res) => {
  const { username } = req.params;
  const query = 'DELETE FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting user');
      return;
    }
    res.send('User deleted successfully'); // Send a success message
  });
});

// Start the server and listen for incoming connections on the specified port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});