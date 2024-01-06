export async function POST({ request, locals }: { locals: any }) {
	const formData = await request.formData();
  let id = formData.get('id')

  await locals.pb.collection('routes').update(id, formData);

  const record = await locals.pb.collection('routes').getList(1, 1, { sort: '-updated' }, {filter:`user = "${formData.user}"`, expand: "user" });
  return new Response(JSON.stringify(record.items[0].id))
  // return new Response("200")
};
