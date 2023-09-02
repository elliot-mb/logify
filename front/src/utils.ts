
export namespace Utils {
  export class Auth {
    /**
     * Gets a quite secure set of 16 random characters for use as state
     */
    public static readonly getRandomState: {(): string} = (): string => {
      const buf = new Uint32Array(4);
      crypto.getRandomValues(buf);
      return buf.reduce((concat: string, x: number): string => `${concat}${x}`, '');
    }
  }
}