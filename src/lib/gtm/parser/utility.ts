import type { ParsedProperty } from "../types";

export const parseTemplateId = (templateString: string): string | void => {
    const match = templateString.match("__cvt_[0-9]+_([0-9]+)");
    if (match && match[1]) {
        return `Template-${match[1]}`;
    }
};

export const sentenceCase = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const copy = (value: ParsedProperty): ParsedProperty => {
    if ((typeof value).match(/object/)) {
        return JSON.parse(JSON.stringify(value));
    }

    return value;
};
