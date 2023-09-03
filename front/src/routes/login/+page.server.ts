import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_BASE_AUTH_URI, PUBLIC_BASE_TKN_URI, PUBLIC_GRANT_TYPE, PUBLIC_REDIRECT_URI, PUBLIC_SCOPE } from "$env/static/public";
import { error, redirect, type Cookies } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Spotify } from "$lib/../spotify";

export const load: PageServerLoad = async ({cookies, url}) => {

  const p: URLSearchParams = url.searchParams;
  const readParams: {[x: string]: string | null} = {
    code: p.get('code'),
    state: p.get('state'),
    err: p.get('error')
  }

  if(readParams.err !== null){
    throw error(500, {
      status: 500,
      message: readParams.err
    })
  }

  /**
   * We redirect to the authentication page automatically when we are not 
   * returning from it.
   */
  if(readParams.code === null || readParams.state === null) 
  {
    if(cookies.get('state') === undefined) 
      cookies.set('state', Spotify.Auth.getRandomState(), {path: '/login'});

    const redirectParams: {[x: string]: string} = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: PUBLIC_SCOPE,
      redirect_uri: PUBLIC_REDIRECT_URI,
      state: cookies.get('state')!
    };

    const redirectURI: string = PUBLIC_BASE_AUTH_URI + new URLSearchParams(redirectParams).toString();
    // When we dont have the appropriate query parameters, we just assume we 
    // still need to authenticate.
    throw redirect(307, redirectURI);
  }
  else if(readParams.state !== cookies.get('state'))
  {
    throw error(403, {
      status: 403,
      message: "State mismatch"
    })
  } 
  else //they are both defined, the state is consistent, and no error occurred
  {
    
    const resp: Spotify.AuthResponse = await Spotify.Auth.codeToToken(readParams.code, CLIENT_ID, CLIENT_SECRET);
    console.log(resp, resp.refresh_token);
    cookies.set('access_token', resp.access_token, {path: '/', maxAge: resp.expires_in});
    cookies.set('token_type', resp.token_type, {path:'/'});
    cookies.set('scope', resp.scope, {path: '/'});
    cookies.set('expires_at', `${Spotify.Auth.toExpiryDate(resp.expires_in)}`, {path: '/'});
    if(resp.refresh_token) cookies.set('refresh_token', resp.refresh_token, {path: '/'});
  }

  /**
   * If no errors were thrown go back home
   */
  throw redirect(307, '/');
};