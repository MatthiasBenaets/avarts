import { error, redirect } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, locals }) => {
		const formData = await request.formData();
    const id = formData.get('id')

		try {
      const { name, avatar, weight } = await locals.pb.collection('users').update(id, formData);
      locals.user.name = name;
      locals.user.avatar = avatar;
      locals.user.weight= weight;
		} catch (err) {
      return error(500, 'Something went wrong');
		};
	},
};
