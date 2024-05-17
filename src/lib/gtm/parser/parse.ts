import type { Container, ParsedContainer, ResolvedContainer } from "../types";
import { parseMacros } from "./macros";
import { resolver } from "./resolve";
import { parseTags } from "./tags";
import { parseTriggers } from "./triggers";
import { containerFilter } from "./filter";
import { parseRuntimes } from "./runtimes";

export const parse = (container: Container) => {
    const {
        resource: { version, macros, tags, predicates, rules },
        runtime,
    } = container;

    const parsedRuntimes = parseRuntimes(runtime);
    const { parsedMacros, triggerContextMacros } = parseMacros(macros, parsedRuntimes);
    const { parsedTags, triggerContextTags } = parseTags(tags, parsedRuntimes);
    const { parsedTriggers, triggerTagLookup } = parseTriggers(
        predicates,
        rules,
        triggerContextMacros,
        triggerContextTags,
    );

    const parsedContainer: ParsedContainer = {
        variables: parsedMacros,
        tags: parsedTags,
        triggers: parsedTriggers,
    };

    const resolvedContainer: ResolvedContainer = resolver(parsedContainer, triggerTagLookup);

    return {
        ...containerFilter(resolvedContainer),
        parsedRuntimes,
        runtime,
        version,
    };
};
