import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({cookies}) => {
  
  cookies.delete('access_token');
  cookies.delete('token_type');
  cookies.delete('scope');
  cookies.delete('expires_in');
  cookies.delete('refresh_token');
}