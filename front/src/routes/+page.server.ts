import { Spotify } from "../spotify";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
  
  const tkn: string | undefined = cookies.get('access_token')
  const isLoggedIn: boolean = tkn !== undefined;
  let err: App.Error | null = null;
  let user: Spotify.User | null = null;

  if(isLoggedIn){

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
    isLoggedIn: isLoggedIn,
    user: user, //can be null
    err: err
  }
}