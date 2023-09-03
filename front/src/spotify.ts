import { PUBLIC_BASE_API, PUBLIC_BASE_TKN_URI, PUBLIC_GRANT_TYPE, PUBLIC_REDIRECT_URI } from "$env/static/public";
import { error } from "@sveltejs/kit";

export namespace Spotify{

  export type AuthResponse = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string | undefined;
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

  export const SECOND_MS = 1000; //ms
  export const TRACK_REFRESH_MS = 60 * SECOND_MS; //check again soon 
  const REFRESH_PADDING: number = 600;// how long before expiry do we refresh (600seconds)

  export class Auth {

    /**
     * roll date forward by this number of seconds
     */
    public static readonly rollDate: {(d: Date, seconds: number): Date} = (d, seconds): Date => {
      return new Date(d.getTime() + seconds * SECOND_MS);
    }

    public static readonly makeAuthorization: {(clientID: string, clientSecret: string): string} = (clientID, clientSecret): string => {
      return 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64');
    }

    /**
     * Gets a quite secure set of 16 random characters for use as state
     */
    public static readonly getRandomState: {(): string} = (): string => {
      const buf = new Uint32Array(4);
      crypto.getRandomValues(buf);
      return buf.reduce((concat: string, x: number): string => `${concat}${x}`, '');
    }

    public static readonly toExpiryDate: {(maxAge: number): Date} = (maxAge): Date => {
      return this.rollDate(new Date(), maxAge);
    }

    public static readonly getAuthResponse: {(url: string, opts: RequestInit): Promise<AuthResponse | App.Error>} = async (url, opts): Promise<AuthResponse | App.Error> => {
      return fetch(url, opts)
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
      });
    }

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

      const url: string = PUBLIC_BASE_TKN_URI; 

      const opts = {
        method: 'POST',
        url: url,
        body: new URLSearchParams({ 
          code: code, 
          redirect_uri: PUBLIC_REDIRECT_URI,
          grant_type: PUBLIC_GRANT_TYPE
        }),
        headers: {
          'Authorization': Auth.makeAuthorization(clientID, clientSecret),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true
      }

      const respOrErr: Spotify.AuthResponse | App.Error = await this.getAuthResponse(url, opts);
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

    /**
     * Refresh a token if necessary (if we are <10mins before it is due for a refresh)
     * Returns null if a refresh was not necesary
     */
    public static readonly refreshIfExpiresSoon: {(
      refreshToken: string, 
      expiresAt: Date,
      clientID: string,
      clientSecret: string
      ): Promise<AuthResponse | null>} = async (
        refreshToken, 
        expiresAt,
        clientID,
        clientSecret
        ): Promise<AuthResponse | null> => {

      // it is not yet time to refresh the token
      if(expiresAt.getTime() > this.rollDate(new Date(), REFRESH_PADDING).getTime()){
        return null;
      }

      const url: string = PUBLIC_BASE_TKN_URI;
      
      const opts = {
        method: 'POST',
        url: url,
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        headers: {
          'Authorization': Auth.makeAuthorization(clientID, clientSecret),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
      }

      const respOrErr: Spotify.AuthResponse | App.Error = await this.getAuthResponse(url, opts);
      if(!respOrErr.hasOwnProperty('access_token')){
        const err: App.Error = <App.Error> respOrErr;
        throw error(err.status, {
          status: err.status,
          message: err.message
        })
      }
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