<script setup>
    import { ref, onMounted } from 'vue';
    import apiClient from '@/api/client';
    import {  Pencil, Trash2 } from 'icons';
    import { useFlashStore } from '@/stores/flash';
    import ConfirmModal from '@/components/template/reusable/ConfirmModal.vue';
    import Header from '@/components/template/reusable/Header.vue';
    import { useRouter } from 'vue-router';

    const bodyParts = ref({});
    const loading = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedItem = ref(null);
    const flashStore = useFlashStore();
    const router = useRouter();

    const openDeleteModal = (item) => {
        selectedItem.value = item;
        isDeleteModalOpen.value = true;
    };

    const handleDeleteConfirm = async () => {
        try {
            if (selectedItem.value.unused) {
                loading.value = true;
                // Call API to delete body part
                const response = await apiClient.delete('body-part/'+ selectedItem.value.id);
                
                // Reload bodyparts
                retrieveBodyParts();

                // set Flash Message
                flashStore.setFlash(selectedItem.value.name + ' erfolgreich gelöscht!', 'info');
            } else  {
                flashStore.setFlash(selectedItem.value.name + ' wird bereits in Übungen verwendet und kann nicht gelöscht werden!', 'error');
            }
        } catch (error) {
            console.error(error);
            flashStore.setFlash(selectedItem.value.name + ' konnte nicht gelöscht werden!', 'error');
        } finally {
            loading.value = false;
            isDeleteModalOpen.value = false;
        } 
    };

    const retrieveBodyParts = async () => {
        try {
            loading.value = true;
            const response = await apiClient.get('body-part/');
            bodyParts.value = response.data;
        } catch (error) {
            flashStore.setFlash("Körperteile konnten nicht geladen werden. Bitte später versuchen!", 'error');
            console.error("Fehler beim laden der erfassten Körperteile.", error);
        } finally {
            loading.value = false;
        }
    };

    const redirectToEdit = (id) => {
        router.push({
            path: "/core-data/body-parts/edit/" + id
        });
    };

    onMounted (() => {
        retrieveBodyParts();
    })
</script>
<template>
    <Header title="Körperteile" 
        backToUrl="/core-data"  insertText="Hinzuf&uuml;gen"
        backToUrlText="Zur&uuml;ck zu den Stammdaten" 
        insertPath="/core-data/body-parts/add"
    />

    <div class="relative mt-5 overflow-x-auto shadow-2xl rounded-xl border border-gray-700/50 bg-gray-800/50">
        <table class="w-full text-sm text-left text-gray-300">
            <!-- Header -->
            <thead class="text-xs uppercase tracking-wider bg-gray-900/50 text-gray-400 border-b border-gray-700">
                <tr>
                    <th scope="col" class="px-6 py-4 font-semibold">ID</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Name</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Beschreibung</th>
                    <th scope="col" class="px-6 py-4 font-semibold text-right">
                        Aktionen
                    </th>
                </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-700/50">
                <tr v-for="bodyPart in bodyParts" class="hover:bg-gray-700/30 transition-all duration-200 group">
                    <td class="px-6 py-4 text-gray-500 font-mono text-xs">
                       #{{ bodyPart.id }}
                    </td>
                    <td class="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">
                        {{ bodyPart.name }}
                    </td>
                    <td class="px-6 py-4 text-gray-400">
                        {{ bodyPart.description }}
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex justify-end space-x-2">
                            <button @click="redirectToEdit(bodyPart.id)" class="p-2 rounded-lg bg-gray-700/50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="Bearbeiten">
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button  @click="openDeleteModal(bodyPart)" class="p-2 rounded-lg bg-gray-700/50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Löschen">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <ConfirmModal
            :is-open="isDeleteModalOpen"
            title="Körperteil löschen?"
            :message="selectedItem?.unused 
                ? 'Möchten Sie den Körperteil wirklich dauerhaft aus der Datenbank entfernen? Diese Aktion kann nicht rückgängig gemacht werden.'  
                : 'Körperteil kann nicht gelöscht werden, da es in Übungen verwendet wird!'"
            :item="selectedItem"
            :allowDelete="selectedItem?.unused"
            @close="isDeleteModalOpen = false"
            @confirm="handleDeleteConfirm"
        />
    </div>
</template>