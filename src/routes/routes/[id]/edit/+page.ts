import { error } from "@sveltejs/kit";
import { pb } from '$lib/database';
import type { PageLoad } from "../$types";
import type { Post } from '$lib/types';

export const ssr = false;

export const load: PageLoad = async ({ params }) => {
  const activity: Post[] = await pb.collection('routes').getFirstListItem(`id="${params.id}"`, { expand: "user" });
  if (!activity){
    error(404, 'Route not found');
  };
  return activity;
};
