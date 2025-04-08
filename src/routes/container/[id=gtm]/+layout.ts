import { getGtmContainer, parseGtmContainer } from "$lib/gtm";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { GtmIdError } from "$constants";

export const load = (async ({ fetch, params }) => {
    const { id } = params;

    const containerText = await getGtmContainer(fetch, id);

    if (!containerText) {
        throw redirect(307, `/?gtmIdError=${GtmIdError.NotFound}&gtmId=${id}`);
    }

    const resolvedContainer = parseGtmContainer(containerText);

    if (!resolvedContainer) {
        throw redirect(307, `/?gtmIdError=${GtmIdError.ParseError}&gtmId=${id}`);
    }

    return {
        id,
        resolvedContainer,
    };
}) satisfies LayoutLoad;

export const ssr = false;
