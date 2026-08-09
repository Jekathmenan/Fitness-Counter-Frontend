<script setup>
import { X, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  item: {
    type: Object,
    default: () => ({})
  },
  allowDelete: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'confirm']);

const handleSubmit = () => {
  emit('confirm');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        
        <div 
          class="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" 
          @click="emit('close')"
        ></div>

        <div class="relative bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all">
          
          <button @click="emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>

          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-red-500/10 rounded-full">
              <AlertTriangle class="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ title || 'Löschen bestätigen' }}</h3>
              <p class="text-gray-400 text-sm mt-1">{{ message }}</p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div v-if="item" class="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">Zu löschendes Element:</span>
                <p class="text-white font-medium">#{{ item.id }} {{ item.name }}</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                type="button" 
                @click="emit('close')"
                class="flex-1 px-4 py-2.5 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all"
              >
                Abbrechen
              </button>
              <button 
                type="submit"
                v-if="allowDelete"
                class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Ja, löschen
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-active .relative {
  animation: modal-in 0.3s ease-out;
}
@keyframes modal-in {
  0% { transform: scale(0.9) translateY(10px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
</style>