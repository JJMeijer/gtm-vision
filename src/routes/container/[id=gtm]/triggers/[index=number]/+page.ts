import type { PageLoad } from "./$types";

export const load = (async ({ params, parent }) => {
    const { index } = params;
    const { resolvedContainer } = await parent();

    if (!resolvedContainer) {
        throw new Error("Unexpected Error");
    }

    const trigger = resolvedContainer.triggers.find((trigger) => trigger.index === parseInt(index));

    if (!trigger) {
        throw new Error("Unexpected Error");
    }

    return {
        index,
        trigger,
    };
}) satisfies PageLoad;
