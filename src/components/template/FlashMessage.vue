<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'info'
  }
});

const isVisible = ref(true);

watch(() => props.message, (newVal) => {
    if (newVal) {
        isVisible.ref = true;
    }
});

const statusConfig = {
  success: 'bg-green-900/30 border-green-500 text-green-400',
  error: 'bg-red-900/30 border-red-500 text-red-400',
  warning: 'bg-yellow-900/30 border-yellow-500 text-yellow-200',
  info: 'bg-blue-900/30 border-blue-500 text-blue-400'
};

const colorClasses = computed(() => {
  return statusConfig[props.status] || statusConfig.info;
});
</script>

<template>
  <div 
    v-if="message && isVisible"
    @click="isVisible = false"
    :class="[
      'fixed bottom-25 right-5 z-50 px-6 py-4 rounded-xl border-l-4 shadow-2xl transition-all duration-500 flex items-center gap-3 cursor-pointer',
      colorClasses
    ]"
  >
    <span class="font-medium">{{ message }}</span>
    <span class="text-xs opacity-50 ml-2">✕</span>
  </div>
</template>