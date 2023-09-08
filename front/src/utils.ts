import type { Spotify } from "./spotify";

export namespace Utils{

  const monthOnNum: {(): string[]} = () => [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  export const exposesAppError: {(obj: any): boolean} = (obj): boolean => {
    return obj.hasOwnProperty('message') && obj.hasOwnProperty('status')
  }
  
  /**
   * Turns a string like 2023-09-05T21:04:15.190Z to '5 Sep 21:04, 2023'
   */
  export const dateStringToReadable: {(date: string): string} = (date): string => {
    const internal: Date = new Date(date);
    const day = internal.getDate();
    const month = internal.getMonth();
    const year = internal.getFullYear();
    const time = internal.toLocaleTimeString();

    return `${day} ${monthOnNum()[month]} ${time}, ${year}`
  }

  /**
   * Class implementing a backoff strategy which starts at ``initMs`` milliseconds,
   * grows by ``exp`` each subsequent request up to ``limMs`` milliseconds.
   */
  export class Backoffer {
    private readonly init: number;
    private readonly lim: number;
    private readonly exp: number;

    private current: number; //starts at init, grows by a factor of exp 
    private isWaiting: boolean = false; //whether we have an interval running currenlty
    private requestWhileWaiting: boolean = false; //if we have been bothered while waiting
    private action: {(): any} = () => {};

    constructor(initMs: number, exp: number, limMs: number){
      this.init = initMs;
      this.lim = limMs;
      this.exp = exp;
      this.current = initMs;
    }

    //try to perform an action, any block with no args, or set new action if waiting
    public readonly act: {(action: {(): any}): void} = (action) => {
      this.action = action; //just set the new action immediately
      console.log(this);
      if(!this.isWaiting) {
        this.current = this.init; //we let it wait until it stopped pending
        this.action(); //ignore output
        this.isWaiting = true;
        setTimeout(() => { 
          //reset
          this.isWaiting = false;
          if(!this.requestWhileWaiting){ //we let it wait while pending
            this.current = this.init;
          }else{
            this.action(); //if we requested while waiting the action may have changed
            //increase subsequent request delay if we got one during this delay
            this.current *= this.exp;
            this.current = Math.min(this.current, this.lim);
          }
          this.requestWhileWaiting = false;
         }, this.current);
      }else{
        this.requestWhileWaiting = true;
      }
      //already waiting!
    }

    public readonly getIsWaiting: {(): boolean} = (): boolean => {
      return this.isWaiting;
    }
  }


      /**
   * Should only be used to convert something you know is a spotify track item
   * to a Track
   */
  export const toTrack: {(track: any, isPlaying?: boolean, progressMS?: number): Spotify.Track} = 
  (track, isPlaying?, progressMS?): Spotify.Track => {
    const play: boolean = isPlaying ?? true;

    return <Spotify.Track> {
      id: track.id,
      is_playing: play,
      artists: play ? track.artists.map(({name}: {name: string}) => name) : null,
      album: play ? track.album.name : null,
      name: play ? track.name : null,
      popularity: play ? track.popularity : null,
      url: play ? track.external_urls.spotify : null,
      fetch_in: play ? track.duration_ms - (progressMS ?? 0) : null //if it is playing but we dont pass a progress, we will just fetch after 1 track length
    };
  }

  export const opts: {(token: string): Spotify.AuthHeader} = (token): Spotify.AuthHeader => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  } 

  //get the modes (most common) of a set of tracks in decending order
  export const countTracks: {(tracks: Spotify.Track[]): [number, Spotify.Track][]} = 
    (tracks: Spotify.Track[]): [number, Spotify.Track][] => {
    //map from string
    const idToCount: {[id: string]: number} = {};
    const idToTrack: {[id: string]: Spotify.Track} = {};
    tracks.map(t => { 
      if(idToTrack[t.id] === undefined){
        idToCount[t.id] = 1;
        idToTrack[t.id] = t; //just get the unique tracks into a map on their id
      }else{
        idToCount[t.id]++;
      }
    });
    
    let counts: [number, Spotify.Track][] = Object.keys(idToTrack).map(id => [idToCount[id], idToTrack[id]]);
    counts = counts.sort((a: [number, Spotify.Track], b: [number, Spotify.Track]): number => {
      return b[0] - a[0];
    }); //sort in decending order
    
    return counts;
  }

  export const uniqueTracks: {(tracks: Spotify.Track[]): Spotify.Track[]} = (tracks): Spotify.Track[] => {
    const idToTrack: {[id: string]: Spotify.Track} = {};
    tracks.map(t => idToTrack[t.id]);

    return Object.keys(idToTrack).map(id => idToTrack[id]);
  }

  export const countStrings: {(xs: string[]): [number, string][]} = (xs): [number, string][] => {
    const toCount: {[x: string]: number} = {};
    const toID: {[x: string]: string} = {};
    
    xs.map(x => {
      if(toID[x] === undefined){
        toID[x] = x;
        toCount[x] = 1;
      }else{
        toCount[x]++;
      }
    });

    let counts: [number, string][] = Object.keys(toID).map(x => [toCount[x], toID[x]]);
    counts = counts.sort((a: [number, string], b: [number, string]): number => {
      return b[0] - a[0];
    }); 

    return counts;
  } 

  /**
   * Flattens a 2d array of ``T``s
   * @param xss 2d array of generic type ``T[][]``
   * @returns ``T[]``
   */
  export function flatten<T>(xss: T[][]): T[] {
    return xss.reduce((xs, xss) => [...xs, ...xss], []);
  }
}