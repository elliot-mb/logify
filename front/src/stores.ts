import { writable, type Writable } from "svelte/store";
import type { Spotify } from "$lib/../spotify";
// This is stored as a cookie to /login
// export const state: Writable<string> = writable('undefined');

export const token: Writable<string | null> = writable(null);

//current track
export const track: Writable<Spotify.Track | null> = writable(null);