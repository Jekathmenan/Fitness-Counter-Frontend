<script setup>
    import { ref } from 'vue';
    import apiClient from '@/api/client';
    import { useRouter } from 'vue-router';
    import { useFlashStore } from '@/stores/flash';
    import { Eye, EyeOff } from 'icons';

    const router = useRouter();
    const flashStore = useFlashStore();

    const form = ref({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        retypePassword: ''
    });

    const showPassword = ref(false);
    const showRetypePassword = ref(false);

    const errors = ref({});
    const flashStatus = ref('');

    const validateInputs = () =>  {
        let error = false;

        const passwordValue = form.value.password;

        if (passwordValue !== form.value.retypePassword) {
            errors.value.password = "Passwörter stimmen nicht überein!";
            error = true;
        }

        // Prüfe Passworteingabe 
        if (passwordValue.length <= 8) {
            errors.value.password = "Passwort ist zu kurz!";
            error = true;
        }
        else if (!/[A-Z]/.test(passwordValue) || !/[a-z]/.test(passwordValue)) {
            errors.value.password = "Passwort muss Gross- und Kleinbuchstaben enthalten!";
            error = true;
        }
        else if (!/[0-9]/.test(passwordValue)) {
            errors.value.password = "Passwort muss mindestens eine Zahl enthalten!";
            error = true;
        }

        // Prüfe Vorname
        if (form.value.firstname.trim().length === 0) {
            errors.value.firstname = "Vorname ist erforderlich!";
            error = true;
        }

        // Prüfe Nachname
        if (form.value.lastname.trim().length === 0) {
            errors.value.lastname = "Nachname ist erforderlich!";
            error = true;
        }

        return error;
    };

    const handleRegister = async () => {
        

        try {
            errors.value = {};
            // validate and cleanup Input
            if (validateInputs()) {
                return;
            }

            const requestData = {
                firstName: form.value.firstname,
                lastName: form.value.lastname,
                email: form.value.email,
                password: form.value.password,
                retypePassword: form.value.retypePassword
            };

            // register User
            const response = await apiClient.post('auth/register', requestData);
           
            // Redirect User to login page if Registration successful
            if (response.status === 201) {
                flashStore.setFlash("Konto erfolgreich erstellt.", "success");
                router.push({ name: 'login' });
            } 
            
        } catch (error) {
            if (error.response && error.response.data) {
                errors.value = error.response.data.errors;
            } else {
                // Log error and show Flash message
                console.error(error);
                flashStore.setFlash("Registrierung fehlgeschlagen. Bitte Admin kontaktieren.", "error");
            }
            
        }
    };

</script>
<template>
    <div class="min-h-[650px] flex flex-center justify-center">
        <div class="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl shadow-gray-700 p-[25px]">
            <div class="text-center mt-4 mb-4">
                <h2 class="text-3xl font-bold text-white">Konto erstellen</h2>
                <p class="text-white mt-2">Erstellen sie ein neues Konto</p>
            </div>
            <form 
                class="space-y-6" 
                @submit.prevent="handleRegister"
            >
                <div>
                    <label class="block text-sm font-medium text-white mb-1" 
                        for="firstname"
                    >
                        Vorname
                    </label>
                    <input name="firstname" 
                        v-model="form.firstname" type="text" placeholder="Vorname"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
                        required
                    />
                    <span v-if="errors.firstname" class="mt-2 text-sm text-red-600">
                        {{ errors.firstName }}
                    </span>
                </div>
                <div class="form-group">

                    <label class="block text-sm font-medium text-white mb-1"  for="lastname">Nachname</label>
                    <input name="lastname" v-model="form.lastname" type="text" 
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"    
                    placeholder="Nachname"/>
                    <span v-if="errors.lastname" class="mt-2 text-sm text-red-600">
                        {{ errors.lastName }}
                    </span>
                </div>
                <div class="form-group">
                    <label class="block text-sm font-medium text-white mb-1" for="email">E-Mail</label>
                    <input name="email" v-model="form.email" 
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition"
                        type="email" placeholder="E-Mail"/>
                    <span v-if="errors.email" class="mt-2 text-sm text-red-600">
                        {{ errors.email }}
                    </span>
                </div>
                <div class="form-group">

                    <label class="block text-sm font-medium text-white mb-1" for="password">
                        Passwort
                    </label>
                    <div class="relative">
                        <input name="password" v-model="form.password" 
                            class="w-full px-4 py-3 rounded-lg border border-gray-300  bg-gray-700 text-white
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-20"
                            :type="showPassword ? 'text' : 'password'" placeholder="Passwort"/>
                        <button type="submit" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-400 transition">
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeOff v-else class="w-5 h-5" />
                        </button>
                    </div>
                    
                </div>
                <div class="form-group">
                    <label class="block text-sm font-medium text-white mb-1" for="retypePassword">
                            Passwort wiederholen
                    </label>
                    <div class="relative">
                        <input name="retypePassword" v-model="form.retypePassword" 
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none transition pr-20" :type="showRetypePassword ? 'text' : 'password'" placeholder="Passwort wiederholen"/>
                        <button
                        type="button"
                        @click="showRetypePassword = !showRetypePassword"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-400 transition"
                        >
                        <Eye v-if="!showRetypePassword" class="w-5 h-5" />
                        <EyeOff v-else class="w-5 h-5" />
                        <!-- {{ showRetypePassword ? 'Verbergen' : 'Anzeigen' }} -->
                        </button>
                    </div>
                    
                    <span v-if="errors.password" class="mt-2 text-sm text-red-600">
                        {{ errors.password }}
                    </span>
                </div>
                <div class="form-group">
                    <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 transform active:scale-95 disabled:opacity-50" type="submit">
                        Konto erstellen

                    </button>
                    <span v-if="errors.general" class="mt-2 text-sm text-red-600">
                        {{ errors.general }}
                    </span>
                </div>
            </form>
            <p class="text-center text-white mt-8">
                Konto vorhanden?
                <a href="#" class="text-blue-600 font-bold hover:underline">Anmelden</a>
            </p>
        </div>
    </div>
</template>
