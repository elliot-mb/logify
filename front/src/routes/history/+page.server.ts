import { Spotify } from "$lib/../spotify";
import { exposesAppError } from "$lib/../utils";
import type { PageServerLoad } from "./$types";

//this fetch in the arguments is a fetch defined by svelte, for fetching to 
//relative endpoints
export const load: PageServerLoad = async ({fetch}) => { 

  const response: Response = await fetch('/api/access_token'); 
  const tkn: string | null = await response.json().then(r => r.access_token);


  let err: App.Error | null = null;
  let history: Spotify.PlayHistory[] | null = null;

  if(tkn !== null){
    const historyOrError: Spotify.PlayHistory[] | App.Error = 
    await Spotify.Get.recentlyPlayed(tkn)(50)
    .catch(e => <App.Error> ({status: e.status, message: e.body.message}));
    if(exposesAppError(historyOrError)){
      err = <App.Error> historyOrError;
    }else{
      history = <Spotify.PlayHistory[]> historyOrError;
    }
  }

  return {
    token: tkn, //token store is string or null
    history: history,
    err: err
  }
}