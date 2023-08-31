import type { MaybePromise, RequestEvent } from "@sveltejs/kit";

export function handleError({
    error, 
    event
  }: {
    error: any, 
    event: RequestEvent<Partial<Record<string, string>>, string | null>
  }): MaybePromise<void | App.Error> 
  {
  const isNotFound: boolean = event.route.id === null;

  return {
    status: isNotFound ? 404 : 500,
    message: error.message ? error.message : 'unknown',
  }
}