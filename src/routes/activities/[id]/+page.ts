import { error } from "@sveltejs/kit";
import { pb } from '$lib/database';
import type { PageLoad } from "./$types";
import type { Exercise } from '$lib/types';

export const ssr = false;

// fetch specific post from PocketBase
export const load: PageLoad = async ({ params }) => {
  const activity: Exercise = await pb.collection('activities').getFirstListItem(`id="${params.id}"`, { expand: "user" });
  if (!activity){
    error(404, 'Post not found');
  };
  const gpx = activity.gpx;
  const url = pb.files.getUrl(activity, gpx);
  activity.url = url;
  return activity;
};
