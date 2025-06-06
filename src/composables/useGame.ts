import { ref, computed, reactive, readonly, nextTick } from 'vue';
import { GameModel } from '../models/GameModel';
import { useGameStore } from '../store/gameStore';
import {
  X_CLASS,
  CIRCLE_CLASS,
  BOARD_SIZE
} from '../types';
import type {
  Player,
  MoveDirection,
  CellData,
  GameResult
} from '../types';

export function useGame() {
  const model = new GameModel();
  const gameStore = useGameStore();

  // Reactive state
  const gameState = ref(model.getState());
  const gameResult = ref<GameResult | null>(null);
  const showWinMessage = ref(false);

  // Create reactive board data
  const boardCells = reactive<CellData[]>([]);

  // Initialize board
  const initializeBoard = () => {
    boardCells.splice(0, boardCells.length);
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const row = Math.floor(i / BOARD_SIZE);
      const col = i % BOARD_SIZE;
      boardCells.push({
        index: i,
        row,
        col,
        hasX: false,
        hasO: false,
        isGrid: false
      });
    }
  };

  // Computed properties
  const currentPlayerClass = computed(() => {
    return gameState.value.circleTurn ? CIRCLE_CLASS : X_CLASS;
  });
  const canShowMovementControls = computed(() => gameState.value.piecesLeft <= 4);
  const isInMovementPhase = computed(() => model.isInMovementPhase());

  // Initialize game
  const startGame = () => {
    model.resetState();
    gameState.value = model.getState();
    gameResult.value = null;
    showWinMessage.value = false;
    initializeBoard();
  };

  // Handle cell click
  const handleCellClick = (cellIndex: number) => {
    const cell = boardCells[cellIndex];

    if (!gameState.value.gridPlaced) {
      handleGridPlacement(cell);
    } else {
      handlePiecePlacement(cell);
    }

    gameState.value = model.getState();
  };

  // Handle grid placement
  const handleGridPlacement = (cell: CellData) => {
    if (model.setGridPosition(cell.row, cell.col)) {
      updateGridDisplay();
      console.log(`✅ Grid placed at row ${cell.row}, col ${cell.col}`);
    } else {
      console.log("❌ Invalid grid placement");
    }
  };

  // Handle piece placement or movement
  const handlePiecePlacement = async (cell: CellData) => {
    const currentClass = model.getCurrentPlayerClass();

    // Check if cell already has a piece
    if (cell.hasX || cell.hasO) {
      if (gameState.value.piecesLeft <= 4) {
        // Movement phase - pick up own piece
        const isOwnPiece = (currentClass === X_CLASS && cell.hasX) ||
                          (currentClass === CIRCLE_CLASS && cell.hasO);
        if (isOwnPiece) {
          cell.hasX = false;
          cell.hasO = false;
          model.increasePiecesLeft();
        }
        // Swap turns after movement attempt
        model.swapTurns();
        gameState.value = model.getState();
        await nextTick();
        return;
      }
      // Can't place on occupied cell in placement phase - just swap turns
      model.swapTurns();
      gameState.value = model.getState();
      await nextTick();
      return;
    }

    // Place new piece if we have pieces left
    if (gameState.value.piecesLeft === 0) return;

    if (currentClass === X_CLASS) {
      cell.hasX = true;
    } else {
      cell.hasO = true;
    }

    model.decreasePiecesLeft();

    // Check for game end before swapping turns
    if (!checkGameEnd()) {
      model.swapTurns();
      gameState.value = model.getState();
      await nextTick();
    }
  };

  // Handle grid movement
  const handleGridMove = (direction: MoveDirection) => {
    if (!gameState.value.gridPlaced) return;

    if (model.moveGrid(direction)) {
      updateGridDisplay();

      // Check for game end before swapping turns
      if (!checkGameEnd()) {
        model.swapTurns();
        gameState.value = model.getState();
      }

      console.log(`✅ Grid moved to new position`);
    } else {
      console.log("❌ Cannot move outside the board");
    }
  };

  // Update grid display
  const updateGridDisplay = () => {
    // Clear all grid markers
    boardCells.forEach(cell => {
      cell.isGrid = false;
    });

    // Set new grid markers
    const gridIndexes = model.getGridCellIndexes();
    gridIndexes.forEach(index => {
      if (boardCells[index]) {
        boardCells[index].isGrid = true;
      }
    });
  };

  // Check game end
  const checkGameEnd = (): boolean => {
    const xWins = model.checkWin(X_CLASS, boardCells);
    const oWins = model.checkWin(CIRCLE_CLASS, boardCells);

    if (xWins) {
      endGame(false, X_CLASS);
      return true;
    } else if (oWins) {
      endGame(false, CIRCLE_CLASS);
      return true;
    } else if (model.isDraw()) {
      endGame(true);
      return true;
    }

    return false;
  };

  // End game
  const endGame = (draw: boolean, winnerClass: Player | null = null) => {
    if (draw) {
      gameResult.value = {
        winner: null,
        isDraw: true,
        message: "Draw! No more pieces left."
      };
      gameStore.recordDraw();
    } else {
      const winner = winnerClass === CIRCLE_CLASS ? "O" : "X";
      gameResult.value = {
        winner: winnerClass,
        isDraw: false,
        message: `${winner} Wins!`
      };
      gameStore.recordWin(winnerClass!);
    }
    showWinMessage.value = true;
  };

  // AI Move
  const makeAIMove = () => {
    if (!gameState.value.gridPlaced || gameState.value.piecesLeft === 0) return;

    const currentClass = model.getCurrentPlayerClass();
    const gridIndexes = model.getGridCellIndexes();

    // Filter for valid grid cells (inside grid and unoccupied)
    const validCells = gridIndexes.filter(index => {
      const cell = boardCells[index];
      return !cell.hasX && !cell.hasO;
    });

    if (validCells.length === 0) return;

    // Check for winning moves
    let bestMoveIndex: number | null = null;

    for (const cellIndex of validCells) {
      const cell = boardCells[cellIndex];
      // Temporarily place piece
      if (currentClass === X_CLASS) {
        cell.hasX = true;
      } else {
        cell.hasO = true;
      }

      if (model.checkWin(currentClass, boardCells)) {
        bestMoveIndex = cellIndex;
        // Remove temporary piece
        cell.hasX = false;
        cell.hasO = false;
        break;
      }

      // Remove temporary piece
      cell.hasX = false;
      cell.hasO = false;
    }

    // Random move if no winning move
    if (bestMoveIndex === null) {
      bestMoveIndex = validCells[Math.floor(Math.random() * validCells.length)];
    }

    // Make the move
    if (bestMoveIndex !== null) {
      handlePiecePlacement(boardCells[bestMoveIndex]);
    }
  };

  // Get move directions
  const getMoveDirections = () => model.MOVE_DIRECTIONS;

  // Initialize on first load
  initializeBoard();

  return {
    // State
    gameState: readonly(gameState),
    gameResult,
    showWinMessage,
    boardCells,

    // Computed
    currentPlayerClass,
    canShowMovementControls,
    isInMovementPhase,

    // Methods
    startGame,
    handleCellClick,
    handleGridMove,
    makeAIMove,
    getMoveDirections
  };
}
