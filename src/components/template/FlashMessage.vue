<script setup>
import { ref, computed, watch } from 'vue';
import { useFlashStore } from '@/stores/flash';

const flashStore = useFlashStore();
const isVisible = ref(false);

watch(() => flashStore.errorMessage, (newVal) => {
    if (newVal) {
        isVisible.value = true;
    }
});

const statusConfig = {
  success: 'bg-green-900/30 border-green-500 text-green-400',
  error: 'bg-red-900/30 border-red-500 text-red-400',
  warning: 'bg-yellow-900/30 border-yellow-500 text-yellow-200',
  info: 'bg-blue-900/30 border-blue-500 text-blue-400'
};

const colorClasses = computed(() => {
  return statusConfig[flashStore.status] || statusConfig.info;
});

const close = () => {
  isVisible.value = false;
};
</script>

<template>
  <div 
    v-if="flashStore.errorMessage && isVisible"
    @click="close"
    :class="[
      'fixed bottom-25 right-5 z-50 px-6 py-4 rounded-xl border-l-4 shadow-2xl transition-all duration-500 flex items-center gap-3 cursor-pointer select-none',
      colorClasses
    ]"
  >
    <span class="font-medium">{{ flashStore.errorMessage }}</span>
    <span class="text-xs opacity-50 ml-2">✕</span>
  </div>
</template>
<style scoped>
  .flash-enter-active, .flash-leave-active {
    transition: all 0.4s ease;
  }
  .flash-enter-from, .flash-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>