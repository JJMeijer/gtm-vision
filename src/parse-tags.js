import { tagDictionary } from './gtm-dictionaries';

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
        const firingOption = key.replace(/_/g, ' ').replace('load', 'page');
        parsedTag.firingOption = firingOption.charAt(0).toUpperCase() + firingOption.slice(1);
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
        [, [, tagSequencing[sequencingType].tag, tagSequencing[sequencingType].option]] = tag[key];
        tagSequencing[sequencingType].optionText = optionText[tagSequencing[sequencingType].option];
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


    // Push parsed macro to the new array.
    parsedArray.push(parsedTag);
  });

  return parsedArray;
};

export default parseTags;
