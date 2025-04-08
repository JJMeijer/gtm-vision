import { parse } from "./parser";
import type { Container } from "./types";

export const parseGtmContainer = (containerText: string) => {
    try {
        const container = JSON.parse(containerText) as Container;
        const parsedContainer = parse(container);

        // console.log("Raw Container:", container);
        // console.log("Parsed Container:", parsedContainer);

        return parsedContainer;
    } catch (err) {
        console.error(err);
        return null;
    }
};
