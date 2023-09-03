import { PUBLIC_BASE_API, PUBLIC_BASE_TKN_URI, PUBLIC_GRANT_TYPE, PUBLIC_REDIRECT_URI } from "$env/static/public";
import { error } from "@sveltejs/kit";

export namespace Spotify{

  export type AuthResponse = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  export type User = {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
      filter_enabled: boolean;
      filter_locked: boolean;
    };
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    images: [{
      url: string;
      height: number;
      width: number;
    }];
    product: string;
    type: string;
    uri: string;
  };

  export type ImageObject = {
    url: string;
    height: number;
    width: number;
  }

  export type Track = {
    is_playing: boolean;
    artists: string[] | null;
    album: string | null;
    name: string | null;
    popularity: number | null;
    url: string | null;
    fetch_in: number | null; // how long do we wait to fetch the next track
  }

  export const TRACK_REFRESH = 60000; //check again soon (10 seconds)

  export class Auth {

    /**
     * Converts the code fetched from OAuth to an access token via server-to-
     * server authentication request. 
     * @param code received from OAuth
     * @param clientID loaded in serverside function
     * @param clientSecret loaded in serverside function 
     * @returns 
     */
    public static readonly codeToToken: {(code: string, clientID: string, clientSecret: string): Promise<AuthResponse>} 
      = async (code, clientID, clientSecret): Promise<AuthResponse> => {

      const urlAndParams: string = PUBLIC_BASE_TKN_URI; 

      const authOptions = {
        method: 'POST',
        url: urlAndParams,
        body: new URLSearchParams({ 
          code: code, 
          redirect_uri: PUBLIC_REDIRECT_URI,
          grant_type: PUBLIC_GRANT_TYPE
        }),
        headers: {
          'Authorization': 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true
      }

      const respOrErr: Spotify.AuthResponse | App.Error = await fetch(urlAndParams, authOptions)
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
      
      //we've not thrown from an error so we can be sure this is an authresponse
      return <Spotify.AuthResponse> respOrErr;
    }
  }

  /**
   * All the getters used in the app
   */
  export class Get {
    public static readonly userProfile: {(token: string): Promise<User>} = async (token): Promise<User> => {

      const endpt: string = `${PUBLIC_BASE_API}/me`;

      const opts = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      return fetch(endpt, opts).then(r => {
        if(r.ok){
          return r.json() as Promise<User>;
        }else{
          throw error(r.status, {
            status: r.status,
            message: r.statusText
          })
        }
      });
    }

    public static readonly nowPlaying: {(token: string): Promise<Track>} = async (token): Promise<Track> => {

      const endpt: string = `${PUBLIC_BASE_API}/me/player/currently-playing`;
      // + `?${new URLSearchParams({
      //   //market: '' not needed with token,
      //   //additional_types 
      // })}`;

      const opts = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const r: Response = await fetch(endpt, opts);
      
      if(!r.ok){
        throw error(r.status, {
          status: r.status,
          message: r.statusText
        })
      }
      if(r.status === 204){ //exactly when there is no body so we dont try to parse it
        return <Track> {
          is_playing: false,
          artists: null, 
          album: null,
          name: null,
          popularity: null,
          url: null,
          fetch_in: null
        };
      }

      const resp = await r.json();
      const play: boolean = resp.is_playing;
      const current = play ? resp.item : null;
      let result: Track = {
        is_playing: play,
        artists: play ? current.artists.map(({name}: {name: string}) => name) : null,
        album: play ? current.album.name : null,
        name: play ? current.name : null,
        popularity: play ? current.popularity : null,
        url: play ? current.external_urls.spotify : null,
        fetch_in: play ? current.duration_ms - resp.progress_ms : null
      };

      return result;
    }
  }
}