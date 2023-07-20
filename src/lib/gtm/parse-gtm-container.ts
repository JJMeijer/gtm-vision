import { parse } from "./parser";
import type { Container } from "./types";

export const parseGtmContainer = (containerText: string) => {
    try {
        const container = JSON.parse(containerText) as Container;
        const parsedContainer = parse(container);

        return parsedContainer;
    } catch (err) {
        return null;
    }
};
