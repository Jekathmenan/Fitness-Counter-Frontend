<script setup>
import { ref } from 'vue';
import SingleSelect from '../reusable/SingleSelect.vue';

const props = defineProps({
    exercises: {
        type: Array,
        required: true
    }        
});

const emit = defineEmits(['close', 'confirm']);

const selectedExercise = ref(null);

const handleConfirm = () => {
    if (selectedExercise.value) {
        emit('confirm', selectedExercise.value);
        selectedExercise.value = null; // Reset für nächstes Mal
    }
};
</script>

<template>
    <!-- Overlay Hintergrund -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <!-- Blur Backdrop -->
        <div 
            class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            @click="emit('close')"
        ></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-white">Übung hinzufügen</h2>
                    <button @click="emit('close')" class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="space-y-6">
                    <SingleSelect 
                        v-model="selectedExercise"
                        :options="exercises"
                        label="Übung auswählen"
                        placeholder="Übung auswählen"
                    />

                    <div class="flex gap-3 pt-4">
                        <button 
                            type="button"
                            @click="emit('close')"
                            class="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all"
                        >
                            Abbrechen
                        </button>
                        <button 
                            type="button"
                            @click="handleConfirm"
                            :disabled="!selectedExercise"
                            class="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
                        >
                            Hinzufügen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>