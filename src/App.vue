<template>
  <div class="intialBoard">
    <div class="game-info">
      <div class="win-counter">
        <span class="player-wins x-wins">X: {{ gameStore.state.xWins }}</span>
        <span class="draws">Draws: {{ gameStore.state.draws }}</span>
        <span class="player-wins o-wins">O: {{ gameStore.state.oWins }}</span>
      </div>

      <p>Current Player: {{ currentPlayerClass === 'x' ? 'X' : 'O' }}</p>
      <p v-if="!gameState.gridPlaced">Click to place the grid</p>
      <p v-else-if="gameState.piecesLeft > 4">
        Pieces left: {{ gameState.piecesLeft }}
      </p>
      <p v-else>
        Movement phase - Click your pieces to move them or use grid controls
      </p>
    </div>

    <GameBoard
      :board-cells="boardCells"
      :current-player="currentPlayerClass"
      @cell-click="handleCellClick"
    />

    <GameControls
      :move-directions="getMoveDirections()"
      :show-movement-controls="canShowMovementControls"
      @ai-move="makeAIMove"
      @grid-move="handleGridMove"
    />

    <WinningMessage
      :message="gameResult?.message || ''"
      :is-visible="showWinMessage"
      @restart="startGame"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import GameBoard from './components/GameBoard.vue';
import GameControls from './components/GameControls.vue';
import WinningMessage from './components/WinningMessage.vue';
import { useGame } from './composables/useGame';
import { useGameStore } from './store/gameStore';

const gameStore = useGameStore();

const {
  // State
  gameState,
  gameResult,
  showWinMessage,
  boardCells,

  // Computed
  currentPlayerClass,
  canShowMovementControls,

  // Methods
  startGame,
  handleCellClick,
  handleGridMove,
  makeAIMove,
  getMoveDirections
} = useGame();

onMounted(() => {
  gameStore.loadStats();
  startGame();
});
</script>

<style>
@import './assets/style.css';

.intialBoard {
  padding: 2rem;
}

.game-info {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.game-info p {
  margin: 0.5rem 0;
}

.win-counter {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
}

.player-wins {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  min-width: 60px;
}

.x-wins {
  background-color: #ff6b6b;
}

.o-wins {
  background-color: #4ecdc4;
}

.draws {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: #95a5a6;
  color: white;
  min-width: 80px;
}

@media (max-width: 600px) {
  .win-counter {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
