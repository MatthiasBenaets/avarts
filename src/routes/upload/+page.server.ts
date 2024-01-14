import { error } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals }) => {
    // get data from form
		const formData = await request.formData();

		try {
      await locals.pb.collection('activities').create(formData);
		} catch (err) {
      return error(500, 'Something went wrong');
		};

    const record = await locals.pb.collection('activities').getList(1, 1, { sort: '-created' });
    return record.items[0].id
	},
};
