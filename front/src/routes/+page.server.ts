import { Spotify } from "../spotify";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
  
  const tkn: string | undefined = cookies.get('access_token');
  let err: App.Error | null = null;
  let user: Spotify.User | null = null;

  if(tkn !== undefined){

    const userOrErr: Spotify.User | App.Error = await Spotify.Get.userProfile(tkn!)
    .catch(err => ({status: err.status, message: err.body.message}))

    if(userOrErr.hasOwnProperty('display_name')){
      user = userOrErr as Spotify.User;
      err = null;
    }else{
      err = userOrErr as App.Error;
      err.message = err.message + tkn
      user = null;
    }
  }

  return {
    token: tkn ?? null, //token store is string or null
    isLoggedIn: tkn !== undefined,
    user: user, //can be null
    err: err //can be null
  }
}