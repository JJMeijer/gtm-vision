import type { ParamMatcher } from "@sveltejs/kit";

import { GTM_REGEXP } from "$constants";

export const match = ((param) => {
    return GTM_REGEXP.test(param);
}) satisfies ParamMatcher;
