<template>
  <div :class="['winning-message', { show: isVisible }]">
    <div>{{ message }}</div>
    <button @click="$emit('restart')">Restart</button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  isVisible: boolean;
}

defineProps<Props>();

defineEmits<{
  restart: [];
}>();
</script>
