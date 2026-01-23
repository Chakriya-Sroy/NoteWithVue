import { defineStore } from "pinia";
import { ref } from "vue";


export const useAuthStore=defineStore('auth',()=>{
  const isAuthenticated = localStorage.getItem('isAuthenticated') ==='true';

  function login() {
    localStorage.setItem('isAuthenticated', 'true');
  }

  function logout() {
    localStorage.setItem('isAuthenticated', 'false');
  }

  return {
    isAuthenticated,
    login,
    logout,
  };
});