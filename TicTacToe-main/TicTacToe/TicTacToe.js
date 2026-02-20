import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [level, setLevel] = useState('easy');
  const winner = calculateWinner(board);
  const isBoardFull = board.every(square => square !== null);

  const handleClick = (index) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !winner && !isBoardFull) {
      const aiMove = getBestMove(board, level);
      if (aiMove !== null) {
        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
      }
    }
  }, [isXNext, winner, board, isBoardFull, level]);

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const handleLevelChange = (level) => {
    setLevel(level);
    handleReset();
  };

  const status = winner
    ? `Winner: ${winner}`
    : isBoardFull
      ? "It's a draw!"
      : `Next Player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="level-buttons">
        <button className="level-button" onClick={() => handleLevelChange('easy')}>Easy</button>
        <button className="level-button" onClick={() => handleLevelChange('medium')}>Medium</button>
        <button className="level-button" onClick={() => handleLevelChange('hard')}>Hard</button>
      </div>
      <div className="status">{status}</div>
      <div className="board">
        {board.map((value, index) => renderSquare(index))}
      </div>
      <button className="reset" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
};

const getBestMove = (board, level) => {
  if (level === 'easy') {
    return getRandomMove(board);
  } else if (level === 'medium') {
    return getMediumMove(board);
  } else {
    return minimax(board, true).index;
  }
};

const getRandomMove = (board) => {
  const emptySquares = board.reduce((acc, val, idx) => (val === null ? [...acc, idx] : acc), []);
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
};

const getMediumMove = (board) => {
  // 50% chance to make a random move, 50% chance to make the best move
  return Math.random() < 0.5 ? getRandomMove(board) : minimax(board, true).index;
};

const minimax = (board, isMaximizing) => {
  const emptySquares = board.reduce((acc, val, idx) => (val === null ? [...acc, idx] : acc), []);
  const winner = calculateWinner(board);
  if (winner === 'X') return { score: -10 };
  if (winner === 'O') return { score: 10 };
  if (emptySquares.length === 0) return { score: 0 };

  const bestMove = {
    score: isMaximizing ? -Infinity : Infinity,
    index: null
  };

  for (let i = 0; i < emptySquares.length; i++) {
    const idx = emptySquares[i];
    board[idx] = isMaximizing ? 'O' : 'X';
    const { score } = minimax(board, !isMaximizing);
    board[idx] = null;

    if (isMaximizing) {
      if (score > bestMove.score) {
        bestMove.score = score;
        bestMove.index = idx;
      }
    } else {
      if (score < bestMove.score) {
        bestMove.score = score;
        bestMove.index = idx;
      }
    }
  }

  return bestMove;
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default TicTacToe;
