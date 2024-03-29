import type { Container, ParsedContainer, ResolvedContainer } from "../types";
import { parseMacros } from "./macro";
import { resolver } from "./resolve";
import { parseTags } from "./tags";
import { parseTriggers } from "./triggers";
import { containerFilter } from "./filter";

export const parse = (container: Container) => {
    const {
        resource: { macros, tags, predicates, rules },
    } = container;

    const { parsedMacros, triggerContextMacros } = parseMacros(macros);
    const { parsedTags, triggerContextTags } = parseTags(tags);
    const parsedTriggers = parseTriggers(predicates, rules, triggerContextMacros, triggerContextTags);

    const parsedContainer: ParsedContainer = {
        variables: parsedMacros,
        tags: parsedTags,
        triggers: parsedTriggers,
    };

    const resolvedContainer: ResolvedContainer = resolver(parsedContainer);

    return containerFilter(resolvedContainer);
};
