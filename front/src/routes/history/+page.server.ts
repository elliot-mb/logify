import { Spotify } from "$lib/../spotify";
import { exposesAppError } from "$lib/../utils";
import type { PageServerLoad } from "./$types";

//this fetch in the arguments is a fetch defined by svelte, for fetching to 
//relative endpoints
export const load: PageServerLoad = async ({fetch}) => { 

  const response: Response = await fetch('/api/access_token'); 
  const tkn: string | null = await response.json().then(r => r.access_token);

  return {
    token: tkn //token store is string or null
  }
}