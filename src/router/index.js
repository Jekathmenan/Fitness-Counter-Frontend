import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/auth';

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: () => import("@/views/HomeView.vue"),
  },
  { 
    path: '/core-data', 
    name: 'coreData', 
    component: () => import("@/views/core_data/Overview.vue"),
  },
  { 
    path: '/core-data/body-parts', 
    name: 'coreData.bodyParts', 
    component: () => import("@/views/core_data/BodyPartsView.vue"),
  },
  { 
    path: '/core-data/body-parts/add', 
    name: 'coreData.bodyParts.add', 
    component: () => import("@/views/core_data/BodyPartsForm.vue"),
  },
  { 
    path: '/core-data/body-parts/edit/:id', 
    name: 'coreData.bodyParts.edit', 
    component: () => import("@/views/core_data/BodyPartsForm.vue"),
  },
  { 
    path: '/core-data/exercises', 
    name: 'coreData.exercises', 
    component: () => import("@/views/core_data/ExercisesView.vue"),
  },
  { 
    path: '/core-data/exercises/add', 
    name: 'coreData.exercises.add', 
    component: () => import("@/views/core_data/ExercisesForm.vue"),
  },
  { 
    path: '/core-data/exercises/edit/:id', 
    name: 'coreData.exercises.edit', 
    component: () => import("@/views/core_data/ExercisesForm.vue"),
  },
  { 
    path: '/login', 
    name: 'login', 
    component: () => import("@/views/auth/LoginView.vue"),

  },
  { 
    path: '/register', 
    name: 'register', 
    component: () => import("@/views/auth/RegisterView.vue"),
  },
  { 
    path: '/forgot-password', 
    name: 'forgotPassword', 
    component: () => import("@/views/auth/ForgotPasswordView.vue"),
  },
  { 
    path: '/workout', 
    name: 'workout', 
    component: () => import("@/views/auth/WorkoutView.vue"),
  },
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})

// Router Guard --> Alle routes ausser 
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  const publicPages = ['home', 'login', 'register'];
  const authRequired = !publicPages.includes(to.name);

  if (authRequired && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } 

  return true;
});

export default router;