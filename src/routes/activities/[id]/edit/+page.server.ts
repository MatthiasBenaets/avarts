import { error, redirect } from "@sveltejs/kit";

export const actions = {
	update: async ({ request, locals, params }) => {
		const formData = await request.formData();

		try {
			await locals.pb.collection('activities').update(params.id, formData);
		} catch (err: any) {
			console.log('Error: ', err);
			throw error(err.status, err.message);
		};
    throw redirect(303, `/activities/${params.id}`);
	},
};
