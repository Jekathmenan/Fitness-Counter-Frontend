<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: { type: Object, default: null }, 
    options: { type: Array, default: () => [] },    
    label: { type: String, default: "" },
    placeholder: { type: String, default: "Suchen..." }
});

const emit = defineEmits(['update:modelValue']);

const searchTerm = ref("");
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const filteredOptions = computed(() => {
    if (!searchTerm.value) return props.options;
    return props.options.filter(opt => 
        opt.name && opt.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

const selectOption = (item) => {
    emit('update:modelValue', item);
    searchTerm.value = ""; // Suchfeld leeren
    isDropdownOpen.value = false; // Dropdown schließen
};

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false;
    }
};

onMounted(() => window.addEventListener('click', handleClickOutside));
onUnmounted(() => window.removeEventListener('click', handleClickOutside));
</script>

<template>
    <div class="relative" ref="dropdownRef">
        <label v-if="label" class="block text-sm font-semibold text-gray-300 mb-2">
            {{ label }}
        </label>

        <div class="relative">
            <!-- Anzeige des gewählten Elements direkt im Feld oder darüber -->
            <div v-if="modelValue" class="mb-2 flex items-center justify-between bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg border border-blue-500/30">
                <span class="text-sm font-medium">{{ modelValue.name }}</span>
                <button type="button" @click="emit('update:modelValue', null)" class="text-xl">&times;</button>
            </div>

            <input 
                v-if="!modelValue"
                type="text"
                v-model="searchTerm"
                @focus="isDropdownOpen = true"
                :placeholder="placeholder"
                class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            
            <div 
                v-if="isDropdownOpen && !modelValue" 
                class="absolute z-[60] w-full mt-2 max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-2xl"
            >
                <div 
                    v-for="opt in filteredOptions" 
                    :key="opt.id"
                    @click="selectOption(opt)"
                    class="px-4 py-2.5 hover:bg-gray-700 cursor-pointer text-white text-sm border-b border-gray-700/50 last:border-0"
                >
                    {{ opt.name }}
                </div>
                
                <div v-if="filteredOptions.length === 0" class="px-4 py-6 text-center text-gray-500 text-sm">
                    Keine Übung gefunden.
                </div>
            </div>
        </div>
    </div>
</template>