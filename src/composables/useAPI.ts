import { getToken, removeToken } from "@/utils/useCookie";

const setHeader = (options: RequestInit = {}): HeadersInit => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const api = import.meta.env.VITE_API_URL;

  const response = await fetch(`${api}${path}`, {
    ...options,
    headers: setHeader(options),
  });

  const res = await response.json();

  if (!response.ok) {
    if (res?.status?.code === 401) {
      const token = getToken();
      if (token) {
        removeToken();
      }
    }
    // throw new Error(res?.status?.message || "API request failed");
  }

  return res as Promise<T>;
};
