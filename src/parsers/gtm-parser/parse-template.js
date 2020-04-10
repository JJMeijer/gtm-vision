const parseTemplate = function parseTemplateFormatInTagValues(tag) {
  const tagObj = tag;
  const { tagValues } = tagObj;

  if (tagValues) {
    Object.keys(tagValues).forEach((key) => {
      const tagValue = tagValues[key];
      if (Array.isArray(tagValue) && tagValue[0] === 'template') {
        tagValues[key] = tagValue.slice(1).join('');
      }
    });
  }
  return tagObj;
};

export default parseTemplate;
