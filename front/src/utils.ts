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
}