import HomePage from '@/pages/index.vue'
import Login from '@/pages/auth/login.vue'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'


const routes = [
  { path: '/', component:HomePage  },
  { path: '/auth/login', component: Login },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})