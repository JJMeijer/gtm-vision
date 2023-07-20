import type { ResolvedContainer } from "$lib/gtm/types";

/**
 * Very ineffecient to go through all items. But this way it's easier to use it as
 * a generic function, instead of keeping track for which type of component
 * we're looking for.
 */
export const getComponentLink = (name: string, resolvedContainer: ResolvedContainer): string => {
    const formattedName = name.replace(/^{{(.+)}}$/, "$1");

    const variable = resolvedContainer.variables.find((variable) => variable.name === formattedName);
    if (variable) return `../variables/${variable.index}`;

    const tag = resolvedContainer.tags.find((tag) => tag.name === formattedName);
    if (tag) return `../tags/${tag.index}`;

    const trigger = resolvedContainer.triggers.find((trigger) => trigger.name === formattedName);
    if (trigger) return `../triggers/${trigger.index}`;

    return "";
};
