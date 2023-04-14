// document.getElementById('login-form').addEventListener('submit', (e) => {
//   e.preventDefault();

//   const formData = new FormData(e.target);
//   const username = formData.get('username');
//   const password = formData.get('password');

//   fetch('/login', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//   })
//       .then((response) => response.json())
//       .then((data) => {
//           if (data.redirectTo) {
//               window.location.href = data.redirectTo;
//           } else {
//               // Show error message
//               alert(data.message);
//           }
//       })
//       .catch((error) => {
//           console.error('Error:', error);
//       });
// });

const gameBoard = document.getElementById('game-board');
const currentPlayerDisplay = document.getElementById('current-player');
const startTimeDisplay = document.getElementById('start-time');
const elapsedTimeDisplay = document.getElementById('elapsed-time');
const socket = io();
const boardSize = 19;
const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

let currentPlayer = 'black';

// Render the initial game board
for (let row = 0; row < boardSize; row++) {
  for (let col = 0; col < boardSize; col++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
  }
}

function renderBoard(board) {
  const cells = gameBoard.children;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = cells[row * boardSize + col];
      const cellValue = board[row][col];

      if (cellValue === 'black') {
        cell.dataset.piece = 'black';
      } else if (cellValue === 'white') {
        cell.dataset.piece = 'white';
      } else {
        cell.dataset.piece = '';
      }
    }
  }
}

function joinGame(username, gameId) {
  socket.emit('joinGame', { username, gameId });
}

socket.on('playerJoined', (data) => {
  console.log(`Player ${data.username} joined the game`);
  // Update the UI or game state with the new player's information
  const playerNumber = data.playerNumber;
  const playerNames = document.getElementById('player-names');
  playerNames.textContent = `Player ${playerNumber}: ${data.username} ${playerNames.textContent}`;
});

function makeMove(username, gameId, move) {
  socket.emit('move', { username, gameId, move });
}

socket.on('playerMove', (data) => {
  console.log(`Player ${data.username} made a move`);
  // Update the UI or game state with the new move
  const { row, col, color } = data.move;
  board[row][col] = color;
  renderBoard(board);

  if (checkWin(row, col)) {
    alert(`Player ${currentPlayer === 'black' ? 1 : 2} (${currentPlayer}) wins!`);
  } else {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    currentPlayerDisplay.textContent = `Current Player: Player ${currentPlayer === 'black' ? 1 : 2} (${currentPlayer})`;
  }
});

function updateGame(gameId, newState) {
  socket.emit('gameUpdate', { gameId, newState });
}

socket.on('gameStateChanged', (data) => {
  console.log(`Game ${data.gameId} updated`);
  // Update the UI or game state with the new game state
  board = data.newState.board;
  currentPlayer = data.newState.currentPlayer;
  renderBoard(board);
  currentPlayerDisplay.textContent = `Current Player: Player ${currentPlayer === 'black' ? 1 : 2} (${currentPlayer})`;
});

// Start the game timer
const startTime = new Date();
startTimeDisplay.textContent = `Start Time: ${startTime.toLocaleTimeString()}`;
setInterval(() => {
  const elapsedTime = Math.floor((new Date() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  elapsedTimeDisplay.textContent = `Elapsed Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}, 1000);

function handleCellClick(event) {
  const row = parseInt(event.currentTarget.dataset.row, 10);
  const col = parseInt(event.currentTarget.dataset.col, 10);

  if (board[row][col] !== null) {
    alert('This cell is already occupied!');
    return;
  }

  board[row][col] = currentPlayer;
  renderBoard(board);

  makeMove(username, gameId, { row, col, color: currentPlayer });

  if (checkWin(row, col)) {
    alert(`Player ${currentPlayer === 'black' ? 1 : 2} (${currentPlayer}) wins!`);
  } else {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    currentPlayerDisplay.textContent = `Current Player: Player ${currentPlayer === 'black' ? 1 : 2} (${currentPlayer})`;
  }
}

function checkWin(row, col) {
    const directions = [
      { dr: -1, dc: 0 }, // up
      { dr: 1, dc: 0 }, // down
      { dr: 0, dc: -1 }, // left
      { dr: 0, dc: 1 }, // right
      { dr: -1, dc: -1 }, // up-left
      { dr: -1, dc: 1 }, // up-right
      { dr: 1, dc: -1 }, // down-left
      { dr: 1, dc: 1 } // down-right
    ];
  
    const color = board[row][col];
  
    for (const { dr, dc } of directions) {
      let count = 1;
      for (let i = 1; i <= 4; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
  
        if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
          break;
        }
  
        if (board[newRow][newCol] === color) {
          count++;
        } else {
          break;
        }
      }
  
      for (let i = 1; i <= 4; i++) {
        const newRow = row - dr * i;
        const newCol = col - dc * i;
  
        if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
          break;
        }
  
        if (board[newRow][newCol] === color) {
          count++;
        } else {
          break;
        }
      }
  
      if (count >= 5) {
        return true;
      }
    }
  
    return false;
  }
  

