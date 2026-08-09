import apiClient from '@/api/client';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials) {
            try {
                const response = await apiClient.post('auth/login', credentials);

                const token = response.data.token;

                // Token im State und localStorage speichern
                this.token = token;
                localStorage.setItem('token', token);
                return response.data;
            } catch (error) {
                throw error;
            }
        },
        logout() {
            this.token = null;
            localStorage.removeItem('token');
        }
    }
});