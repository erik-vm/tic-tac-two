<template>
  <div class="intialBoard">
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
  startGame();
});
</script>

<style>
@import './assets/style.css';
</style>
