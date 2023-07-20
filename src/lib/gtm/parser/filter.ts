import type { ResolvedTag, ResolvedTrigger, ResolvedMacro, ResolvedContainer } from "../types";

const filterForTags = (tags: ResolvedTag[]): ResolvedTag[] => {
    return tags
        .filter((tag) => !tag.type.match("inner_"))
        .map((tag) => {
            const { tagSequencing } = tag;

            if (tagSequencing) {
                const { setup, teardown } = tagSequencing;
                if (setup && typeof setup.tag === "string" && setup.tag.match("inner_")) {
                    delete tagSequencing.setup;
                }

                if (teardown && typeof teardown.tag === "string" && teardown.tag.match("inner_")) {
                    delete tagSequencing.teardown;
                }

                if (Object.getOwnPropertyNames(tagSequencing).length === 0) {
                    delete tag.tagSequencing;
                }
            }

            return tag;
        });
};

const filterForTriggers = (triggers: ResolvedTrigger[]): ResolvedTrigger[] => {
    return triggers.map((trigger) => {
        if (trigger.tags) {
            trigger.tags = trigger.tags.filter((tag) => {
                return !tag.match("inner_");
            });
        }

        if (trigger.exceptions) {
            trigger.exceptions = trigger.exceptions.filter((exception) => {
                return !exception.match("inner_");
            });
        }

        trigger.conditions = trigger.conditions.filter((condition) => {
            const conditionVariable = condition.variable;
            return !conditionVariable.match("gtm.triggers");
        });

        return trigger;
    });
};

const filterForVariables = (variables: ResolvedMacro[]): ResolvedMacro[] => {
    return variables.filter((variable) => !variable.name.match("gtm.triggers"));
};

/**
 * Filtering
 * - Remove 'inner_' tags from
 *    * the main tags array
 *    * tags arrays within triggers
 *    * tags array within tag sequencing
 * - Remove the gtm.triggers variable.
 */
export const containerFilter = (resolvedContainer: ResolvedContainer): ResolvedContainer => {
    const { variables, triggers, tags } = resolvedContainer;
    return {
        variables: filterForVariables(variables),
        tags: filterForTags(tags),
        triggers: filterForTriggers(triggers),
    };
};
