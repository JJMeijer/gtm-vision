import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const trailingSlash = "always";

export const load = (async ({ parent }) => {
    const { resolvedContainer } = await parent();

    const firstTag = resolvedContainer.tags.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true }),
    )[0];

    throw redirect(307, `${firstTag.index}`);
}) satisfies PageLoad;
