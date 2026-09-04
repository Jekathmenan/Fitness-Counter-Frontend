<script setup>
    import Header from '@/components/template/reusable/Header.vue';
    import ConfirmModal from '@/components/template/reusable/ConfirmModal.vue';
    import { ref, onMounted } from 'vue';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client';
    import { Pencil, Trash2 } from 'icons';
    import { useRouter } from 'vue-router';

    const flashStore = useFlashStore();
    const router = useRouter();
    const exercises = ref({});
    const isDeleteModalOpen = ref(false);
    const selectedItem = ref(null);

    const openDeleteModal = (item) => {
        selectedItem.value = item;
        isDeleteModalOpen.value = true;
    };

    const handleDeleteConfirm = async () => {
        try {
            if (selectedItem.value.unused) {
                const response = await apiClient.delete("exercise/"+selectedItem.value.id);
                await retrieveExercises();
                flashStore.setFlash("Übung erfolgreich gelöscht", "success");
            } else {
                flashStore.setFlash("Übung wird bereits verwendet und kann nicht gelöscht werden.", "error");
            }
            
        }
        catch (error) {
            flashStore.setFlash("Fehler beim Löschen der Übung.", "error");
            console.error(error);
        } finally {
            isDeleteModalOpen.value = false;
        }
    };
    
    const retrieveExercises = async () =>  {
        try {
            const response = await apiClient.get("exercise/");
            exercises.value =  response.data;
        } catch (error) {
            flashStore.setFlash("Fehler beim Laden der Übungen.", "error");
            console.error(error);
        }
    };

    const redirectToEdit = (id) => {
        router.push({
            path: "/core-data/exercises/edit/" + id
        });
    };

    onMounted(async () => {
        await retrieveExercises();
    } );
</script>
<template>
    <Header title="Übungen verwalten"
        backToUrl="/core-data"
        backToUrlText="Zur&uuml;ck zu den Stammdaten"
        insertText="Hinzuf&uuml;gen"
        insertPath="/core-data/exercises/add"
    />
    
    <div class="relative mt-5 overflow-x-auto shadow-2xl rounded-xl border border-gray-700/50 bg-gray-800/50">
        <table class="w-full text-sm text-left text-gray-300">
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
                        <div class="flex flex-wrap gap-1.5">
                            <span 
                            v-for="type in exercise.movements" 
                            :key="type.id"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            >
                            
                            {{ type.name }}
                            </span>

                            
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex justify-end space-x-2">
                            <button @click="redirectToEdit(exercise.id)" class="p-2 rounded-lg bg-gray-700/50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Bearbeiten">
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button  @click="openDeleteModal(exercise)" class="p-2 rounded-lg bg-gray-700/50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Löschen">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <ConfirmModal
            :is-open="isDeleteModalOpen"
            title="&Uuml;bung löschen?"
            :message="selectedItem?.unused 
                ? 'Möchten Sie die &Uuml;bung wirklich dauerhaut aus der Datenbank entfernen? Diese Aktion kann nicht rückgängig gemacht werden.'  
                : '&Uuml;bung kann nicht gelöscht werden, da sie bereits verwendet wird!'"
            :item="selectedItem"
            :allowDelete="selectedItem?.unused"
            @close="isDeleteModalOpen = false"
            @confirm="handleDeleteConfirm"
        />
    </div>
</template>
<style lang="css" scoped>
</style>