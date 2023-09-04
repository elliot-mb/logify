import type { RequestHandler } from "@sveltejs/kit";
import { Spotify } from "$lib/../spotify";
import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";

export const GET: RequestHandler = async ({ cookies }) => {
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

  if(cookies.get('access_token')) 
    return new Response(JSON.stringify({access_token: cookies.get('access_token')}));

  return new Response(JSON.stringify({access_token: null}));
}