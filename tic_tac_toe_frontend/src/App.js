import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette as JS variables for use in inline styles as needed
const PALETTE = {
  accent: "#fbc02d",
  primary: "#1976d2",
  secondary: "#424242",
};

function getInitialBoard() {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));
}

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(getInitialBoard());
  const [isXNext, setIsXNext] = useState(true); // true: X, false: O
  const [status, setStatus] = useState("ongoing"); // 'ongoing', 'win', 'draw'
  const [winner, setWinner] = useState(null);

  // PUBLIC_INTERFACE
  function handleCellClick(row, col) {
    if (board[row][col] || status !== "ongoing") return; // Ignore if filled or game over

    const nextBoard = board.map((r, i) => (i === row ? [...r] : r.slice()));
    nextBoard[row][col] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(getInitialBoard());
    setIsXNext(true);
    setStatus("ongoing");
    setWinner(null);
  }

  // Calculate winner or draw after board changes
  useEffect(() => {
    const result = checkGameStatus(board);
    if (result.winner) {
      setStatus("win");
      setWinner(result.winner);
    } else if (result.draw) {
      setStatus("draw");
      setWinner(null);
    } else {
      setStatus("ongoing");
      setWinner(null);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function renderStatusBanner() {
    let message = "";
    if (status === "win" && winner) message = `Player ${winner} wins! 🎉`;
    else if (status === "draw") message = "It's a draw!";
    else message = `Next turn: ${isXNext ? "X" : "O"}`;
    return (
      <div className="ttt-status-banner" data-status={status}>
        {message}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderCell(row, col) {
    const value = board[row][col];
    let style = {};
    if (value === "X") {
      style = { color: PALETTE.primary };
    } else if (value === "O") {
      style = { color: PALETTE.accent };
    }
    return (
      <button
        key={col}
        className="ttt-cell"
        style={style}
        onClick={() => handleCellClick(row, col)}
        aria-label={`${
          value || "Empty"
        } cell (${row + 1}, ${col + 1})`}
        disabled={!!value || status !== "ongoing"}
      >
        {value}
      </button>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    return (
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe game board">
        {board.map((row, rIdx) => (
          <div className="ttt-board-row" key={rIdx} role="row">
            {row.map((_, cIdx) => renderCell(rIdx, cIdx))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="App" style={{ minHeight: "100vh", background: "#fff" }}>
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
      </header>
      <main className="ttt-main">
        {renderStatusBanner()}
        {renderBoard()}
        <div className="ttt-controls">
          <button className="ttt-reset-btn" onClick={resetGame} aria-label="Restart game">
            Reset Game
          </button>
        </div>
      </main>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="ttt-footer-link"
          >
            Built with React
          </a>
        </span>
      </footer>
    </div>
  );
}

// --- Game logic helpers ---

// PUBLIC_INTERFACE
function checkGameStatus(board) {
  // Returns {winner: "X"|"O"|null, draw: bool}
  // Rows, Cols, Diagonals
  const lines = [];
  for (let i = 0; i < 3; i++) {
    lines.push(board[i]); // rows
    lines.push([board[0][i], board[1][i], board[2][i]]); // cols
  }
  // diagonals
  lines.push([board[0][0], board[1][1], board[2][2]]);
  lines.push([board[0][2], board[1][1], board[2][0]]);
  for (const line of lines) {
    if (line[0] && line[0] === line[1] && line[1] === line[2]) {
      return { winner: line[0], draw: false };
    }
  }
  // If all cells filled and no winner, it's a draw
  const isDraw = board.flat().every((cell) => cell);
  return { winner: null, draw: isDraw };
}

export default App;
