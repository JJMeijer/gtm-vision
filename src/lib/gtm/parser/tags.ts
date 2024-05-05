import jsbeautify from "js-beautify";
import type {
    Tag,
    Counter,
    ParsedTag,
    ItemName,
    ParsedProperties,
    ParsedProperty,
    TagSequencing,
    TriggerContextTags,
    ParsedBoundary,
    ParsedRuntimes,
} from "../types";
import { OPERATORS, TAGS } from "./dictionaries";

import { copy, decodeGtmScript, parseTemplateId, sentenceCase, getItemSize } from "./utility";
import { beautifyOptions } from "./beautify-options";
const { html } = jsbeautify;

const parseTagName = (tag: Tag, counters: Counter): ItemName => {
    const type = TAGS[tag.function] || parseTemplateId(tag.function) || "Unknown";
    const counter = counters[type] ? (counters[type] += 1) : (counters[type] = 1);
    let name = `${type} (${counter})`;

    if (type === "Unknown") {
        console.log(tag);
    }

    // For GA UA the track type is added to make the name more clear.
    if (type === "Google Analytics: UA" && tag.vtp_trackType) {
        const { vtp_trackType: trackType } = tag;

        const trackMatch = trackType.match(/TRACK_(.+)/);
        if (trackMatch && trackMatch[1]) name = `${name} - ${sentenceCase(trackMatch[1])}`;

        const decorateMatch = trackType.match(/DECORATE/);
        if (decorateMatch) name = `${name} - ${sentenceCase(trackType.replace("_", ""))}`;
    }

    return {
        type,
        name,
    };
};

const parseProperties = (tag: Tag): ParsedProperties => {
    const properties = {} as ParsedProperties;

    /**
     * Parse vtp_boundaries parameter seperately to already parse the
     * zone conditions. This could be done later, but why not now.
     */
    if (tag.vtp_boundaries) {
        const [list, ...boundaries] = tag.vtp_boundaries;

        properties.boundaries = [
            list,
            ...(boundaries.map((boundary) => {
                const [, operator, variable, value, invert] = boundary;
                return ["zb", OPERATORS[operator][invert ? "negative" : "positive"], variable, value];
            }) as ParsedBoundary[]),
        ];

        delete tag.vtp_boundaries;
    }

    /**
     * Get vtp_ parameter & remove "vtp_" part from key
     */
    for (const key in tag) {
        if (key.indexOf("vtp_") === 0) {
            properties[key.replace("vtp_", "")] = copy(tag[key] as ParsedProperty);
        }
    }

    /**
     * Add tag specific properties if the exists
     * - metadata
     * - firingOption
     * - tag priority
     * - live only
     */
    const { metadata, once_per_event, once_per_load, unlimited, priority, live_only } = tag;

    if (metadata && metadata.length > 1) properties.metadata = metadata;
    if (once_per_event) properties.firingOption = "Once per Event";
    if (once_per_load) properties.firingOption = "Once per Page";
    if (unlimited) properties.firingOption = "Unlimited";
    if (priority) properties.tagPriority = priority;
    if (live_only) properties.onlyFireInPublishedContainers = live_only;

    /**
     * Cleanup & beautify HTML property when it's only a string
     */
    if (properties.html && typeof properties.html === "string") {
        properties.html = html(decodeGtmScript(properties.html).replace(' type="text/gtmscript"', ""), beautifyOptions);
    }

    return properties;
};

const parseTagSequencing = (tag: Tag) => {
    const parsedTagSequence: TagSequencing = {};

    const optionTexts = [
        "",
        "Don't fire current tag when setup tag fails or is paused",
        "Don't fire cleanup tag when current tag fails or is paused",
    ];

    const { setup_tags, teardown_tags } = tag;

    if (setup_tags) {
        const [, [, tagIndex, optionIndex]] = setup_tags;

        parsedTagSequence.setup = {
            tag: ["tag", tagIndex],
            optionText: optionTexts[optionIndex] as string,
        };
    }

    if (teardown_tags) {
        const [, [, tagIndex, optionIndex]] = teardown_tags;

        parsedTagSequence.teardown = {
            tag: ["tag", tagIndex],
            optionText: optionTexts[optionIndex] as string,
        };
    }

    if (Object.getOwnPropertyNames(parsedTagSequence).length > 0) {
        return parsedTagSequence;
    }

    return undefined;
};

export const parseTags = (tags: Tag[], parsedRuntimes: ParsedRuntimes) => {
    const counters: Counter = {};

    const parsedTags: ParsedTag[] = [];

    const triggerContextTags: TriggerContextTags = {
        customTriggerTags: {},
        triggerGroupTags: {},
    };

    tags.forEach((tag, index) => {
        const tagName = parseTagName(tag, counters);

        const runtime = parsedRuntimes[tagName.type];
        if (runtime) {
            const { code } = runtime;
            tag.vtp_javascript = code;
        }

        const size = getItemSize(tag);
        const properties = parseProperties(tag);
        const tagSequencing = parseTagSequencing(tag);
        const consent = tag.consent ? tag.consent.slice(1) : [];

        const parsedTag: ParsedTag = {
            index,
            category: "tags",
            ...tagName,
            properties,
            consent,
            ...(tagSequencing ? { tagSequencing } : null),
            references: {
                variables: [],
                tags: [],
                triggers: [],
            },
            size,
        };

        parsedTags.push(parsedTag);

        /**
         * If The tag is used for a custom trigger, store the uniqueTriggerId
         * & the corresponding tag in a seperate object. these will be used
         * when the triggers get parsed.
         */
        if (properties.uniqueTriggerId) {
            const { uniqueTriggerId } = properties;
            triggerContextTags.customTriggerTags[uniqueTriggerId] = parsedTag;
        }

        /**
         * If the tag is used as a 'trigger group listener', store the tag inside a
         * seperate object that will be used when all the triggers are Parsed
         */
        if (parsedTag.properties.firingId) {
            const { firingId } = parsedTag.properties;
            triggerContextTags.triggerGroupTags[firingId] = parsedTag;
        }
    });

    return { parsedTags, triggerContextTags };
};
