<script setup>
    import {  Plus, Trash2 } from 'icons';
    import WorkoutSet from './WorkoutSet.vue';
    import { onMounted, ref } from 'vue';
    import ConfirmModal from '../reusable/ConfirmModal.vue';
    import { useFlashStore } from '@/stores/flash.js';
    import apiClient from '@/api/client.js';

    const emit = defineEmits(["workoutDeleted", "workoutChanged"]);
    const flash = useFlashStore();

    const props = defineProps({
        title: {
            type: String
        },
        workoutExercise: {
            type: Object,
            required: true
        },
        workoutId: {
            type: Number,
            required: true
        },
        editable: {
            type: Boolean,
            default: true
        }
    });

    const isDeleteModalOpen = ref(false);
    const allowDelete = ref(false);
    const tempWorkout = ref({});

    const setChanged = (payload) => {
        tempWorkout.value.workoutSets = payload.workoutSets;
        emit('workoutDeleted', tempWorkout.value);
    } 

    const addNewSet = async () => {
        try {
            const response = await apiClient.post("workout/"+ tempWorkout.value.id + "/set", {
                weight: 0,
                reps: 0
            });
            console.log("done");
            tempWorkout.value = response.data;
            emit("workoutChanged");
        } catch (error) {
            flash.setFlash("Fehler beim Einfügen des neuen Satzes", "error");
            console.error(error);
        }
    };

    const openDeleteModal = () => {
        allowDelete.value = props.workoutExercise?.workoutSets?.length == 0 || (props.workoutExercise?.workoutSets?.length == 1 && props.workoutExercise?.workoutSets[0].weight == 0 && props.workoutExercise?.workoutSets[0].reps == 0);
        isDeleteModalOpen.value = true;
    };

    const handleDeleteConfirm = async () => {
        try {
            if (allowDelete) {
                // Lösche Übung
                await apiClient.delete("workout/" +  props.workoutId + "/exercise/" + props.workoutExercise.id);

                // Lade aktive Übungen neu
                emit("workoutDeleted");

                // Schliesse "Löschen"-Karte
                isDeleteModalOpen.value = false;
            }
        } catch (error) {
            flash.setFlash("Fehler beim Löschen der Übung.", "error");
            console.error(error);
        }
    }; 

    onMounted( () => {
        tempWorkout.value = props.workoutExercise;
    });
</script>

<template>
    <div class="bg-gray-800 min-h-[200px] w-[350px] border-4 border-gray-800 text-white
        rounded-xl hover:scale-[1.02] transition-transform
        shadow-[0_0_15px_rgba(255,255,255,0.1)] p-6">
        
        <div class="border-b border-gray-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="text-xl font-bold mt-1">
                {{ tempWorkout?.exercise?.name || "Übung unbekannt" }}
            </h3>
            <div v-if="editable" class="buttons">
                <button @click="addNewSet" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs transition"><Plus class="w-3 h-3" /></button>
                <button @click="openDeleteModal" class="mx-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs transition"><Trash2 class="w-3 h-3" /></button>
            </div>
            
        </div>

        <div class="text-gray-400 text-sm">
            <table class="w-full text-sm text-left text-gray-300">
                <!-- Header -->
                <thead class="text-xs uppercase tracking-wider bg-gray-900/50 text-gray-400 border-b border-gray-700">
                    <tr>
                        <!--<th scope="col" class="px-3 py-2 font-semibold">Pos.</th>-->
                        <th scope="col" class="px-3 py-2 font-semibold">Gewicht</th>
                        <th scope="col" class="px-3 py-2 font-semibold">Wiederh.</th>
                        <th v-if="editable"  scope="col" class="px-3 py-2 font-semibold text-right">
                        </th>
                    </tr>
                </thead>
                
                <tbody class="divide-y divide-gray-700/50">
                    <tr v-for="workoutSet in tempWorkout?.workoutSets" class="hover:bg-gray-700/30 transition-all duration-200 group">
                        <WorkoutSet :set="workoutSet" :editable="editable" :exercise-id="tempWorkout?.id" @setChanged="setChanged" />
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <ConfirmModal
        :is-open="isDeleteModalOpen"
        title="Übung löschen?"
        :message="allowDelete ? 'Möchten Sie die Übung wirklich aus dem Training entfernen?' : 
        'Übung wird bereits verwendet und kann nicht gelöscht werden!'"
        :item="tempWorkout"
        :displayName ="tempWorkout?.exercise?.name"
        :allowDelete="allowDelete"
        @close="isDeleteModalOpen = false"
        @confirm="handleDeleteConfirm"
    />
</template>