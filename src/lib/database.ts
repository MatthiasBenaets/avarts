import PocketBase from 'pocketbase';
export const pb = new PocketBase('http://127.0.0.1:8090');

pb.autoCancellation(false);

export async function getLink(collection: string, id: string) {
  const dataLink = await pb.collection(collection).getOne(id);
  const dataName = dataLink.dataset;
  return await fetch(pb.files.getUrl(dataLink,dataName));
};
