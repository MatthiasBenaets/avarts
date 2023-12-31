// Logout functionality

import { redirect } from "@sveltejs/kit";

// Clear cookie and redirect
export async function POST({ locals }: { locals: any }) {
  locals.pb.authStore.clear();
  locals.user = undefined;
  throw redirect(303, '/');
};
