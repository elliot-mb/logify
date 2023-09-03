import { writable, type Writable } from "svelte/store";
import type { Spotify } from "./spotify";
// This is stored as a cookie to /login
// export const state: Writable<string> = writable('undefined');

export const token: Writable<string | null> = writable(null);

export const loggedIn: Writable<boolean> = writable(false);

export const userInfo: Writable<Spotify.User | null> = writable(null);

export const expiresAt: Writable<Date | null> = writable(null);