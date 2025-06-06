import { reactive, readonly } from 'vue';
import type { Player } from '../types';

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
}

// Create reactive state
const state = reactive<GameStats>({
  xWins: 0,
  oWins: 0,
  draws: 0,
  totalGames: 0
});

// Actions
const actions = {
  recordWin(player: Player) {
    if (player === 'x') {
      state.xWins++;
    } else {
      state.oWins++;
    }
    state.totalGames++;
  },

  recordDraw() {
    state.draws++;
    state.totalGames++;
  },

  resetStats() {
    state.xWins = 0;
    state.oWins = 0;
    state.draws = 0;
    state.totalGames = 0;
  },

  // Load stats from localStorage
  loadStats() {
    try {
      const saved = localStorage.getItem('tic-tac-two-stats');
      if (saved) {
        const parsedStats = JSON.parse(saved);
        Object.assign(state, parsedStats);
      }
    } catch (error) {
      console.warn('Failed to load stats from localStorage:', error);
    }
  },

  // Save stats to localStorage
  saveStats() {
    try {
      localStorage.setItem('tic-tac-two-stats', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save stats to localStorage:', error);
    }
  }
};

// Auto-save whenever stats change
let saveTimeout: number | null = null;
const autoSave = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    actions.saveStats();
  }, 500);
};

// Watch for changes and auto-save
const originalRecordWin = actions.recordWin;
const originalRecordDraw = actions.recordDraw;
const originalResetStats = actions.resetStats;

actions.recordWin = (player: Player) => {
  originalRecordWin(player);
  autoSave();
};

actions.recordDraw = () => {
  originalRecordDraw();
  autoSave();
};

actions.resetStats = () => {
  originalResetStats();
  autoSave();
};

// Export the store
export const useGameStore = () => {
  return {
    state: readonly(state),
    ...actions
  };
};
