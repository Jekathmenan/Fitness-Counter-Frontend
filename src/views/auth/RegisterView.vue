<script setup>
    import { handleError, ref } from 'vue';
    import apiClient from '@/api/client';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const form = ref({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        retypePassword: ''
    });

    const errors = ref({});

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
            hasError = true;
        }
        else if (!/[0-9]/.test(passwordValue)) {
            errors.value.password = "Passwort muss mindestens eine Zahl enthalten!";
            hasError = true;
        }

        // Prüfe Vorname
        if (form.value.firstname.trim().length === 0) {
            errors.value.firstname = "Vorname ist erforderlich!";
            hasError = true;
        }

        // Prüfe Nachname
        if (form.value.lastname.trim().length === 0) {
            errors.value.lastname = "Nachname ist erforderlich!";
            hasError = true;
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
                router.push({ name: 'login' });
            } 
            
        } catch (error) {
            if (error.response && error.response.data) {
                errors.value = error.response.data.errors;
            } else {
                console.error("Fehler beim Registrieren: ", error);
                errors.value.general = "Registrierung fehlgeschlagen.";
            }
            
        }
    };

</script>
<template>
    <div class="register-container">
        <form class="register-form" @submit.prevent="handleRegister">
            <h2 class="title">Konto erstellen</h2>
            <div class="form-group">
                <span class="form-label">
                    <label for="firstname">Vorname:</label>
                </span>
                <input name="firstname" v-model="form.firstname" type="text" placeholder="Vorname"/>
                <span v-if="errors.firstName" class="error-msg">
                    {{ errors.firstName }}
                </span>
            </div>
            <div class="form-group">
                <span class="form-label">

                    <label for="lastname">Nachname:</label>
                </span>
                <input name="lastname" v-model="form.lastname" type="text" placeholder="Nachname"/>
                <span v-if="errors.lastName" class="error-msg">
                    {{ errors.lastName }}
                </span>
            </div>
            <div class="form-group">
                <span class="form-label">
                    <label for="email">E-Mail:</label>
                </span>
                <input name="email" v-model="form.email" type="email" placeholder="E-Mail"/>
                <span v-if="errors.email" class="error-msg">
                    {{ errors.email }}
                </span>
            </div>
            <div class="form-group">
                <span class="form-label">

                    <label for="password">Passwort:</label>
                </span>
                <input name="password" v-model="form.password" type="password" placeholder="Passwort"/>
            </div>
            <div class="form-group">
                <span class="form-label">
                    <label for="retypePassword">Passwort wiederholen:</label>
                </span>
                <input name="retypePassword" v-model="form.retypePassword" type="password" placeholder="Passwort wiederholen"/>
                <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
            </div>
            <div class="form-group">
                <button class="register-submit" type="submit">Konto erstellen</button>
                <span v-if="errors.general" class="error-msg">{{ errors.general }}</span>
            </div>
        </form>
    </div>
</template>
<style lang="css" scoped>
    .title {
        font-size: 28px !important;
        width: 100%;
        margin-bottom: 5px;
        text-align: center;
    }

    .register-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50vh;
        margin: 60px 25px;
    }

    .register-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 50px;
        border-radius: 25px;
        border: 2px solid black;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        background-color: #F9F9F2;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 8px 18px;
    }

    .form-label {
        font-size: 15px !important;
        width: 100%;
        margin-bottom: 2px;
    }

    .form-label label {
        font-size: 15px !important;
    }

    .form-group input {
        font-size: 15px !important;
        border-radius: 8px;
        padding: 5px;
        width: 500px;
        text-align: center;
        border: 0.5px solid gray;
    }

    .register-submit {
        margin-top: 8px;
        width: 500px;
        border-radius: 25px;
        background-color: #2c3e50;
        padding: 8px;
        font-size: 15px !important;
        color: white;
        border: 1px solid white;
    }

    .register-submit:hover {
        margin-top: 8px;
        width: 500px;
        border-radius: 25px;
        background-color: beige ;
        
        border: 1px solid #2c3e50;
        color: #2c3e50;
    }

    .error-msg {
        color: white;
        background-color: #e97474;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 12px !important;
        margin-top: 5px;
        display: inline-block; /* Damit Padding korrekt wirkt */
    }
</style>