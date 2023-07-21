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

export const decodeGtmScript = (script: string): string => {
    // Split the input string into parts that need decoding and those that don't
    const parts = script.split(/(%[0-9A-Fa-f]{2})/);

    // Decode the URI components
    const decodedParts = parts.map((part) => {
        if (part.startsWith("%")) {
            // If the part starts with '%', it is an encoded URI component
            return decodeURIComponent(part);
        } else {
            // If it doesn't start with '%', it's not encoded, return as-is
            return part;
        }
    });

    // Combine the decoded parts back into the final string
    const decodedString = decodedParts.join("");

    return decodedString;
};
