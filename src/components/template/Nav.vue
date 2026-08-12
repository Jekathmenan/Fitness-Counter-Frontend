<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { useFlashStore } from '@/stores/flash';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const flashStore = useFlashStore();
  const router = useRouter();

 const handleLogout = () => {
  authStore.logout();
  flashStore.setFlash('Erfolgreich abgemeldet', 'info');
  router.push( { name: 'home' });
 };

</script>
<template>
    <nav class="px-[40px] py-[15px] flex place-content-between items-center">
      <div>
        <router-link v-if="!authStore.isAuthenticated" 
          class="inline-block hover:scale-110 mr-[40px] text-white text-lg border-b-2 border-transparent transition-all" 
          active-class="!text-white !border-white"
          to="/"
        >
          Home
        </router-link>
        <router-link v-if="authStore.isAuthenticated" 
          class="inline-block hover:scale-110 mr-[40px] text-white text-lg border-b-2 border-transparent transition-all" 
          exact-active-class="!text-white !border-white"
          to="/dashboard">
          Mein Training
        </router-link>
        <router-link v-if="authStore.isAuthenticated" 
          class="inline-block hover:scale-110 mr-[40px] text-white text-lg border-b-2 border-transparent transition-all" 
          exact-active-class="!text-white !border-white"
          to="/core-data">
          Stammdaten
        </router-link>
      </div>
      <div>
        <template v-if="!authStore.isAuthenticated">
          <router-link 
            class="inline-block font-semibold text-base border-b-3 border-transparent bg-white px-4 py-1.5 rounded-full text-gray-900 mx-3 transform transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white" 
            active-class="!border-gray-300 !bg-gray-800 !text-white"
            to="/login"
          >
            Anmelden
          </router-link>
          <router-link 
            class="inline-block font-semibold text-base  border-b-2  border-transparent bg-white px-4 py-1.5 rounded-full hover:scale-105 text-gray-900 hover:bg-gray-800 hover:text-white mx-3" 
            active-class="!border-gray-300 !bg-gray-800 !text-white"
            to="/register"
          >
            Konto erstellen
          </router-link>
        </template>
        <template v-else>
          <a class="inline-block font-semibold text-base bg-white px-4 py-1.5 rounded-full hover:scale-105 text-gray-900 hover:bg-gray-800 hover:text-white mx-3" @click.prevent="handleLogout">
            Abmelden
          </a>
        </template>
      </div>
    </nav>
</template>