import HomePage from "@/pages/index.vue";
import Login from "@/pages/auth/login.vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getToken } from "@/utils/useCookie";


const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { requiresAuth: true  },
    
  },
  { path: "/auth/login", name: "login", component: Login,},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global middleware
router.beforeEach((to, from, next) => {
  const token=getToken();
  if (to.meta.requiresAuth && !token) {
    next({ name: "login" });
  } else if (to.name === "login" && token) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
