import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue";

const routes = [
    { path: '/', component: LoginView},
    { path: '/login', component: LoginView},
    { path: '/register', component: LoginView} 
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})

export default router;