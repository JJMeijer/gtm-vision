import { macroDictionary } from './gtm-dictionaries';

const parseVariables = function parseVariables(macrosArray) {
  const parsedArray = [];
  const variableNames = macroDictionary();

  macrosArray.forEach((macro) => {
    const parsedMacro = {};

    parsedMacro.category = 'variable';
    Object.keys(macro).forEach((key) => {
      /**
       * Get a meaningful name from the variableName table based
       * on the value in the 'function' key of the macro. Also
       * add a counter to the name to keep similar macros recognizable.
       */
      if (key === 'function') {
        if (variableNames[macro[key]]) {
          const variableName = variableNames[macro[key]].fullName;
          variableNames[macro[key]].counter += 1;
          const variableCounter = variableNames[macro[key]].counter;

          parsedMacro.type = variableName;
          parsedMacro.reference = `${variableName}(${variableCounter})`;
        } else {
          const variableName = 'Unknown';
          variableNames.unknown += 1;
          const variableCounter = variableNames.unknown;

          parsedMacro.type = variableName;
          parsedMacro.reference = `${variableName}(${variableCounter}) - ${macro[key]}`;
        }
      }

      // Remove vtp_ part from variable names
      if (key.match('vtp_')) {
        const variableValues = parsedMacro.variableValues || {};
        variableValues[key.replace('vtp_', '')] = macro[key];
        parsedMacro.variableValues = variableValues;
      }

      // Cleanup format options of macro and place in specific object.
      if (key.match(/convert_(.+)_to/)) {
        parsedMacro.convertFormat = parsedMacro.convertFormat || {};
        const convertOption = key.match(/convert_(.+)_to/)[1];
        if (convertOption === 'case') {
          parsedMacro.convertFormat[convertOption] = macro[key] === 1 ? 'Lowercase' : 'Uppercase';
        } else {
          parsedMacro.convertFormat[convertOption] = macro[key];
        }
      }
    });

    /**
     * Add Specific info to the reference name based on the variable type.
     * this is to make the reference as informative as possible.
     */
    const { type, variableValues } = parsedMacro;
    if (type.match(/URL|HTTP/)) {
      const { component } = variableValues;
      const description = component === 'URL' ? 'Full URL' : component;
      parsedMacro.reference = `${parsedMacro.reference}: ${description}`;
    }

    if (type.match(/Datalayer|Cookie/)) {
      parsedMacro.reference = `${parsedMacro.reference}: ${variableValues.name}`;
    }

    if (type === 'Constant') {
      parsedMacro.reference = `${parsedMacro.reference}: ${variableValues.value}`;
    }

    if (type === 'Auto event variable') {
      parsedMacro.reference = `${parsedMacro.reference}: ${variableValues.varType.toLowerCase()}`;

      if (variableValues.varType === 'ATTRIBUTE') {
        parsedMacro.reference = `${parsedMacro.reference} - ${variableValues.attribute}`;
      }

      if (variableValues.varType === 'URL') {
        const { component } = variableValues;
        const description = component === 'URL' ? 'Full URL' : component.toLowerCase();
        parsedMacro.reference = `${parsedMacro.reference} - ${description}`;
      }
    }

    if (type === 'DOM Element') {
      parsedMacro.reference = `${parsedMacro.reference} ${variableValues.selectorType}: ${variableValues.elementId || variableValues.elementSelector}`;
    }

    // Push parsed macro to the new array.
    parsedArray.push(parsedMacro);
  });

  return parsedArray;
};

export default parseVariables;
