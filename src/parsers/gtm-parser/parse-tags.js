import tagDictionary from './dictionaries/tags';

const parseTags = function parseTags(tagsArray) {
  const parsedArray = [];
  const tagNames = tagDictionary();

  tagsArray.forEach((tag) => {
    const parsedTag = {};

    parsedTag.category = 'tag';

    Object.keys(tag).forEach((key) => {
      if (key === 'function') {
        if (tagNames[tag[key]]) {
          const tagName = tagNames[tag[key]].fullName;
          tagNames[tag[key]].counter += 1;
          const tagCounter = tagNames[tag[key]].counter;

          parsedTag.type = tagName;
          parsedTag.reference = `${tagName}(${tagCounter})`;
        } else {
          const tagName = 'Unknown';
          tagNames.unknown += 1;
          const tagCounter = tagNames.unknown;

          parsedTag.type = tagName;
          parsedTag.reference = `${tagName}(${tagCounter}) - ${tag[key]}`;
        }
      }

      // Parse all tag specific values in an object
      if (key.match('vtp_')) {
        const tagValues = parsedTag.tagValues || {};
        tagValues[key.replace('vtp_', '')] = tag[key];
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
        parsedTag.tagPriority = tag[key];
      }

      if (key === 'live_only') {
        parsedTag.onlyFireInPublishedContainers = tag[key];
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
