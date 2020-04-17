const parseTemplate = function parseTemplateFormatInTagValuesOrTriggerValues(_element) {
  const element = _element;
  const { tagValues, triggerValues } = element;
  const values = tagValues || triggerValues || undefined;

  if (values) {
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(value) && value[0] === 'template') {
        values[key] = value.slice(1).join('');
      }
    });
  }

  return element;
};

export default parseTemplate;
