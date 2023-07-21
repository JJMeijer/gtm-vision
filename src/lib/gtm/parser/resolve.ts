import jsbeautify from "js-beautify";

import type {
    ParsedMacro,
    ParsedTag,
    ParsedContainer,
    ResolvedEscape,
    ResolvedTemplate,
    ResolvedContainer,
} from "../types";
import { isEscape, isObject, isParsedItem, isReference, isTemplate } from "../type-guards";
import { beautifyOptions } from "./beautify-options";
import { decodeGtmScript } from "./utility";

const { js, html } = jsbeautify;

interface ResolveReference {
    (source: ParsedTag | ParsedMacro, targetIndex: number, targets: ParsedMacro[] | ParsedTag[]): string;
}

const resolveReference: ResolveReference = (source, targetIndex, targets) => {
    const target = targets[targetIndex] as ParsedMacro | ParsedTag;

    if (target.references[source.category].indexOf(source.name) === -1) {
        target.references[source.category].push(source.name);
    }

    return `{{${target.name}}}`;
};

const resolveTemplate = (template: ResolvedTemplate, property: string): string => {
    const [, ...content] = template;

    if (property === "html") {
        return html(decodeGtmScript(content.join("").replace(' type="text/gtmscript"', "")), beautifyOptions);
    }

    if (property === "javascript") {
        return js(content.join(""), beautifyOptions);
    }

    return content.join("");
};

const resolveEscape = (escape: ResolvedEscape): string => {
    /**
     * There are 2 numbers inside the escape array. The first one i guess
     * indicates if a variable name is written with or without parentheses.
     * The second one I don't know.
     */

    const [, reference, type] = escape;

    return type > 7 ? `"${reference}"` : reference;
};

export const resolver = (parsedContainer: ParsedContainer): ResolvedContainer => {
    let sourceItem: ParsedTag | ParsedMacro;

    const { tags, variables } = parsedContainer;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolve = (obj: any): void => {
        if (isParsedItem(obj)) sourceItem = obj;

        Object.getOwnPropertyNames(obj).forEach((key) => {
            if (isReference(obj[key])) {
                obj[key] = resolveReference(sourceItem, obj[key][1], obj[key][0] === "macro" ? variables : tags);
                return;
            }

            if (isTemplate(obj[key])) {
                //Resolve References + Escapes inside Template
                resolve(obj[key]);

                // Declare that the array is now an template array with references Resolved.
                const templateWithReferences = obj[key] as ResolvedTemplate;

                obj[key] = resolveTemplate(templateWithReferences, key);
            }

            if (isEscape(obj[key])) {
                // Resolve references inside escape
                resolve(obj[key]);

                // Declare that the array is now an escape array with the reference Resolved.
                const escapeWithReference = obj[key] as ResolvedEscape;

                // Only return the resolved reference from the escape
                obj[key] = resolveEscape(escapeWithReference);
            }

            if (isObject(obj[key]) || Array.isArray(obj[key])) {
                resolve(obj[key]);
                return;
            }
        });
    };

    resolve(parsedContainer);

    return parsedContainer as unknown as ResolvedContainer;
};
