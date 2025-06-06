<template>
  <div :class="boardClasses">
    <GameCell v-for="cell in boardCells" :key="cell.index" :cell="cell" @click="$emit('cellClick', cell.index)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GameCell from './GameCell.vue';
import type { CellData, Player } from '../types/';

interface Props {
  boardCells: CellData[];
  currentPlayer: Player;
}

const props = defineProps<Props>();

defineEmits<{
  cellClick: [index: number];
}>();

const boardClasses = computed(() => [
  'board',
  props.currentPlayer
]);
</script>
