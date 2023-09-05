import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { token } from "$lib/../stores";

export const load: PageServerLoad = ({cookies}) => {
  
  cookies.delete('access_token');
  cookies.delete('token_type');
  cookies.delete('scope');
  cookies.delete('expires_at');
  cookies.delete('refresh_token');

  throw redirect(307, '/');
}