import { writable } from "svelte/store";

const KEY = 'auth_token';

const storedToken = localStorage.getItem(KEY);

export const token = writable<string | null>(storedToken);

export function setToken(newToken: string | null): void {
  localStorage.setItem(KEY, newToken);
  token.set(newToken);
}

export function dropToken(): void {
  localStorage.removeItem(KEY);
  token.set(null);
}
