import type {
    Predicate,
    Rule,
    Condition,
    ParsedTrigger,
    Counter,
    ItemName,
    Reference,
    TriggerContextMacros,
    TriggerContextTags,
    ParsedProperties,
    ParsedTag,
} from "../types";
import { isStockTrigger } from "../type-guards";
import { OPERATORS, TRIGGERS } from "./dictionaries";

const parsePredicate = (predicate: Predicate, sentiment: "positive" | "negative"): Condition => {
    return {
        variable: predicate.arg0,
        operator: OPERATORS[predicate.function][sentiment],
        value: predicate.arg1,
    };
};

/**
 * Derive Trigger type through the 'Event' condition in a trigger.
 */
const getTriggerName = (conditions: Condition[], eventMacros: number[], counters: Counter): ItemName => {
    let type = "Unknown";
    let eventName = "";

    conditions.forEach((condition) => {
        const { variable, value } = condition;
        if (eventMacros.indexOf(variable[1]) > -1) {
            type = isStockTrigger(value) ? TRIGGERS[value] : "Event";

            if (type === "Event") {
                eventName = value;
                if (eventName.length > 22) {
                    eventName = `${eventName.slice(0, 22)}...`;
                }
            }
        }
    });

    const counter = counters[type] ? (counters[type] += 1) : (counters[type] = 1);
    const name = `${type} (${counter}) ${eventName ? " - " + eventName : ""}`;

    return {
        type,
        name,
    };
};

interface GetProperties {
    (conditions: Condition[], triggerMacro: number | undefined, contextTags: TriggerContextTags):
        | ParsedProperties
        | undefined;
}

/**
 * Some triggers get their own tag to set a listener so they know when to trigger (e.g.
 * Element visibility triggers). This function copies the settings from those listener tags into
 * the corresponding trigger object.
 */
const getProperties: GetProperties = (conditions, triggerMacro, contextTags) => {
    if (triggerMacro) {
        const triggerIdCondition = conditions.find((condition) => {
            return condition.variable[1] === triggerMacro;
        });

        if (triggerIdCondition) {
            const uniqueTriggerIdMatch = triggerIdCondition.value.match(/\)(.+)\(/);
            if (uniqueTriggerIdMatch && uniqueTriggerIdMatch[1]) {
                const uniqueTriggerId = uniqueTriggerIdMatch[1];
                return (contextTags.customTriggerTags[uniqueTriggerId] as ParsedTag).properties;
            }
        }
    }

    return undefined;
};

interface ParseTriggerGroups {
    (parsedTriggers: ParsedTrigger[], triggerContextTags: TriggerContextTags): void;
}

const parseTriggerGroups: ParseTriggerGroups = (parsedTriggers, triggerContextTags) => {
    parsedTriggers.forEach((parsedTrigger) => {
        if (parsedTrigger.properties && parsedTrigger.properties.triggerIds) {
            const [, ...triggerIds] = parsedTrigger.properties.triggerIds;

            const triggersInGroup = triggerIds.map((firingId) => {
                const { index: tagIndex } = triggerContextTags.triggerGroupTags[firingId] as ParsedTag;
                return parsedTriggers.find((parsedTrigger) => {
                    const { tags, exceptions } = parsedTrigger;

                    return (
                        (tags && tags.map((x) => x[1]).indexOf(tagIndex) !== -1) ||
                        (exceptions && exceptions.map((x) => x[1]).indexOf(tagIndex) !== -1)
                    );
                });
            });

            triggersInGroup.forEach((triggerChild) => {
                if (triggerChild) {
                    triggerChild.triggerParents = triggerChild.triggerParents || [];
                    triggerChild.triggerParents.push(parsedTrigger.name);
                }
            });

            parsedTrigger.triggerChildren = [];
            triggersInGroup.forEach((triggerChild) => {
                if (triggerChild !== undefined && parsedTrigger.triggerChildren) {
                    parsedTrigger.triggerChildren.push(triggerChild.name);
                }
            });
        }
    });
};

interface ParseTriggers {
    (
        predicates: Predicate[],
        rules: Rule[],
        contextMacros: TriggerContextMacros,
        contextTags: TriggerContextTags,
    ): ParsedTrigger[];
}

export const parseTriggers: ParseTriggers = (predicates, rules, contextMacros, contextTags): ParsedTrigger[] => {
    const counters: Counter = {};

    const parsedTriggers: ParsedTrigger[] = rules.map((rule, index) => {
        const conditions: Condition[] = [];
        const tags: Reference<"tag">[] = [];
        const exceptions: Reference<"tag">[] = [];

        const { eventMacros, triggerMacro } = contextMacros;

        rule.forEach((partOfRule) => {
            const [type, ...indexes] = partOfRule;

            if (type === "if") {
                indexes.forEach((index) => {
                    const predicate = predicates[index] as Predicate;
                    conditions.push(parsePredicate(predicate, "positive"));
                });
            }

            if (type === "unless") {
                indexes.forEach((index) => {
                    const predicate = predicates[index] as Predicate;
                    conditions.push(parsePredicate(predicate, "negative"));
                });
            }

            if (type === "add") {
                indexes.forEach((index) => {
                    const tagReference: Reference<"tag"> = ["tag", index];

                    if (tags.indexOf(tagReference) === -1) {
                        tags.push(tagReference);
                    }
                });
            }

            if (type === "block") {
                indexes.forEach((index) => {
                    const tagReference: Reference<"tag"> = ["tag", index];

                    if (exceptions.indexOf(tagReference) === -1) {
                        exceptions.push(tagReference);
                    }
                });
            }
        });

        const triggerName = getTriggerName(conditions, eventMacros, counters);
        const properties = getProperties(conditions, triggerMacro, contextTags);

        return {
            index,
            category: "triggers",
            ...triggerName,
            conditions,
            ...(tags.length > 0 ? { tags } : null),
            ...(exceptions.length > 0 ? { exceptions } : null),
            ...(properties ? { properties } : null),
        };
    });

    parseTriggerGroups(parsedTriggers, contextTags);

    return parsedTriggers;
};
