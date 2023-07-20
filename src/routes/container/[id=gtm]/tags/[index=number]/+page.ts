import type { PageLoad } from "./$types";

export const load = (async ({ params, parent }) => {
    const { index } = params;
    const { resolvedContainer } = await parent();

    if (!resolvedContainer) {
        throw new Error("Unexpected Error - No resolved container available");
    }

    const tag = resolvedContainer.tags.find((tag) => tag.index === parseInt(index));

    if (!tag) {
        throw new Error("Unexpected Error - No tag found for index");
    }

    return {
        index,
        tag,
    };
}) satisfies PageLoad;
