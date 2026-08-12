<script setup>
  // imports
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useFlashStore } from '@/stores/flash';
  import { useRouter } from 'vue-router';
  import { Eye, EyeOff } from 'icons';

  const authStore = useAuthStore();
  const flashStore = useFlashStore();
  const router = useRouter();

  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const errors= ref({});
  const showPassword = ref(false);

  // handleLogin
  const handleLogin = async () => {
    try {
      //Login
      loading.value = true;
      errors.value = {};

      await authStore.login({
        email: email.value,
        password: password.value
      });

      // TODO: Find Users information and show Flashmessage welcoming User
      flashStore.setFlash("Erfolgreich angemeldet.", "info");
      // Redirect to Dashboard
      router.push({
        name: 'dashboard'
      });
    } catch (error)
    {      
      if (error.response && error.response.data) {
        errors.value = error.response.data.errors;
      } else {
        // log and show FlashMessage
        console.error(error);
        flashStore.setFlash("Login fehlgeschlagen. Bitte Admin kontaktieren", "error")
      }
      
    } finally {
      loading.value = false;
    }
  }
</script>
<template>
  <div class="min-h-[650px] flex items-center justify-center">
    
    <div class="max-w-md w-full bg-gray-800 rounded-2xl m-8 shadow-xl shadow-gray-700 p-[25px]">
      
      <!-- Header -->
      <div class="text-center mt-8 mb-8">
        <h2 class="text-3xl font-bold text-white">Willkommen</h2>
        <p class="text-white mt-2">Bitte loggen Sie sich ein</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- E-Mail Feld -->
        <div>
          <label class="block text-sm font-medium text-white mb-1" for="email">E-Mail Adresse</label>
          <input 
            v-model="email"
            type="email" 
            placeholder="name@beispiel.de"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
            required
          />
          <span v-if="errors.email" class="mt-2 text-sm text-red-600">
            {{ errors.email }}
          </span>
        </div>

        <!-- Passwort Feld -->
        <div>
            <label class="block text-sm font-medium text-white mb-1" for="password">Passwort</label>
            <div class="relative">
                <input 
                    aria-describedby="email-error"    
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="••••••••"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-20"
                    required
                />
                <button type="button" class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-400 transition"
                    @click="showPassword = !showPassword"
                >
                    <Eye v-if="!showPassword" class="w-5 h-5" />  
                    <EyeOff v-else class="w-5 h-5" />
                </button>
            </div>
            
            <span v-if="errors.password" 
            class="mt-2 text-sm text-red-600"
            >
            {{ errors.password }}
            </span>
            <div class="text-right mt-2">
            <a href="#" class="text-sm text-blue-600 hover:underline">Passwort vergessen?</a>
            </div>
        </div>
        

        <!-- Login Button -->
        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 transform active:scale-95 disabled:opacity-50"
        >
          <span v-if="loading">Lädt...</span>
          <span v-else>Anmelden</span>
        </button>

      </form>

      <!-- Footer -->
      <p class="text-center text-white mt-8">
        Noch kein Konto? 
        <a href="#" class="text-blue-600 font-bold hover:underline">Registrieren</a>
      </p>

    </div>
  </div>
</template>
