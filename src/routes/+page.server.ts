import { error, redirect } from '@sveltejs/kit';

const generateRandomString = () => {
  let r = (Math.random() + 1).toString(36).substring(2);
  return r
}

export const actions = {
  login: async ({ request, locals }) => {
    // get data from form
		const formData = Object.fromEntries(await request.formData());

		try {
      // try to log in
			await locals.pb.collection('users').authWithPassword(formData.username, formData.password);
		} catch (err) {
      // if error returned, send prop with email = true (will show message on screen)
      if (err.status === 400 || err.status === 401) {
        console.log('Error: ', err);
        return {
          email: true,
        };
      } else {
			  return error(500, 'Something went wrong logging in');
      };
		};

    // if response ok, logged in and redirected to the homepage
		throw redirect(303, '/');
	},
	register: async ({ request, locals }) => {
		const formData = await request.formData();
    const randomString = generateRandomString();
    formData.set('email', `${randomString}@avarts.com`)
    // formData.set('verified', true)

		try {
			await locals.pb.collection('users').create(formData);
		} catch (err) {
      // if error returned, send prop with email = true (will show message on screen)
      if (err.status === 400 || err.status === 401) {
        console.log('Error: ', err);
        return {
          email: true,
        };
      } else {
			  return error(500, 'Something went wrong logging in');
      };
		};

    // if response ok, logged in and redirected to the homepage
		throw redirect(303, '/');
	},
};
