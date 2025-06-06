import {
  X_CLASS,
  CIRCLE_CLASS,
  BOARD_SIZE,
  GRID_SIZE
} from '../types/';
import type {
  Player,
  MoveDirection,
  GameState,
  WinningCombination,
  CellData
} from '../types/';

export class GameModel {
  private state: GameState = {
    circleTurn: false,
    gridPlaced: false,
    piecesLeft: 8,
    gridPosition: null
  };

  private readonly WINNING_COMBINATIONS: WinningCombination[] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  readonly MOVE_DIRECTIONS: MoveDirection[] = [
    { row: -1, col: -1 }, // ↖ Diagonal Up-Left
    { row: -1, col: 0 },  // ↑ Up
    { row: -1, col: 1 },  // ↗ Diagonal Up-Right
    { row: 0, col: -1 },  // ← Left
    { row: 0, col: 0 },   // ✖ No movement (center button)
    { row: 0, col: 1 },   // → Right
    { row: 1, col: -1 },  // ↙ Diagonal Down-Left
    { row: 1, col: 0 },   // ↓ Down
    { row: 1, col: 1 }    // ↘ Diagonal Down-Right
  ];

  constructor() {}

  /**
   * Reset the game state
   */
  resetState(): void {
    this.state = {
      circleTurn: false,
      gridPlaced: false,
      piecesLeft: 8,
      gridPosition: null
    };
  }

  /**
   * Get the current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Set grid position
   */
  setGridPosition(row: number, col: number): boolean {
    if (this.isValidGridPlacement(row, col)) {
      this.state.gridPosition = { row, col };
      this.state.gridPlaced = true;
      return true;
    }
    return false;
  }

  /**
   * Move grid to new position
   */
  moveGrid(direction: MoveDirection): boolean {
    if (!this.state.gridPlaced || !this.state.gridPosition) return false;

    const newRow = this.state.gridPosition.row + direction.row;
    const newCol = this.state.gridPosition.col + direction.col;

    if (this.isValidGridPlacement(newRow, newCol)) {
      this.state.gridPosition = { row: newRow, col: newCol };
      return true;
    }
    return false;
  }

  /**
   * Check if grid placement is valid
   */
  isValidGridPlacement(row: number, col: number): boolean {
    return row >= 0 && col >= 0 && row <= BOARD_SIZE - GRID_SIZE && col <= BOARD_SIZE - GRID_SIZE;
  }

  /**
   * Swap turns between players
   */
  swapTurns(): void {
    this.state.circleTurn = !this.state.circleTurn;
  }

  /**
   * Get current player class
   */
  getCurrentPlayerClass(): Player {
    return this.state.circleTurn ? CIRCLE_CLASS : X_CLASS;
  }

  /**
   * Decrease pieces left
   */
  decreasePiecesLeft(): void {
    if (this.state.piecesLeft > 0) {
      this.state.piecesLeft--;
    }
  }

  /**
   * Increase pieces left
   */
  increasePiecesLeft(): void {
    if (this.state.piecesLeft < 8) {
      this.state.piecesLeft++;
    }
  }

  /**
   * Generate grid cell indexes based on current grid position
   */
  getGridCellIndexes(): number[] {
    if (!this.state.gridPosition) return [];

    const indexes: number[] = [];
    const { row, col } = this.state.gridPosition;

    for (let r = row; r < row + GRID_SIZE; r++) {
      for (let c = col; c < col + GRID_SIZE; c++) {
        indexes.push(r * BOARD_SIZE + c);
      }
    }

    return indexes;
  }

  /**
   * Check if the current configuration is a win for the specified player
   */
  checkWin(playerClass: Player, cellsData: CellData[]): boolean {
    const gridIndexes = this.getGridCellIndexes();
    const localGridIndexes: number[] = [];

    gridIndexes.forEach((globalIndex, localIndex) => {
      const cell = cellsData[globalIndex];
      const hasPlayerPiece = playerClass === X_CLASS ? cell.hasX : cell.hasO;
      if (hasPlayerPiece) {
        localGridIndexes.push(localIndex);
      }
    });

    return this.WINNING_COMBINATIONS.some(combination =>
      combination.every(index => localGridIndexes.includes(index))
    );
  }

  /**
   * Check if the game is a draw
   */
  isDraw(): boolean {
    return this.state.piecesLeft === 0;
  }

  /**
   * Check if we're in the movement phase (after placing initial pieces)
   */
  isInMovementPhase(): boolean {
    return this.state.piecesLeft <= 4;
  }
}
