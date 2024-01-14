import type { UserLocals } from "$lib/types";

export const load = ({ locals }: UserLocals) => {
  if (locals.user) {
    return {
      user: locals.user,
    };
  };

  return {
    user: undefined,
  };
};
