<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Übung hinzufügen...'
  },
  label: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Lokaler State für den aktuell getippten Text
const currentInput = ref('');

const addItem = () => {
  const trimmedValue = currentInput.value.trim();
  
  // Nur hinzufügen, wenn das Feld nicht leer ist
  if (trimmedValue.length > 0) {
    // Neues Objekt erstellen
    const newEntry = {
      id: Date.now(), // Temporäre ID (oder UUID)
      name: trimmedValue,
      createdAt: new Date()
    };

    // WICHTIG: In Vue müssen wir ein neues Array emitten, damit die Reaktivität greift
    const updatedArray = [...props.modelValue, newEntry];
    
    emit('update:modelValue', updatedArray);
    
    // Eingabefeld leeren
    currentInput.value = '';
  }
};

// Optional: Funktion zum Entfernen von Einträgen
const removeItem = (id) => {
  const updatedArray = props.modelValue.filter(item => item.id !== id);
  emit('update:modelValue', updatedArray);
};
</script>

<template>
  <div class="w-full space-y-3">
    
    <label v-if="label" class="block text-sm font-semibold text-gray-300 mb-2">
        {{ label }}
    </label>

    <div class="relative">
      <input
        v-model="currentInput"
        type="text"
        :placeholder="placeholder"
        @keydown.enter.prevent="addItem"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
               outline-none transition-all bg-white text-gray-900"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <span class="text-xs text-gray-400 bg-gray-100 border px-2 py-1 rounded">Enter</span>
      </div>
    </div>

    <!-- Liste der bereits hinzugefügten Objekte (Chips/Tags) -->
    <div class="flex flex-wrap gap-2">
      <div 
        v-for="exercise in modelValue" 
        :key="exercise.id"
        class="flex items-center bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full border border-emerald-200"
      >
        {{ exercise.name }}
        <button 
          @click="removeItem(exercise.id)"
          class="ml-2 hover:text-emerald-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>