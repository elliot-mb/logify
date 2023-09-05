import { Spotify } from "$lib/../spotify";
import { Utils } from "$lib/../utils";
import type { PageServerLoad } from "./$types";

//this fetch in the arguments is a fetch defined by svelte, for fetching to 
//relative endpoints
export const load: PageServerLoad = async ({fetch}) => { 

  const response: Response = await fetch('/api/access_token'); 
  const tkn: string | null = await response.json().then(r => r.access_token);

  /**
   * Fetching specific data happens inside page.server.ts (or in a page.ts) 
   * because we need this data to render the page properly, it stops unecessary
   * flickering or loading.
   */  
  let err: App.Error | null = null;
  let user: Spotify.User | null = null;

  if(tkn !== null){
    const userOrError: Spotify.User | App.Error = await Spotify.Get.userProfile(tkn)
    .catch(e => <App.Error> ({status: e.status, message: e.body.message}));
    if(Utils.exposesAppError(userOrError)){
      err = <App.Error> userOrError;
    }else{
      user = <Spotify.User> userOrError;
    }
  }

  return {
    token: tkn,
    user: user,
    err: err
  }
}