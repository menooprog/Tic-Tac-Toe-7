const board = document.getElementById("board");
const resetBtn = document.getElementById("reset");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const tiesEl = document.getElementById("ties");

let cells = [];
let gameOver = false;
let player = "X";
let computer = "O";
let playerScore = 0, computerScore = 0, ties = 0;

// --- Create board ---
function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => playerMove(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}
createBoard();

// --- Helpers ---
function getBoard() {
  return cells.map(c => c.textContent);
}

function emptyCells(boardState) {
  return boardState.map((val, i) => val === "" ? i : null).filter(v => v !== null);
}

function winner(boardState) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of wins) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}

function isFull(boardState) {
  return boardState.every(c => c !== "");
}

// --- Minimax ---
function minimax(boardState, maximizing) {
  const win = winner(boardState);
  if (win === computer) return [1];
  if (win === player) return [-1];
  if (isFull(boardState)) return [0];

  let bestMove = null;

  if (maximizing) {
    let bestScore = -2;
    for (let idx of emptyCells(boardState)) {
      boardState[idx] = computer;
      let [score] = minimax(boardState, false);
      boardState[idx] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
    return [bestScore, bestMove];
  } else {
    let bestScore = 2;
    for (let idx of emptyCells(boardState)) {
      boardState[idx] = player;
      let [score] = minimax(boardState, true);
      boardState[idx] = "";
      if (score < bestScore) {
        bestScore = score;
        bestMove = idx;
      }
    }
    return [bestScore, bestMove];
  }
}

// --- Gameplay ---
function playerMove(index) {
  if (gameOver || cells[index].textContent !== "") return;
  cells[index].textContent = player;
  finalizeTurn();
  if (!gameOver) setTimeout(aiMove, 300);
}

function aiMove() {
  const boardState = getBoard();
  const [, move] = minimax(boardState, true);
  if (move !== null) {
    cells[move].textContent = computer;
  }
  finalizeTurn();
}

function finalizeTurn() {
  const boardState = getBoard();
  const win = winner(boardState);
  if (win) {
    gameOver = true;
    if (win === player) {
      playerScore++;
      alert("You win! 🎉\nPlay again?");
    } else {
      computerScore++;
      alert("Computer wins! 🤖\nPlay again?");
    }
    updateScore();
    createBoard();
    gameOver = false;
    return;
  }
  if (isFull(boardState)) {
    gameOver = true;
    ties++;
    alert("It's a tie! 🤝\nPlay again?");
    updateScore();
    createBoard();
    gameOver = false;
  }
}

function resetGame() {
  createBoard();
  gameOver = false;
}

function updateScore() {
  playerScoreEl.textContent = `Player: ${playerScore}`;
  computerScoreEl.textContent = `Computer: ${computerScore}`;
  tiesEl.textContent = `Ties: ${ties}`;
}

resetBtn.addEventListener("click", resetGame);