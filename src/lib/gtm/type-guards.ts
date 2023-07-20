import { TRIGGERS } from "./parser/dictionaries";
import type { GenericObject, ParsedTag, ParsedMacro, Reference, Template, Escape, RuntimeInstruction } from "./types";

export const isObject = (value: unknown): value is GenericObject => {
    return !Array.isArray(value) && value === Object(value) && typeof value !== "function";
};

export const isParsedItem = (value: unknown): value is ParsedTag | ParsedMacro => {
    if (isObject(value)) {
        return (
            typeof value["name"] === "string" &&
            typeof value["category"] === "string" &&
            typeof value["type"] === "string"
        );
    }
    return false;
};

export const isReference = (value: unknown): value is Reference<"macro" | "tag"> => {
    return Array.isArray(value) && value.length === 2 && (value[0] === "macro" || value[0] === "tag");
};

export const isStockTrigger = (value: string): value is keyof typeof TRIGGERS => {
    return Object.keys(TRIGGERS).indexOf(value) !== -1;
};

export const isTemplate = (value: unknown): value is Template => {
    return Array.isArray(value) && value[0] === "template";
};

export const isEscape = (value: unknown): value is Escape => {
    return Array.isArray(value) && value[0] === "escape";
};

export const isRuntimeInstruction = (value: unknown): value is RuntimeInstruction => {
    return Array.isArray(value) && (typeof value[0] === "number" || typeof value[0] === "string");
};

export const isRequireInstruction = (value: unknown): value is ["require", string] => {
    return Array.isArray(value) && value.length === 2 && value[0] === "require";
};
