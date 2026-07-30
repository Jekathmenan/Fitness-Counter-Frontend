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
    .title {
        margin-bottom: 5px;
        font-size: 28px !important;
    }

    .login-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50vh;
        margin: 60px 25px;
        
    }

    .login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 70px;
        border-radius: 25px;
        border: 2px solid black; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        background-color: #F9F9F2; 
    }

    .form-field {
        margin: 5px 18px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .form-label {
        font-size: 15px !important;
        width: 100%;
        margin-bottom: 2px;
    }

    .form-field input {
        font-size: 15px !important;
        border-radius: 8px;
        padding: 5px;
        width: 500px;
        text-align: center;
        border: 1px solid #2c3e50;
    }

    .login-submit {
        margin-top: 8px;
        width: 500px;
        border-radius: 25px;
        background-color: #2c3e50;
        padding: 5px;
        color: white;
        border: 1px solid white;
    }

    .login-submit:hover {
        margin-top: 8px;
        width: 500px;
        border-radius: 25px;
        background-color: beige ;
        padding: 5px;
        border: 1px solid #2c3e50;
        color: #2c3e50;
    }

    .error { 
        color: red; margin-top: 10px; 
        width: 400px;
        padding: 4px 120px;
        text-align: center;
        border-radius: 25px;
        
        background-color: rgb(233, 116, 116);
    }

</style>