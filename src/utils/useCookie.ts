// utils/cookie.ts

export function getToken(): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export function setToken(token: string, maxAgeDays: number = 1): void {
  const maxAge = maxAgeDays * 24 * 60 * 60; // Convert days to seconds
  document.cookie = `token=${token}; path=/; max-age=${maxAge}`;
}

export function removeToken(): void {
  document.cookie = `token=; path=/; max-age=0`;
}