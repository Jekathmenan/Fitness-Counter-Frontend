<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: { type: Array, default: () => [] }, 
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

const isSelected = (id) => {
    if (!id) return false;
    return props.modelValue.some(item => item.id === id);
};

const toggleOption = (item) => {
    if (!item || !item.id) return;

    if (isSelected(item.id)) {
        const newValue = props.modelValue.filter(selectedItem => selectedItem.id !== item.id);
        emit('update:modelValue', newValue);
    } else {
        const newValue = [...props.modelValue, item];
        emit('update:modelValue', newValue);
    }
};

const handleEnter = () => {
    const term = searchTerm.value.trim();
    if (!term) return;

    const existingInOptions = props.options.find(o => o.name.toLowerCase() === term.toLowerCase());
    
    if (existingInOptions) {
        if (!isSelected(existingInOptions.id)) toggleOption(existingInOptions);
    } else {
        const newObj = { id: Date.now(), name: term };
        emit('update:modelValue', [...props.modelValue, newObj]);
    }
    searchTerm.value = "";
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
        <label v-if="label" class="block text-sm font-semibold text-gray-300 mb-2 font-sans">
            {{ label }}
        </label>

        <div class="flex flex-wrap gap-2 mb-3">
            <TransitionGroup name="list">
                <span 
                    v-for="item in modelValue" 
                    :key="item.id"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                >
                    {{ item.name }}
                    <button type="button" @click.stop="toggleOption(item)" class="ml-2 hover:text-white text-lg leading-none">&times;</button>
                </span>
            </TransitionGroup>
            <span v-if="modelValue.length === 0" class="text-gray-500 text-sm italic py-1">
                Noch nichts ausgewählt...
            </span>
        </div>

        <div class="relative">
            <input 
                type="text"
                v-model="searchTerm"
                @focus="isDropdownOpen = true"
                @keydown.enter.prevent="handleEnter"
                :placeholder="placeholder"
                class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            
            <div 
                v-if="isDropdownOpen" 
                class="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-2xl"
            >
                <div 
                    v-for="opt in filteredOptions" 
                    :key="opt.id"
                    @click="toggleOption(opt)"
                    class="px-4 py-2.5 hover:bg-gray-700 cursor-pointer flex items-center justify-between transition-colors border-b border-gray-700/50 last:border-0"
                    :class="{'bg-blue-600/20 text-blue-300': isSelected(opt.id)}"
                >
                    <span class="text-sm">{{ opt.name }}</span>
                    
                    <span v-if="isSelected(opt.id)" class="text-blue-400 text-xs font-bold">
                        ✓
                    </span>
                </div>
                
                <div v-if="filteredOptions.length === 0" class="px-4 py-6 text-center text-gray-500 text-sm">
                    Kein Treffer. Enter drücken zum Erstellen.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.2s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: scale(0.9); }
</style>