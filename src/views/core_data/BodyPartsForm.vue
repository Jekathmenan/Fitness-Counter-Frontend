<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useFlashStore } from '@/stores/flash';
  import { useRouter, useRoute } from 'vue-router';
  import Header from '@/components/template/Header.vue';
  import apiClient from '@/api/client';

  const router = useRouter();
  const route = useRoute();
  const flashStore = useFlashStore();
  
  const name = ref("");
  const description = ref("");
  const loading = ref(false);
  const errors = ref({});

  const id = route.params.id; 
  const isEditMode = computed(() => !!id);

  const pageTitle = computed(() => isEditMode.value ? "Körperteil bearbeiten" : "Neues Körperteil erfassen");
  const submitButtonText = computed(() => isEditMode.value ? "Änderungen speichern" : "Körperteil erstellen");

  onMounted(async () => {
    if (isEditMode.value) {
        try {
            loading.value = true;
            const response = await apiClient.get(`body-part/${id}`);
            name.value = response.data.name;
            description.value = response.data.description;
        } catch (error) {
            flashStore.setFlash("Daten konnten nicht geladen werden.", "error");
            router.push('/core-data/body-parts');
        } finally {
            loading.value = false;
        }
    }
  });

  const handleSubmit = async () => {
    loading.value = true;
    errors.value = {};
    
    try {
        if (isEditMode.value) {
            await apiClient.put(`body-part/${id}`, {
                name: name.value,
                description: description.value
            });
            flashStore.setFlash("Erfolgreich aktualisiert", "success");
        } else {
            await apiClient.post('body-part/', {
                name: name.value,
                description: description.value
            });
            flashStore.setFlash("Erfolgreich erstellt", "success");
        }
        
        router.push('/core-data/body-parts');
    } catch (error) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        }
        flashStore.setFlash(isEditMode.value ? "Fehler beim Aktualisieren" : "Fehler beim Erstellen", "error");
    } finally {
        loading.value = false;
    }
  };
</script>

<template>
  <Header :title="pageTitle" 
    path="/core-data/body-parts" 
    urlText="Zurück zur Übersicht" 
  />

  <div class="max-w-2xl mx-auto mt-8">
    <div class="bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
        <div v-if="loading && isEditMode && !name" class="p-12 text-center text-gray-400">
            Wird geladen...
        </div>

        <div v-else class="p-6 sm:p-8">
            <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2" for="name">Name</label>
                <input 
                    v-model="name" 
                    type="text" 
                    id="name"
                    class="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    :class="{'border-red-500': errors.name}"
                    required
                />
                <p v-if="errors.name" class="mt-1 text-xs text-red-400">{{ errors.name[0] }}</p>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2" for="description">Beschreibung</label>
                <textarea 
                    v-model="description" 
                    id="description"
                    rows="4"
                    class="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                ></textarea>
            </div> 

            <div class="pt-2">
                <button 
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20"
                >
                    <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>{{ submitButtonText }}</span>
                </button>
            </div>
            </form>
        </div>
    </div>
  </div>
</template>