import type {
    Macro,
    Counter,
    ItemName,
    ParsedMacro,
    MacroFormat,
    ParsedProperties,
    ParsedProperty,
    TriggerContextMacros,
} from "../types";
import { MACROS } from "./dictionaries";
import { parseTemplateId } from "./utility";

const parseMacroName = (macro: Macro, counters: Counter): ItemName => {
    const type = MACROS[macro.function] || parseTemplateId(macro.function) || "Unknown";
    const counter = counters[type] ? (counters[type] += 1) : (counters[type] = 1);
    const name = `${type} (${counter})`;

    return {
        type,
        name,
    };
};

const parseProperties = (element: Macro): ParsedProperties => {
    const parameters = {} as ParsedProperties;

    /**
     * Get vtp_ parameter & remove "vtp_" part from key
     */
    for (const key in element) {
        if (key.indexOf("vtp_") === 0) {
            parameters[key.replace("vtp_", "")] = element[key] as ParsedProperty;
        }
    }

    return parameters;
};

const parseFormat = (macro: Macro): MacroFormat | undefined => {
    const format: MacroFormat = {};

    if (macro.convert_case_to) {
        format.case = macro.convert_case_to;
    }

    if (macro.convert_false_to) {
        format.false = macro.convert_false_to;
    }

    if (macro.convert_true_to) {
        format.true = macro.convert_true_to;
    }

    if (macro.convert_undefined_to) {
        format.undefined = macro.convert_undefined_to;
    }

    if (macro.convert_null_to) {
        format.null = macro.convert_null_to;
    }

    if (Object.getOwnPropertyNames(format).length > 0) {
        return format;
    }

    return undefined;
};

const enhanceMacroName = (itemName: ItemName, properties: ParsedProperties): void => {
    const { type } = itemName;

    if (type === "URL" && properties["component"]) {
        const { component } = properties;
        const description = component === "URL" ? "Full URL" : component;

        itemName.name = `${itemName.name}: ${description}`;
    }

    if (type === "DLV" || type === "Cookie") {
        if (properties["name"]) {
            const { name } = properties;
            const description = Array.isArray(name) ? "Concatenated value" : name;

            itemName.name = `${itemName.name}: ${description}`;
        }
    }

    if (type === "Constant") {
        if (properties["value"]) {
            const { value } = properties;
            const description = Array.isArray(value) ? "Concatenated Value" : value;

            itemName.name = `${itemName.name}: ${description}`;
        }
    }

    if (type === "Auto event variable") {
        if (properties.varType) {
            itemName.name = `${itemName.name}: ${properties.varType.toLowerCase()}`;

            if (properties.varType === "ATTRIBUTE") {
                itemName.name = `${itemName.name} - ${properties["attribute"]}`;
            }

            if (properties.varType === "URL") {
                const { component } = properties;
                const description = component === "URL" ? "Full URL" : component;

                itemName.name = `${itemName.name} - ${description}`;
            }
        }
    }

    if (type === "DOM Element") {
        const { selectorType, elementId, elementSelector } = properties;
        if (selectorType && (elementId || elementSelector)) {
            itemName.name = `${itemName.name} ${selectorType}: ${elementId || elementSelector}`;
        }
    }

    if (type === "Event") {
        properties["description"] = "Datalayer Event name";
    }

    if (itemName.name.length > 40) {
        itemName.name = `${itemName.name.slice(0, 38)}...`;
    }
};

export const parseMacros = (macros: Macro[]) => {
    const counters: Counter = {};

    const parsedMacros: ParsedMacro[] = [];

    const triggerContextMacros: TriggerContextMacros = {
        eventMacros: [],
    };

    macros.forEach((macro, index) => {
        const variableName = parseMacroName(macro, counters);
        const properties = parseProperties(macro);
        const format = parseFormat(macro);
        enhanceMacroName(variableName, properties);

        const parsedMacro: ParsedMacro = {
            index,
            category: "variables",
            ...variableName,
            properties,
            ...(format ? { format } : null),
            references: {
                variables: [],
                tags: [],
                triggers: [],
            },
        };

        parsedMacros.push(parsedMacro);

        /**
         * If the current variable is an 'Event' Variable store the index.
         * this is for later use in trigger parsing.
         */
        if (parsedMacro.type === "Event") {
            triggerContextMacros.eventMacros.push(index);
        }

        /**
         * If the current variable is an 'gtm.triggers' variable store the index.
         * This is for later use in trigger parsing.
         */
        if (parsedMacro.name.match("gtm.triggers")) {
            triggerContextMacros.triggerMacro = index;
        }
    });

    return { parsedMacros, triggerContextMacros };
};
