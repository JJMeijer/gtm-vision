const parseTemplate = function parseTemplateFormatInTagValuesOrTriggerValues(_element) {
  const element = _element;
  const { tagValues, triggerValues, variableValues } = element;
  const values = tagValues || triggerValues || variableValues || undefined;

  if (values) {
    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (Array.isArray(value)) {
        // Handle Template arrays
        if (value[0] === 'template') {
          values[key] = value.slice(1).join('');
        }

        // Handle template arrays inside list arrays
        if (value[0] === 'list') {
          values[key] = value.map((row) => {
            if (Array.isArray(row)) {
              return row.map((item) => {
                if (Array.isArray(item) && item[0] === 'template') {
                  return item.slice(1).join('');
                }
                return item;
              });
            }
            return row;
          });
        }
      }
    });
  }

  return element;
};

export default parseTemplate;
