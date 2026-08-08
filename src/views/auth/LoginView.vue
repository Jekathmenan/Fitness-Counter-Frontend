<script setup>
  // imports
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const loading = ref(false);

  // handleLogin
  const handleLogin = async () => {
    try {
      //Login
      errorMessage.value = '';
      loading.value = true;

      await authStore.login({
        email: email.value,
        password: password.value
      });

      // Redirect to Dashboard
      router.push({
        name: 'dashboard'
      });
    } catch (error) {
      // Handle Errors
      console.error(error);
      errorMessage.value = "Login fehlgeschlagen. Bitte Daten prüfen!";
    } finally {
      loading.value = false;
    }
  }
</script>
<template>
  <div class="min-h-[650px] flex items-center justify-center">
    
    <div class="login-cards b max-w-md w-full bg-gray-800 rounded-2xl m-8 shadow-xl shadow-gray-700 p-[25px]">
      
      <!-- Header -->
      <div class="text-center mt-8 mb-8">
        <h2 class="text-3xl font-bold text-white">Willkommen</h2>
        <p class="text-white mt-2">Bitte loggen Sie sich ein</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- E-Mail Feld -->
        <div>
          <label class="block text-sm font-medium text-white mb-1">E-Mail Adresse</label>
          <input 
            v-model="email"
            type="email" 
            placeholder="name@beispiel.de"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
            required
          />
        </div>

        <!-- Passwort Feld -->
        <div>
          <label class="block text-sm font-medium text-white mb-1">Passwort</label>
          <input 
            v-model="password"
            type="password" 
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
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
