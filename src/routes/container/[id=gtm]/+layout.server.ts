import { getGtmContainer, parseGtmContainer } from "$lib/gtm";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { GtmIdError } from "$constants";

export const load = (async ({ params }) => {
    const { id } = params;

    console.log("hi");

    const containerText = await getGtmContainer(id);

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
}) satisfies LayoutServerLoad;
