<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client'; 
    import Header from '@/components/template/reusable/Header.vue';
    import { formatGermanDateTime } from '@/utils/dateFormatter';

    const flashStore = useFlashStore();
    const workouts = ref({});
    
    const fetchTrainingsData = async () => {
        try {
            const response = await apiClient.get('/workout/');
            workouts.value = response.data;
        } catch (error) 
        {
            flashStore.setFlash("Trainingsdaten konnten nicht geladen werden.", "error");
        }
    };

    const ongoingWorkout = computed(() => {
        if (!Array.isArray(workouts.value)) {
            return false;
        }
        const workout = workouts.value.find(workout => workout.endTime === null);
        return workout;
    });

    const calculateTimeSofar = (workout) => {
        const start = new Date(workout.startTime);
        const end = new Date(workout.endTime);
        console.log("start:" + start + " end:" + end)
        const diff = Math.max(0, end - start); 
        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor(diff / (1000 * 60 * 60));

        const pad = (num) => String(num).padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };
    

    onMounted(() => { fetchTrainingsData(); });
</script>
<template>
    <Header title="Trainingsverlauf"  
        :insertText="ongoingWorkout ? 'Training bearbeiten' : 'Training starten'" 
        insertPath="/workout/add"
    />
    <div class="mt-5 relative overflow-x-auto shadow-2xl rounded-xl border border-gray-700/50 bg-gray-800/50">
        <table class="w-full text-sm text-left text-gray-300">
            <!-- Header -->
            <thead class="text-xs uppercase tracking-wider bg-gray-900/50 text-gray-400 border-b border-gray-700">
                <tr>
                    <th scope="col" class="px-6 py-4 font-semibold">ID</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Name</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Startzeit</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Dauer</th>
                    <th scope="col" class="px-6 py-4 font-semibold">
                        Total &Uuml;bungen
                    </th>
                </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-700/50">
                <tr v-for="workout in workouts" class="hover:bg-gray-700/30 transition-all duration-200 group">
                    <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                       #{{ workout.id }}
                    </td>
                    <td class="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                        {{ workout.name ?? "Training" }}
                    </td>
                    <td class="px-6 py-4 text-gray-400">
                        {{ formatGermanDateTime(workout.startTime) }}
                    </td>
                    <td class="px-6 py-4 text-gray-400">
                        {{ workout.endTime == null ? 'Training läuft' : calculateTimeSofar(workout) }}
                    </td>
                    <td class="px-6 py-4 text-gray-400">
                        {{ workout.workoutExercises.length }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
</style>