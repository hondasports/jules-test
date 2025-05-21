// Defines the shapes and colors for all standard Tetrominoes.
const TETROMINOES = {
  0: { shape: [[[0]]], color: 'rgb(50, 50, 50)' }, // Empty cell
  I: {
    shape: [
      [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
      [[0,1,0,0], [0,1,0,0], [0,1,0,0], [0,1,0,0]]
    ], color: 'rgb(0, 255, 255)'
  },
  J: {
    shape: [
      [[1,0,0], [1,1,1], [0,0,0]],
      [[0,1,1], [0,1,0], [0,1,0]],
      [[0,0,0], [1,1,1], [0,0,1]],
      [[0,1,0], [0,1,0], [1,1,0]]
    ], color: 'rgb(0, 0, 255)'
  },
  L: {
    shape: [
      [[0,0,1], [1,1,1], [0,0,0]],
      [[0,1,0], [0,1,0], [0,1,1]],
      [[0,0,0], [1,1,1], [1,0,0]],
      [[1,1,0], [0,1,0], [0,1,0]]
    ], color: 'rgb(255, 165, 0)'
  },
  O: {
    shape: [[[1,1], [1,1]]], color: 'rgb(255, 255, 0)'
  },
  S: {
    shape: [
      [[0,1,1], [1,1,0], [0,0,0]],
      [[0,1,0], [0,1,1], [0,0,1]]
    ], color: 'rgb(0, 255, 0)'
  },
  T: {
    shape: [
      [[0,1,0], [1,1,1], [0,0,0]],
      [[0,1,0], [0,1,1], [0,1,0]],
      [[0,0,0], [1,1,1], [0,1,0]],
      [[0,1,0], [1,1,0], [0,1,0]]
    ], color: 'rgb(128, 0, 128)'
  },
  Z: {
    shape: [
      [[1,1,0], [0,1,1], [0,0,0]],
      [[0,0,1], [0,1,1], [0,1,0]]
    ], color: 'rgb(255, 0, 0)'
  }
};

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 10;
const EMPTY_CELL_COLOR = TETROMINOES[0].color;
const INITIAL_GAME_SPEED = 500; // ms for level 1
const GAME_SPEED_SOFT_DROP = 50; // ms for soft drop
const LINES_PER_LEVEL = 10; // Lines to clear to advance to the next level

// Points for clearing lines
const LINE_POINTS = {
  1: 40,
  2: 100,
  3: 300,
  4: 1200
};


function Cell(props) {
  return React.createElement('div', {
    className: 'cell',
    style: { backgroundColor: props.color, width: '100%', height: '100%' }
  });
}

function Board(props) {
  const displayBoard = props.boardState.map(row => row.slice());

  if (props.currentTetromino) {
    const shape = props.currentTetromino.shape[props.currentRotation];
    shape.forEach((row, r) => {
      row.forEach((cellValue, c) => {
        if (cellValue === 1) {
          const boardRow = props.currentPosition.row + r;
          const boardCol = props.currentPosition.col + c;
          if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
            displayBoard[boardRow][boardCol] = props.currentTetromino.color;
          }
        }
      });
    });
  }

  const boardRows = displayBoard.map((row, rowIndex) => {
    const rowCells = row.map((cellColor, colIndex) => {
      return React.createElement(Cell, {
        key: `cell-${rowIndex}-${colIndex}`,
        color: cellColor,
      });
    });
    return React.createElement('div', { key: `row-${rowIndex}`, style: { display: 'contents' } }, rowCells);
  });

  return React.createElement('div', {
    className: 'tetris-board',
    style: {
      display: 'grid',
      gridTemplateRows: `repeat(${BOARD_HEIGHT}, calc(min(4vh, 20px)))`,
      gridTemplateColumns: `repeat(${BOARD_WIDTH}, calc(min(4vh, 20px)))`,
    }
  }, boardRows);
}

function TetrisGame() {
  const initialBoard = React.useCallback(() => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(EMPTY_CELL_COLOR)), []);
  const [boardState, setBoardState] = React.useState(initialBoard);
  
  const [currentTetromino, setCurrentTetromino] = React.useState(null);
  const [currentPosition, setCurrentPosition] = React.useState({ row: 0, col: 0 });
  const [currentRotation, setCurrentRotation] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  
  const [score, setScore] = React.useState(0);
  const [linesClearedTotal, setLinesClearedTotal] = React.useState(0);
  const [level, setLevel] = React.useState(1);
  
  // Game speed state, will be updated based on level
  const [currentDropSpeed, setCurrentDropSpeed] = React.useState(INITIAL_GAME_SPEED);
  // Temporary speed for soft drop, distinct from level-based speed
  const [softDropSpeed, setSoftDropSpeed] = React.useState(null);


  const randomTetromino = React.useCallback(() => {
    const tetrominoKeys = 'IJLOSTZ';
    const randKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    return TETROMINOES[randKey];
  }, []);

  const resetPlayer = React.useCallback(() => {
    const newTetromino = randomTetromino();
    setCurrentTetromino(newTetromino);
    const initialCol = Math.floor(BOARD_WIDTH / 2) - Math.floor(newTetromino.shape[0][0].length / 2);
    setCurrentPosition({ row: 0, col: initialCol });
    setCurrentRotation(0);
    return { tetromino: newTetromino, position: {row: 0, col: initialCol}, rotation: 0 };
  }, [randomTetromino]);
  
  const checkCollision = React.useCallback((tetromino, position, rotation, board) => {
    if (!tetromino) return false;
    const shape = tetromino.shape[rotation % tetromino.shape.length];
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const boardRow = position.row + r;
          const boardCol = position.col + c;
          if (boardRow >= BOARD_HEIGHT || boardCol < 0 || boardCol >= BOARD_WIDTH || (boardRow >=0 && board[boardRow][boardCol] !== EMPTY_CELL_COLOR)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const mergePieceToBoardPure = (board, piece, position, rotation) => {
    const newBoard = board.map(row => row.slice());
    if (!piece) return newBoard;
    const shape = piece.shape[rotation % piece.shape.length];
    shape.forEach((row, r) => {
      row.forEach((cellValue, c) => {
        if (cellValue === 1) {
          const boardRow = position.row + r;
          const boardCol = position.col + c;
          if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
            newBoard[boardRow][boardCol] = piece.color;
          }
        }
      });
    });
    return newBoard;
  };
  
  const clearLinesAndUpdateScore = (boardToClear) => {
    let linesClearedCount = 0;
    let newBoard = boardToClear.map(row => row.slice());

    for (let r = newBoard.length - 1; r >= 0; r--) {
      const isRowFull = newBoard[r].every(cellColor => cellColor !== EMPTY_CELL_COLOR);
      if (isRowFull) {
        linesClearedCount++;
        newBoard.splice(r, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL_COLOR));
        r++;
      }
    }
    
    if (linesClearedCount > 0) {
      const points = (LINE_POINTS[linesClearedCount] || 0) * level;
      setScore(prevScore => prevScore + points);
      
      const newTotalLines = linesClearedTotal + linesClearedCount;
      setLinesClearedTotal(newTotalLines);

      // Leveling logic
      const newLevel = Math.floor(newTotalLines / LINES_PER_LEVEL) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        // Update game speed based on new level
        setCurrentDropSpeed(Math.max(100, INITIAL_GAME_SPEED - (newLevel - 1) * 50)); // Example speed increase
        // console.log(`Level Up! New Level: ${newLevel}, New Speed: ${Math.max(100, INITIAL_GAME_SPEED - (newLevel - 1) * 50)}`);
      }
    }
    return { board: newBoard, linesCleared: linesClearedCount };
  };


  // Game Loop (Gravity)
  React.useEffect(() => {
    if (gameOver) return;
    if (!currentTetromino) {
        const {tetromino: newPiece, position: newPos, rotation: newRot} = resetPlayer();
        if (checkCollision(newPiece, newPos, newRot, boardState)) {
             setGameOver(true);
        }
        return;
    }

    const effectiveSpeed = softDropSpeed !== null ? softDropSpeed : currentDropSpeed;

    const intervalId = setInterval(() => {
      if (!checkCollision(currentTetromino, { row: currentPosition.row + 1, col: currentPosition.col }, currentRotation, boardState)) {
        setCurrentPosition(prevPos => ({ ...prevPos, row: prevPos.row + 1 }));
      } else {
        const boardWithMergedPiece = mergePieceToBoardPure(boardState, currentTetromino, currentPosition, currentRotation);
        const { board: boardAfterClearing } = clearLinesAndUpdateScore(boardWithMergedPiece); // Score/level updated here
        
        setBoardState(boardAfterClearing);
        
        const {tetromino: newPiece, position: newPos, rotation: newRot} = resetPlayer();
        if (checkCollision(newPiece, newPos, newRot, boardAfterClearing)) {
          setGameOver(true);
          clearInterval(intervalId);
        }
      }
    }, effectiveSpeed);

    return () => clearInterval(intervalId);
  }, [currentTetromino, currentPosition, currentRotation, boardState, gameOver, resetPlayer, checkCollision, currentDropSpeed, softDropSpeed, level]);


  // User Input Handling
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver || !currentTetromino) return;

      let newPos = { ...currentPosition };
      let newRotation = currentRotation;

      switch (event.key) {
        case 'ArrowLeft':
          newPos.col -= 1;
          if (!checkCollision(currentTetromino, newPos, newRotation, boardState)) {
            setCurrentPosition(newPos);
          }
          break;
        case 'ArrowRight':
          newPos.col += 1;
          if (!checkCollision(currentTetromino, newPos, newRotation, boardState)) {
            setCurrentPosition(newPos);
          }
          break;
        case 'ArrowDown':
          setSoftDropSpeed(GAME_SPEED_SOFT_DROP);
          break;
        case 'ArrowUp': 
        case ' ': 
          event.preventDefault(); 
          newRotation = (currentRotation + 1) % currentTetromino.shape.length;
          const wallKicks = [0, 1, -1, 2, -2];
          for (let kick of wallKicks) {
            newPos = { row: currentPosition.row, col: currentPosition.col + kick };
            if (!checkCollision(currentTetromino, newPos, newRotation, boardState)) {
              setCurrentPosition(newPos);
              setCurrentRotation(newRotation);
              break;
            }
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
        if (event.key === 'ArrowDown') {
            setSoftDropSpeed(null); // Revert to level-based speed
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, currentTetromino, currentPosition, currentRotation, boardState, checkCollision, level]);


  let statusDisplay = `Score: ${score} | Level: ${level} | Lines: ${linesClearedTotal}`;
  if (gameOver) {
    statusDisplay = `Game Over! Score: ${score} | Level: ${level} | Lines: ${linesClearedTotal}`;
  }
  
  return React.createElement('div', { className: 'game', tabIndex: '0' },
    React.createElement('div', { className: 'game-board-container' },
      React.createElement(Board, {
        boardState: boardState,
        currentTetromino: currentTetromino,
        currentPosition: currentPosition,
        currentRotation: currentRotation,
      })
    ),
    React.createElement('div', { className: 'game-info' },
      React.createElement('div', { className: 'status' }, statusDisplay)
    )
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(TetrisGame));
