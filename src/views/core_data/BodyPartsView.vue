<script setup>
    import { ref, onMounted } from 'vue';

    const bodyParts = ref({});
    const loading = ref(false);

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

    onMounted (() => {
        retrieveBodyParts();
    })
</script>
<template>
    <div class="header flex place-content-between mb-3">
        <h2 class="text-xl font-bold mb-[8px]">Körperteile</h2>
        <button class="p-2 rounded-lg h-9 w-9 bg-gray-700/50 text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-sm ">
            <router-link to="/" ><CirclePlus class="w-5 h-5" /></router-link>
        </button>
    </div>

    <div class="relative overflow-x-auto shadow-2xl rounded-xl border border-gray-700/50 bg-gray-800/50">
        <table class="w-full text-sm text-left text-gray-300">
            <!-- Header -->
            <thead class="text-xs uppercase tracking-wider bg-gray-900/50 text-gray-400 border-b border-gray-700">
                <tr>
                    <th scope="col" class="px-6 py-4 font-semibold">ID</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Name</th>
                    <th scope="col" class="px-6 py-4 font-semibold">Beschreibung</th>
                    <th scope="col" class="px-6 py-4 font-semibold text-right">Aktionen</th>
                </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-700/50">
                <!-- Zeile 1 -->
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
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    
</template>
<style scoped>
    .body-parts {
        margin-top: 5px;
    }

    .body-part {
        width: 100%;
        min-height: 25px;
        background-color: #F9F9F2;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        
        margin: 8px 0;
        padding: 7px;
    }

    .body-part:hover {
        transform: scale(1.008);
    }
</style>