<script setup>
    import { ref, computed, onMounted } from 'vue';
    import {  Check , Trash2 } from 'icons';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client';
    import ConfirmModal from '../reusable/ConfirmModal.vue';

    const props = defineProps({
        set: {
            type: Object,
            required: true
        },
        exerciseId: {
            type: Number,
            required: true
        },
        editable: {
            type: Boolean,
            default: true
        }
    });

    const emit = defineEmits(["setChanged"]);

    const flash = useFlashStore();
    const weight = ref(0);
    const reps = ref(0);
    const errors = ref({});

    const isDeleteModalOpen = ref(false);
    
    const isWeightChanged = computed(() => props.set.weight != weight.value);
    const isRepsChanged = computed(() => props.set.reps != reps.value);
    const needsSave = computed(() => isWeightChanged.value || isRepsChanged.value);

    const saveChanges = async (set) => {
        try {
            // validate Input
            const weightVal = parseFloat(weight.value);
            const repsVal = parseFloat(reps.value);

            await validateInput(weightVal, repsVal);

            if (!errors.value.weight && !errors.value.weight) {
                const body = {
                    id: props.set.id,
                    weight: weightVal,
                    reps: repsVal
                };

                const response = await apiClient.put("workout/"+ props.exerciseId + "/set", body);
                emit("setChanged", response.data);
                flash.setFlash("Satz gespeichert", "success");
            }

        } catch (error) {
            flash.setFlash("Fehler beim speichern des Satzes", "error");
            console.error(error);
        }
    };

    const validateInput = async (weightVal, repsVal) => {
        errors.value.weight = false;
        errors.value.reps = false;

        if (isNaN(weightVal) || weightVal < 0) {
            errors.value.weight = true;
        }

        if (isNaN(repsVal) || repsVal < 0) {
            errors.value.reps = true;
        }

        return errors.value.weight || errors.value.weight;
    };

    const openDeleteModal = () => {
        isDeleteModalOpen.value = true;
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await apiClient.delete("workout/"+ props.exerciseId + "/set/"+ props.set.id);
            emit("setChanged", response.data);
        } catch (error) {
            flash.setFlash("Fehler beim Löschen des Satzes", "error");
            console.error(error);
        }
        
    };

    onMounted(() => {
        weight.value = props.set.weight;
        reps.value = props.set.reps;
    });
</script>
<template>
    <!--<td class="px-3 py-2 text-gray-500 font-mono text-xs">
        {{ set.pos }}
    </td> -->
    <td class="px-3 py-2 font-bold text-white hover:text-blue-400 transition-colors">
        <input v-model="weight" maxlength="4" :readonly="!editable"
            :class="
                errors.weight ? 
                    'border-red-500 text-red-500' : 
                    'border-gray-600 focus:border-blue-500 text-white',
                (isWeightChanged && !errors.weight) ?
                    'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500' :
                    ''
            " 
            class="w-15 px-2 text-center rounded-lg border border-gray-600" />

    </td>
    <td class="px-3 py-2 font-bold text-white hover:text-blue-400 transition-colors">
        <input v-model="reps" maxlength="4" :readonly="!editable"
            :class="errors.reps ?
                'border-red-500 text-red-500' :
                'border-gray-600 focus:border-blue-500 text-white',
                (isRepsChanged && !errors.reps) ?
                'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500' :
                ''
            "
            class="w-15 px-2 text-center rounded-lg border border-gray-600" />
    </td>
    
    <td v-if="editable" class="px-3 py-2">
        <div class="flex justify-end space-x-2">
            <button @click="saveChanges" 
                class="p-2 rounded-lg bg-gray-700/50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm" 
                :class="needsSave ? 'bg-green-600 ' : ''"
                title="Bearbeiten"
                :disabled="!needsSave"
                >
                <Check  class="w-4 h-4" :class="needsSave ? 'text-white' : ''" />
            </button>
            <button  @click="openDeleteModal" class="p-2 rounded-lg bg-gray-700/50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Löschen">
                <Trash2 class="w-4 h-4" />
            </button>
        </div>
    </td>
    <ConfirmModal
        v-if="editable"
        :is-open="isDeleteModalOpen"
        title="Satz löschen?"
        message="Möchten Sie diesen Satz wirklich entfernen?"
        :item="set"
        :displayName ="'Gewicht: ' + weight + ' / Wiederholungen: ' + reps"
        :allowDelete="true"
        @close="isDeleteModalOpen = false"
        @confirm="handleDeleteConfirm"
    />
</template>