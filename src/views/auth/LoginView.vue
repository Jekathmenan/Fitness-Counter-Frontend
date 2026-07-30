<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const handleLogin = async () => {
        try {
            errorMessage.value = '';

            await authStore.login({
                email: email.value,
                password: password.value
            });

            router.push({ name: 'dashboard' });

        } catch (error) {
            console.error(error);
            errorMessage.value = "Login fehlgeschlagen. Bitte Daten prüfen.";
        }

        
    }

</script>
<template>
    <div class="login-container">
        
        <form class="login-form" @submit.prevent="handleLogin">
            <h2 class="title">Anmelden</h2> 
            <div class="form-field">
                
                <label class="form-label" for="email">E-Mail</label>
                <input name="email" v-model="email" type="email" placeholder="E-Mail" required />
            </div>
            <div class="form-field">
                <label class="form-label" for="password">Passwort</label>
                <input name="password" v-model="password" type="password" placeholder="Passwort" required />
            </div>
            <button class="login-submit" type="submit">Login</button>
        </form>
        <p v-if="errorMessage" class="error"> {{ errorMessage }}</p>
    </div>
</template>
<style lang="css" scoped>
</style>