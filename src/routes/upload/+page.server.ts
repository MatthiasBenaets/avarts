import { error, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals }) => {
    // get data from form
		const formData = await request.formData();

		try {
      await locals.pb.collection('activities').create(formData);
		} catch (err) {
      // if error returned, send prop with email = true (will show message on screen)
      if (err.status === 400 || err.status === 401) {
        console.log('Error: ', err);
      } else {
			  return error(500, 'Something went wrong logging in');
      };
		};

    const record = await locals.pb.collection('activities').getList(1, 1, { sort: '-created' });
    return record.items[0].id
	},
};
