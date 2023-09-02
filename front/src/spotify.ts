import { PUBLIC_BASE_API } from "$env/static/public";
import { error } from "@sveltejs/kit";

export namespace Spotify{

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
    images: {
      url: string;
      height: number;
      width: number;
    };
    product: string;
    type: string;
    uri: string;
  };

  /**
   * All the getters used in the app
   */
  export class Get {
    public static readonly userProfile: {(token: string): Promise<User>} = async (token): Promise<User> => {

      const endpt: string = `${PUBLIC_BASE_API}/me`;
//      + (new URLSearchParams({token: token}).toString());
      console.log(endpt);
      const opts = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      console.log(opts);
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
  }
}