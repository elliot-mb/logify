import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_BASE_AUTH_URI, PUBLIC_BASE_TKN_URI, PUBLIC_GRANT_TYPE, PUBLIC_REDIRECT_URI, PUBLIC_SCOPE } from "$env/static/public";
import { Utils } from "$lib/../utils";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type SpotifyResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

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
   * We redirect to the authentication page automatically when we are not return
   * -ing from it.
   */
  if(readParams.code === null || readParams.state === null) 
  {
    if(cookies.get('state') === undefined) 
      cookies.set('state', Utils.Auth.getRandomState(), {path: '/login'});

    const redirectParams: {[x: string]: string} = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: PUBLIC_SCOPE,
      redirect_uri: PUBLIC_REDIRECT_URI,
      state: cookies.get('state')!
    };

    const redirectURI: string = PUBLIC_BASE_AUTH_URI + new URLSearchParams(redirectParams).toString();

    console.log(redirectURI);

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
    //scopes 
    const urlAndParams: string = PUBLIC_BASE_TKN_URI; 

    const authOptions = {
      method: 'POST',
      url: urlAndParams,
      body: new URLSearchParams({ //GOOD RIDDANCE 'form' !
        code: readParams.code, 
        redirect_uri: PUBLIC_REDIRECT_URI,
        grant_type: PUBLIC_GRANT_TYPE
      }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
        //'Accept': 'application/json'
      },
      json: true
    }
    console.log(authOptions);

    const respOrErr: SpotifyResponse | App.Error = await fetch(urlAndParams, authOptions)
    .then(r => {
      if(!r.ok){
        throw error(r.status, {
          status: r.status,
          message: r.statusText === undefined ? 'unknown' : r.statusText
        })
      }
      return r.json();
    })
    .catch((err) => { 
      console.log(`error ${err}`);
      return <App.Error> {
        status: err.status,
        message: err.message
      }
    })
    
    if(!respOrErr.hasOwnProperty('access_token')){
      const err: App.Error = <App.Error> respOrErr;
      throw error(err.status, {
        status: err.status,
        message: err.message
      })
    }
    
    const resp: SpotifyResponse = <SpotifyResponse> respOrErr;
    
    cookies.set('access_token', resp.access_token, {path: '/'});
    cookies.set('token_type', resp.token_type, {path:'/'});
    cookies.set('scope', resp.scope, {path: '/'});
    cookies.set('expires_in', `${resp.expires_in}`, {path: '/'});
    cookies.set('refresh_token', resp.refresh_token, {path: '/'});
  }

  /**
   * If no errors were thrown go back home
   */
  throw redirect(307, '/');
};