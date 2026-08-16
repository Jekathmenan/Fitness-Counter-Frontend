<script setup>
    import Header from '@/components/template/Header.vue';
    import { ref, onMounted } from 'vue';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client';
    import { Pencil, Trash2 } from 'icons';

    const flashStore = useFlashStore();
    const exercises = ref({});
    
    const retrieveExercieses = async () =>  {
        try {
            const response = await apiClient.get("exercise/");
            exercises.value =  response.data;
            console.log(exercises.value);
        } catch (error) {
            flashStore.setFlash("Fehler beim Laden der Übungen.", "error");
            console.error(error);
        }
    };

    onMounted(() => {
        retrieveExercieses();
    } );
</script>
<template>
    <Header title="Übungen verwalten"
        path="/core-data"
        urlText="Zur&uuml;ck zu den Stammdaten"
        addText="Hinzuf&uuml;gen"
        addPath="/core-data/exercises/add"
        />
    
    <div class="relative mt-5 overflow-x-auto shadow-2xl rounded-xl border border-gray-700/50 bg-gray-800/50">
        <table class="w-full text-sm text-left text-gray-300">
            <!-- Header -->
            <thead class="text-xs uppercase tracking-wider bg-gray-900/50 text-gray-400 border-b border-gray-700">
                <tr>
                    <th scope="col" class="px-6 py-4 font-semibold">ID</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Name</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Beschreibung</th>
                    <th scope="col" class="px-6 py-4 font-semibold">K&ouml;rperteile</th>
                    <th scope="col" class="px-6 py-4 font-semibold text-right">
                        Aktionen
                    </th>
                </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-700/50">
                <tr v-for="exercise in exercises" class="hover:bg-gray-700/30 transition-all duration-200 group">
                    <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                       #{{ exercise.id }}
                    </td>
                    <td class="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                        {{ exercise.name }}
                    </td>
                    <td class="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                        {{ exercise.description }}
                    </td>
                    <td class="px-6 py-4 text-gray-400">
                        {{ exercise.bodyParts?.map(bp => bp.name).join(', ') || "" }}
                    </td>
                    <td class="px-6 py-4">
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
<style lang="css" scoped>
</style>