import { defineStore } from "pinia";
import { ref } from "vue";
import { apiFetch } from "../composables/useAPI";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  interface LoginPayload {
    email: string;
    password: string;
  }

  interface SignInPayload {
    email: string;
    password: string;
    username: string;
  }

  const login = async (payload: LoginPayload) => {
    const response = await apiFetch(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  };

  function logout() {
    localStorage.setItem("isAuthenticated", "false");
  }

  return {
    isAuthenticated,
    login,
    logout,
  };
});
