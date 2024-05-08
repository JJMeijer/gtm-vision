import { unminifyCompletion } from "$lib/openai";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== "string") {
            error(400, "Bad request");
        }

        const unminified = await unminifyCompletion(code);

        return json({ unminified });
    } catch (_err) {
        error(400, "Bad request");
    }
};
