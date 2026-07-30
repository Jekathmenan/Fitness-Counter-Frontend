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
    <div>
        
    </div>
</template>
<style lang="css" scoped>
</style>