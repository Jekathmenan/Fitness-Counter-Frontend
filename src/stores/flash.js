import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFlashStore = defineStore ('flash', () => {
    const errorMessage = ref('');
    const status = ref('success');

    function setFlash (msg, type = 'success') {
        errorMessage.value = msg;
        status.value = type;
        setTimeout(() => errorMessage.value = '', 5000);
    }

    return {
        errorMessage,
        status,
        setFlash
    }
});