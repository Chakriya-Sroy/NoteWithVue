import { defineStore } from "pinia";
import { ref } from "vue";
import { apiFetch } from "../composables/useAPI";
import { removeToken } from "@/utils/useCookie";
import type { User } from "@/types";

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
    confirm_password:string;
  }

  const user = ref<User>();

  const login = async (payload: LoginPayload) => {
    const response = await apiFetch(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  };

  
  const signin=async(payload:SignInPayload)=>{
    const response = await apiFetch(`/auth/signin`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  }

  const logout = () => {
    removeToken();
  };

  const getProfile = async () => {
    const response = await apiFetch("/profile", {
      method: "GET",
    });
    return response;
  };

  return {
    user,
    isAuthenticated,
    signin,
    login,
    logout,
    getProfile
  };
});
