export async function POST({ request, locals }: { locals: any }) {
	const formData = await request.formData();

  await locals.pb.collection('routes').create(formData);

  const record = await locals.pb.collection('routes').getList(1, 1, { sort: '-updated' }, {filter:`user = "${formData.user}"`, expand: "user" });
  return new Response(JSON.stringify(record.items[0].id))
};
