<script setup>
    import {  Trash2 } from 'icons';
    import WorkoutSet from './WorkoutSet.vue';
    import { onMounted, ref } from 'vue';

    const emit = defineEmits(["deleteClicked", "workoutChanged"]);

    const props = defineProps({
        title: {
            type: String
        },
        workoutExercise: {
            type: Object,
            required: true
        }
    });

    const tempWorkout = ref({});

    const handleClick = () => {
        emit('deleteClicked');
    };

    const setChanged = (payload) => {
        tempWorkout.value.workoutSets = payload.workoutSets;
        emit('workoutChanged', tempWorkout.value);
    } 

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
            <button @click="handleClick" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs transition"><Trash2 class="w-3 h-3" /></button>
        </div>

        <div class="text-gray-400 text-sm">
            <table class="w-full text-sm text-left text-gray-300">
                <!-- Header -->
                <thead class="text-xs uppercase tracking-wider bg-gray-900/50 text-gray-400 border-b border-gray-700">
                    <tr>
                        <!--<th scope="col" class="px-3 py-2 font-semibold">Pos.</th>-->
                        <th scope="col" class="px-3 py-2 font-semibold">Gewicht</th>
                        <th scope="col" class="px-3 py-2 font-semibold">Wiederh.</th>
                        <th scope="col" class="px-3 py-2 font-semibold text-right">
                        </th>
                    </tr>
                </thead>
                
                <tbody class="divide-y divide-gray-700/50">
                    <tr v-for="workoutSet in tempWorkout?.workoutSets" class="hover:bg-gray-700/30 transition-all duration-200 group">
                        <WorkoutSet :set="workoutSet" :exercise-id="tempWorkout?.id" @setChanged="setChanged" />
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>