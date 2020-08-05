import {
  ContainerElement,
  ParsedTag,
  ElementCounter,
  ParsedTagSequencing,
  TriggerContextTags,
  NamedElement,
  SomeOfParsedParameters,
  ParseTagsResponse,
  TemplateContext,
  VtpParameter,
} from '../../types';

import { tagDictionary } from './dictionaries';

const getTagName = (element: ContainerElement, counters: ElementCounter): NamedElement => {
  const elementKey = element.function.match('__cvt_.+') ? 'template' : element.function;

  const type = tagDictionary[elementKey] || 'Unknown';
  const counter = counters[type] ? (counters[type] += 1) : (counters[type] = 1);
  const reference = `${type}(${counter})`;

  return {
    type,
    reference,
  };
};

const getTagParameters = (element: ContainerElement): SomeOfParsedParameters => {
  const parameters = {} as SomeOfParsedParameters;

  /**
   * Get vtp_ parameter & remove "vtp_" part from key
   */
  for (const key in element) {
    if (key.indexOf('vtp_') === 0) {
      parameters[key.replace('vtp_', '')] = element[key] as VtpParameter;
    }
  }

  /**
   * Add tag specific parameters if the exists
   * - metadata
   * - firingOption
   * - tag priority
   * - live only
   */
  if (element.metadata && element.metadata.length > 1) {
    parameters.metadata = element.metadata;
  }

  const { once_per_event, once_per_load, unlimited } = element;
  if (once_per_event) {
    parameters.firingOption = 'Once per Event';
  }

  if (once_per_load) {
    parameters.firingOption = 'Once per Page';
  }

  if (unlimited) {
    parameters.firingOption = 'Unlimited';
  }

  if (element.priority) {
    parameters.tagPriority = element.priority;
  }

  if (element.live_only) {
    parameters.onlyFireInPublishedContainers = element.live_only;
  }

  return parameters;
};

const optionTexts = [
  '',
  "Don't fire current tag when setup tag fails or is paused",
  "Don't fire cleanup tag when current tag fails or is paused",
];

const parseTagSequencing = (tag: ContainerElement): ParsedTagSequencing | undefined => {
  const parsedTagSequence: ParsedTagSequencing = {};

  if (tag.setup_tags) {
    const { setup_tags } = tag;

    const [, [, tagIndex, optionIndex]] = setup_tags;

    parsedTagSequence.setup = {
      tag: ['tag', tagIndex],
      optionText: optionTexts[optionIndex],
    };
  }

  if (tag.teardown_tags) {
    const { teardown_tags } = tag;

    const [, [, tagIndex, optionIndex]] = teardown_tags;

    parsedTagSequence.teardown = {
      tag: ['tag', tagIndex],
      optionText: optionTexts[optionIndex],
    };
  }

  if (Object.getOwnPropertyNames(parsedTagSequence).length > 0) {
    return parsedTagSequence;
  }

  return undefined;
};

/**
 * Convert any string to "Sentence case"
 */
const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Apply more enhancements to a tag name. Currently only the names
 * for the google analytics tags are changed.
 */
const enhanceReferenceForTagTypes = (parsedTag: ParsedTag): void => {
  const { type, tagValues } = parsedTag;

  if (type === 'Google Analytics') {
    const { trackType } = tagValues;

    if (trackType) {
      const trackMatch = trackType.match(/TRACK_(.+)/);
      if (trackMatch) {
        const tagType = sentenceCase(trackMatch[1]);
        parsedTag.reference = `${parsedTag.reference} - ${tagType}`;
        return;
      }

      const decorateMatch = trackType.match('DECORATE');
      if (decorateMatch) {
        const tagType = sentenceCase(trackType.replace('_', ''));
        parsedTag.reference = `${parsedTag.reference} - ${tagType}`;
      }
    }
  }
};

export const parseTags = (tags: ContainerElement[]): ParseTagsResponse => {
  const counters: ElementCounter = {};

  const parsedTags: ParsedTag[] = [];

  const triggerContextTags: TriggerContextTags = {
    uniqueTriggerIds: {},
    firingIds: {},
  };

  const templateContextTags: TemplateContext = {};

  tags.forEach((tag, index) => {
    /**
     * Get Tag Name & Type
     */
    const tagName = getTagName(tag, counters);

    /**
     * Get Parameters in tag
     */
    const tagValues = getTagParameters(tag);

    /**
     * Parse optional tagsequencing parameters
     */
    const tagSequencing = parseTagSequencing(tag);

    const category = 'tags';

    const parsedTag: ParsedTag = {
      category,
      ...tagName,
      tagValues,
      ...(tagSequencing ? { tagSequencing } : null),
    };

    /**
     * Enhance the name/reference of a tag by applying some
     * logic on tag type.
     */
    enhanceReferenceForTagTypes(parsedTag);

    /**
     * If The tag is used as a 'trigger listener', store the uniqueTriggerId
     * & the corresponding tagValues in a seperate object. these will be used
     * when the triggers get parsed.
     */
    if (parsedTag.tagValues.uniqueTriggerId) {
      const { uniqueTriggerId, ...relevantValues } = parsedTag.tagValues;

      triggerContextTags.uniqueTriggerIds[uniqueTriggerId] = relevantValues;
    }

    /**
     * If the tag is used as a 'trigger group listener', store the firingId
     * and the index of the tag in a seperate object. this will later be used
     * when the triggers get parsed.
     */
    if (parsedTag.tagValues.firingId) {
      const { firingId } = parsedTag.tagValues;
      triggerContextTags.firingIds[firingId] = index;
    }

    /**
     * Loop Through tagValues. If a ["template", ...] value is found, store
     * the index of the tag & the key of the value. This is to improve
     * the effeciency of the parsing of these templates later in the process.
     *
     * If an html key is found with just a string we just return the value with some
     * standard text replaced. I don't like that this just randomly happens here,
     * but it feels effecient as I'm looping over tagvalues anyway.
     */
    Object.entries(tagValues).forEach(([key, value]) => {
      if (value && Array.isArray(value) && value.length > 0 && value[0] === 'template') {
        if (templateContextTags[String(index)]) {
          templateContextTags[String(index)].push(key);
        } else {
          templateContextTags[String(index)] = [key];
        }
      }

      if (key === 'html' && typeof value === 'string') {
        tagValues.html = unescape(value).replace(' type="text/gtmscript"', '');
      }
    });

    parsedTags.push(parsedTag);
  });

  return {
    parsedTags,
    triggerContextTags,
    templateContextTags,
  };
};
