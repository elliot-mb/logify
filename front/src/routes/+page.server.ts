import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { Spotify } from "../spotify";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {

  const refresh = cookies.get('refresh_token');
  const expires = cookies.get('expires_at');

  if(refresh !== undefined && expires !== undefined){

    const resp: Spotify.AuthResponse | null = 
      await Spotify.Auth.refreshIfExpiresSoon(
        refresh, 
        new Date(decodeURIComponent(expires)), 
        CLIENT_ID, 
        CLIENT_SECRET);
  
    if(resp !== null){
      cookies.set('access_token', resp.access_token, {path: '/', maxAge: resp.expires_in});
      cookies.set('token_type', resp.token_type, {path:'/'});
      cookies.set('scope', resp.scope, {path: '/'});
      cookies.set('expires_at', `${Spotify.Auth.toExpiryDate(resp.expires_in)}`, {path: '/'});
      if(resp.refresh_token) cookies.set('refresh_token', resp.refresh_token, {path: '/'}); //not guarenteed to be defined
    }
  }

  const tkn: string | undefined = cookies.get('access_token');
  const expDate: Date | null = cookies.get('expires_at') !== undefined 
    ? new Date(decodeURIComponent(cookies.get('expires_at')!)) 
    : null;
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
    //written to client stores
    token: tkn ?? null, //token store is string or null
    expiresAt: expDate,
    isLoggedIn: tkn !== undefined,
    user: user, //can be null

    err: err //can be null
  }
}