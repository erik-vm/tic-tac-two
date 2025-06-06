<template>
  <div :class="['moveGridCntr', { active: isActive }]">
    <div v-for="(direction, index) in moveDirections" :key="index" :class="['moveGridBtn', `move-btn-${index}`]"
      @click="$emit('gridMove', direction)"></div>
  </div>
</template>

<script setup lang="ts">
import type { MoveDirection } from '../types/';

interface Props {
  moveDirections: MoveDirection[];
  isActive: boolean;
}

defineProps<Props>();

defineEmits<{
  gridMove: [direction: MoveDirection];
}>();
</script>
