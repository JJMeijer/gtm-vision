import { tagDictionary } from './dictionaries';

const parseTags = function parseTags(tagsArray) {
  const parsedArray = [];
  const tagNames = tagDictionary();

  tagsArray.forEach((tag) => {
    const parsedTag = {};

    parsedTag.category = 'tags';

    Object.keys(tag).forEach((key) => {
      if (key === 'function') {
        const tagAbbreviation = tag[key];
        if (tagNames[tagAbbreviation]) {
          const tagName = tagNames[tagAbbreviation].fullName;
          tagNames[tagAbbreviation].counter += 1;
          const tagCounter = tagNames[tagAbbreviation].counter;

          parsedTag.type = tagName;
          parsedTag.reference = `${tagName} (${tagCounter})`;
        } else if (tagAbbreviation.match('__cvt_.+')) {
          const tagName = tagNames.template.fullName;
          tagNames.template.counter += 1;
          const tagCounter = tagNames.template.counter;

          parsedTag.type = tagName;
          parsedTag.reference = `${tagName} (${tagCounter})`;
        } else {
          const tagName = 'Unknown';
          tagNames.unknown += 1;
          const tagCounter = tagNames.unknown;

          parsedTag.type = tagName;
          parsedTag.reference = `${tagName} (${tagCounter}) - ${tag[key]}`;
        }
      }

      /**
       * Parse all tag specific values and place inside 'tagValues' object.
       */
      if (key.match('vtp_')) {
        const tagValues = parsedTag.tagValues || {};
        const tagValue = tag[key];
        tagValues[key.replace('vtp_', '')] = tagValue;
        parsedTag.tagValues = tagValues;
      }

      // Parse Tag firing Rules
      if (key.match(/^unlimited$|^once_per.+/)) {
        const tagValues = parsedTag.tagValues || {};
        const firingOption = key.replace(/_/g, ' ').replace('load', 'page');
        tagValues.firingOption = firingOption.charAt(0).toUpperCase() + firingOption.slice(1);
        parsedTag.tagValues = tagValues;
      }

      // Parse tag sequencing keys
      if (key.match(/setup_tags|teardown_tags/)) {
        const tagSequencing = parsedTag.tagSequencing || {};
        const sequencingType = key.match(/^(.+)_tags/)[1];

        const optionText = [
          '',
          "Don't fire current tag when setup tag fails or is paused",
          "Don't fire cleanup tag when current tag fails or is paused",
        ];

        tagSequencing[sequencingType] = {};

        tagSequencing[sequencingType].tag = tag[key][1].slice(0, 2);
        const option = tag[key][1].slice(2);
        tagSequencing[sequencingType].optionText = optionText[option];

        parsedTag.tagSequencing = tagSequencing;
      }

      // Parse other tag settings
      if (key === 'priority') {
        const tagValues = parsedTag.tagValues || {};
        tagValues.tagPriority = tag[key];

        parsedTag.tagValues = tagValues;
      }

      if (key === 'live_only') {
        const tagValues = parsedTag.tagValues || {};
        tagValues.onlyFireInPublishedContainers = tag[key];

        parsedTag.tagValues = tagValues;
      }
    });

    const { type, tagValues } = parsedTag;
    if (type === 'Google Analytics') {
      const { trackType } = tagValues;

      let gaTagType;
      let description;

      if (trackType.match('TRACK')) {
        [, gaTagType] = trackType.match(/TRACK_(.+)/);
        description = gaTagType.charAt(0) + gaTagType.toLowerCase(0).slice(1);
      }

      if (trackType.match('DECORATE')) {
        gaTagType = trackType.replace('_', ' ');
        description = gaTagType.charAt(0) + gaTagType.toLowerCase(0).slice(1);
      }

      parsedTag.reference = `${parsedTag.reference} - ${description}`;
      parsedTag.tagValues.trackType = description;
    }

    // Push parsed macro to the new array.
    parsedArray.push(parsedTag);
  });

  return parsedArray;
};

export default parseTags;
