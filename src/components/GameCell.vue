<template>
  <div :class="cellClasses" @click="$emit('click')"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CellData } from '../types/';

interface Props {
  cell: CellData;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const cellClasses = computed(() => [
  'cell',
  {
    'x': props.cell.hasX,
    'circle': props.cell.hasO,
    'grid': props.cell.isGrid
  }
]);
</script>
