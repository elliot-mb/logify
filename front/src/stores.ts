import { writable, type Writable } from "svelte/store";
// This is stored as a cookie to /login
// export const state: Writable<string> = writable('undefined');

export const token: Writable<string | null> = writable(null);