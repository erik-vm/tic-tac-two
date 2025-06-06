// Define game constants
export const X_CLASS = "x";
export const CIRCLE_CLASS = "circle";
export const GRID_CLASS = "grid";
export const BOARD_SIZE = 5;
export const GRID_SIZE = 3;

// Define types
export type Player = typeof X_CLASS | typeof CIRCLE_CLASS;

export interface Position {
  row: number;
  col: number;
}

export interface MoveDirection {
  row: number;
  col: number;
}

export interface GameState {
  circleTurn: boolean;
  gridPlaced: boolean;
  piecesLeft: number;
  gridPosition: Position | null;
}

export type WinningCombination = number[];

// Vue-specific types
export interface CellData {
  index: number;
  row: number;
  col: number;
  hasX: boolean;
  hasO: boolean;
  isGrid: boolean;
}

export interface GameResult {
  winner: Player | null;
  isDraw: boolean;
  message: string;
}
