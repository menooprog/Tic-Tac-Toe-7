const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let computer = "O";
let running = true;

// Add event listeners
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => userMove(index));
});
resetBtn.addEventListener("click", resetGame);

function userMove(index) {
  if (!running || cells[index].textContent !== "") return;

  cells[index].textContent = currentPlayer;
  finalizeTurn();

  if (running) {
    setTimeout(aiMove, 500); // small delay for natural feel
  }
}

function aiMove() {
  const boardState = getBoard();

  // 50% chance smart move, 50% random move
  if (Math.random() < 0.5) {
    // Smart move using minimax
    const [, move] = minimax(boardState, true);
    if (move !== null) {
      cells[move].textContent = computer;
    }
  } else {
    // Random move
    const available = emptyCells(boardState);
    if (available.length > 0) {
      const move = available[Math.floor(Math.random() * available.length)];
      cells[move].textContent = computer;
    }
  }
  finalizeTurn();
}

function finalizeTurn() {
  const winner = checkWinner();

  if (winner) {
    statusText.textContent = winner === "Draw" ? "It's a Draw!" : `${winner} Wins! 🎉`;
    running = false;
  }
}

function getBoard() {
  return Array.from(cells).map(cell => cell.textContent || "");
}

function emptyCells(board) {
  return board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
}

function checkWinner() {
  const board = getBoard();
  const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== "")) {
    return "Draw";
  }
  return null;
}

// Minimax for smart AI
function minimax(board, isMaximizing) {
  const winner = checkWinnerForMinimax(board);
  if (winner === computer) return [1, null];
  if (winner === currentPlayer) return [-1, null];
  if (board.every(cell => cell !== "")) return [0, null];

  if (isMaximizing) {
    let bestScore = -Infinity, bestMove = null;
    for (let move of emptyCells(board)) {
      board[move] = computer;
      let [score] = minimax(board, false);
      board[move] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return [bestScore, bestMove];
  } else {
    let bestScore = Infinity, bestMove = null;
    for (let move of emptyCells(board)) {
      board[move] = currentPlayer;
      let [score] = minimax(board, true);
      board[move] = "";
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return [bestScore, bestMove];
  }
}

function checkWinnerForMinimax(board) {
  const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function resetGame() {
  cells.forEach(cell => (cell.textContent = ""));
  statusText.textContent = "Your turn (X)";
  running = true;
}