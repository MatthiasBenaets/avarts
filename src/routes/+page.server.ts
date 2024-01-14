import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const generateRandomString = () => {
  let r: string = (Math.random() + 1).toString(36).substring(2);
  return r
}

export const actions = {
  login: async ({ request, locals }) => {
    // get data from form
		const formData = Object.fromEntries(await request.formData());

		try {
      // try to log in
			await locals.pb.collection('users').authWithPassword(formData.username, formData.password);
		} catch (err: any) {
      // if error returned, send prop with email = true (will show message on screen)
      if (err.status === 400 || err.status === 401) {
        console.log('Error: ', err);
        return {
          login: true,
        };
      } else {
			  return error(500, 'Something went wrong logging in');
      };
		};

    // if response ok, logged in and redirected to the homepage
		throw redirect(303, '/');
	},
	register: async ({ request, locals }) => {
    if (env.PUBLIC_REGISTRATION == "true") {
      const formData = await request.formData();
      const randomString = generateRandomString();
      formData.set('email', `${randomString}@avarts.com`)

      try {
        await locals.pb.collection('users').create(formData);
      } catch (err: any) {
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
    };
	},
};
