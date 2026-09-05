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
    component: () => import("@/views/workout/WorkoutView.vue"),
  },
  { 
    // TODO: Find a more matching route name
    path: '/workout/edit', 
    name: 'workout.edit', 
    component: () => import("@/views/workout/WorkoutForm.vue"),
  },
  {
    path: '/workout/view/:id', 
    name: 'workout.view', 
    component: () => import("@/views/workout/WorkoutForm.vue"),
  }
]

const router = createRouter ({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  
  const publicPages = ['home', 'login', 'register', 'forgotPassword'];
  const isPublicPage = publicPages.includes(to.name);
  const isAuthenticated = authStore.isAuthenticated;

  // Leite zu login weiter, wenn Zielseite Login erfordert und Benutzer nicht eingeloggt ist.
  if (!isPublicPage && !isAuthenticated) {
    return { name: 'login' };
  }

  // Verbiete guestOnly Routes wenn eingeloggt
  if (isPublicPage && isAuthenticated) {
    return { name: 'workout' };
  }

  return true;
});

export default router;