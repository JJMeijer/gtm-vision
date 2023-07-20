import type { PageLoad } from "./$types";

export const load = (async ({ params, parent }) => {
    const { index } = params;
    const { resolvedContainer } = await parent();

    if (!resolvedContainer) {
        throw new Error("Unexpected Error");
    }

    const variable = resolvedContainer.variables.find((variable) => variable.index === parseInt(index));

    if (!variable) {
        throw new Error("Unexpected Error");
    }

    return {
        index,
        variable,
    };
}) satisfies PageLoad;
