<template>
  <div class="controls">
    <button @click="$emit('aiMove')" class="aiMoveBtn">
      AI MOVE
    </button>

    <MovementGrid :move-directions="moveDirections" :is-active="showMovementControls"
      @grid-move="$emit('gridMove', $event)" />
  </div>
</template>

<script setup lang="ts">
import MovementGrid from './MovementGrid.vue';
import type { MoveDirection } from '../types/';

interface Props {
  moveDirections: MoveDirection[];
  showMovementControls: boolean;
}

defineProps<Props>();

defineEmits<{
  aiMove: [];
  gridMove: [direction: MoveDirection];
}>();
</script>
