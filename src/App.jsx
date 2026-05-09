import { useState, useEffect, useRef } from 'react';
import confetti from '@hiseb/confetti';
import './App.css';

const rowStyle = {
  display: 'flex',
};

const squareStyle = {
  width: '60px',
  height: '60px',
  backgroundColor: 'white',
  margin: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '28px',
  color: 'black',
  border: '2px solid black'
};

const boardStyle = {
  backgroundColor: 'white',
  width: '208px',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 20px 10px 20px'
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
};

const instructionsStyle = {
  marginTop: '5px',
  marginBottom: '5px',
  fontWeight: 'bold',
  fontSize: '24px',
};

const buttonStyle = {
  marginTop: '15px',
  marginBottom: '16px',
  width: '80px',
  height: '40px',
  backgroundColor: 'black',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  cursor: 'pointer',
};

function Square({ value, onClick, disabled }) {
  return (
    <div
      className="square"
      style={{
        ...squareStyle,
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: disabled && "#d8d8d8",
      }}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          onClick();
        }
      }}
      aria-disabled={disabled}
    >
      {value}
    </div>
  );
}

function Board({ board, isXNext, winner, onSquareClick, onReset }) {
  return (
    <div style={containerStyle} className="gameBoard">
      {!winner && (
        <div id="statusArea" className="status" style={instructionsStyle}>
          {isXNext ? 'Your turn' : 'Computer turn'}
        </div>
      )}
      {winner && (
        <div id="winnerArea" className="winner" style={instructionsStyle}>
          Winner: <span>{winner}</span>
        </div>
      )}
      <div style={boardStyle}>
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row" style={rowStyle}>
            {[0, 1, 2].map((col) => {
              const i = row * 3 + col;
              return (
                <Square
                  key={i}
                  value={board[i]}
                  onClick={() => onSquareClick(i)}
                  disabled={Boolean(winner) || Boolean(board[i]) || !isXNext}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button id="resetButton" style={buttonStyle} onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

function triggerWinConfetti() {
  const center = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 };

  confetti({ position: center, count: 120, size: 1, velocity: 200 });

  const positions = [
    { x: window.innerWidth * 0.25, y: window.innerHeight * 0.4 },
    { x: window.innerWidth * 0.75, y: window.innerHeight * 0.3 },
  ];

  positions.forEach((position, i) => {
    setTimeout(() => confetti({ position, count: 80, velocity: 180 }), i * 250);
  });
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const confettiFiredForRound = useRef(false);

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

    if (squares.every((square) => square !== null)) {
      return 'Draw';
    }

    return null;
  };

  useEffect(() => {
    if (winner === 'X' || winner === 'O') {
      if (!confettiFiredForRound.current) {
        confettiFiredForRound.current = true;
        triggerWinConfetti();
      }
    } else if (winner === null) {
      confettiFiredForRound.current = false;
    }
  }, [winner]);

  function getBestMove(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    // 1. Try to win
    for (const [a, b, c] of lines) {
      if (squares[a] === 'O' && squares[b] === 'O' && !squares[c]) return c;
      if (squares[a] === 'O' && squares[c] === 'O' && !squares[b]) return b;
      if (squares[b] === 'O' && squares[c] === 'O' && !squares[a]) return a;
    }

    // 2. Block X
    for (const [a, b, c] of lines) {
      if (squares[a] === 'X' && squares[b] === 'X' && !squares[c]) return c;
      if (squares[a] === 'X' && squares[c] === 'X' && !squares[b]) return b;
      if (squares[b] === 'X' && squares[c] === 'X' && !squares[a]) return a;
    }

    // 3. Center
    if (!squares[4]) return 4;

    // 4. Random available
    const available = squares.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    return -1;
  }

  const handleClick = (i) => {
    if (winner || board[i] || !isXNext) return;

    const newBoard = [...board];

    newBoard[i] = 'X';

    setBoard(newBoard);
    setIsXNext(false);

    const currentWinner = calculateWinner(newBoard);

    if (currentWinner) {
      setWinner(currentWinner);
    }
  };

  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const bestMove = getBestMove(newBoard);

        if (bestMove !== -1) {
          newBoard[bestMove] = 'O';

          setBoard(newBoard);
          setIsXNext(true);

          const currentWinner = calculateWinner(newBoard);

          if (currentWinner) {
            setWinner(currentWinner);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [board, isXNext, winner]);

  const resetGame = () => {
    // Required variable name in reset function
    const varFiltersCg = true;

    if (varFiltersCg) {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
    }
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          board={board}
          isXNext={isXNext}
          winner={winner}
          onSquareClick={handleClick}
          onReset={resetGame}
        />
      </div>
    </div>
  );
}

export default Game;
