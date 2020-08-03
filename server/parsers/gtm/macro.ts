import {
  ParsedVariable,
  ContainerElement,
  ConvertFormat,
  ElementCounter,
  ParsedElement,
  SomeOfParsedParameters,
  ParseMacrosResponse,
  TriggerContextVariables,
  TemplateContext,
} from '../../types';

import { macroDictionary } from './dictionaries';

const getMacroName = (element: ContainerElement, counters: ElementCounter): ParsedElement => {
  const category = 'variables';
  const type = macroDictionary[element.function] || 'Unknown';
  const counter = counters[type] ? (counters[type] += 1) : (counters[type] = 1);
  const reference = `${type}(${counter})`;

  return {
    category,
    type,
    reference,
  };
};

const getMacroParameters = (element: ContainerElement): SomeOfParsedParameters => {
  const parameters = {} as SomeOfParsedParameters;

  /**
   * Get vtp_ parameter & remove "vtp_" part from key
   */
  for (const key in element) {
    if (key.indexOf('vtp_') === 0) {
      parameters[key.replace('vtp_', '')] = element[key];
    }
  }

  return parameters;
};

const getFormatParameters = (macro: ContainerElement): ConvertFormat | undefined => {
  const format: ConvertFormat = {};

  if (macro.convert_case_to) {
    format.case = macro.convert_case_to;
  }

  if (macro.convert_false_to) {
    format.false = macro.convert_false_to;
  }

  if (macro.convert_false_to) {
    format.true = macro.convert_false_to;
  }

  if (macro.convert_false_to) {
    format.undefined = macro.convert_undefined_to;
  }

  if (macro.convert_false_to) {
    format.null = macro.convert_null_to;
  }

  if (Object.getOwnPropertyNames(format).length > 0) {
    return format;
  }

  return undefined;
};

const enhanceReferenceForVariableTypes = (parsedVariable: ParsedVariable): void => {
  const { type, variableValues } = parsedVariable;

  if (type === 'URL' && variableValues.component) {
    const { component } = variableValues;
    const description = component === 'URL' ? 'Full URL' : component;

    parsedVariable.reference = `${parsedVariable.reference}: ${description}`;
  }

  if (type === 'Datalayer' || type === 'Cookie') {
    if (variableValues.name) {
      const { name } = variableValues;
      const description = Array.isArray(name) ? 'Concatenated value' : name;

      parsedVariable.reference = `${parsedVariable.reference}: ${description}`;
    }
  }

  if (type === 'Constant') {
    if (variableValues.value) {
      const { value } = variableValues;
      const description = Array.isArray(value) ? 'Concatenated value' : value;

      parsedVariable.reference = `${parsedVariable.reference}: ${description}`;
    }
  }

  if (type === 'Auto event variable') {
    if (variableValues.varType) {
      parsedVariable.reference = `${
        parsedVariable.reference
      }: ${variableValues.varType.toLowerCase()}`;

      if (variableValues.varType === 'ATTRIBUTE') {
        parsedVariable.reference = `${parsedVariable.reference} - ${variableValues.attribute}`;
      }

      if (variableValues.varType === 'URL') {
        const { component } = variableValues;
        const description = component === 'URL' ? 'Full URL' : component;

        parsedVariable.reference = `${parsedVariable.reference} - ${description}`;
      }
    }
  }

  if (type === 'DOM Element') {
    const { selectorType, elementId, elementSelector } = variableValues;
    if (selectorType && (elementId || elementSelector)) {
      parsedVariable.reference = `${parsedVariable.reference} ${selectorType}: ${
        elementId || elementSelector
      }`;
    }
  }

  if (type === 'Event') {
    variableValues.description = 'Datalayer Event name';
  }

  if (parsedVariable.reference.length > 40) {
    parsedVariable.reference = `${parsedVariable.reference.substr(0, 38)}...`;
  }
};

export const parseMacros = (macros: ContainerElement[]): ParseMacrosResponse => {
  const counters: ElementCounter = {};

  const parsedVariables: ParsedVariable[] = [];

  const triggerContextVariables: TriggerContextVariables = {
    eventVariableIndexes: [],
    triggerVariableIndex: undefined,
  };

  const templateContextVariables: TemplateContext = {};

  macros.forEach((macro, index) => {
    /**
     * Get Variable name & type
     */
    const variableNames = getMacroName(macro, counters);

    /**
     * Get Parameters for the variable
     */
    const variableValues = getMacroParameters(macro);

    /**
     * Get Format options if available
     */
    const format = getFormatParameters(macro);

    const parsedMacro = {
      ...variableNames,
      variableValues,
      ...(format ? { format } : null),
    };

    /**
     * Enhance the name/reference of the variable by
     * applying some logic on the type of the variable.
     */
    enhanceReferenceForVariableTypes(parsedMacro);

    /**
     * If the current variable is an 'Event' Variable store the index.
     * this is for later use in trigger parsing.
     */
    if (parsedMacro.type === 'Event') {
      triggerContextVariables.eventVariableIndexes.push(index);
    }

    /**
     * If the current variable is an 'gtm.triggers' variable store the index.
     * This is for later use in trigger parsing.
     */
    if (parsedMacro.reference.match('gtm.triggers')) {
      triggerContextVariables.triggerVariableIndex = index;
    }

    /**
     * Loop Through variableValues. If a ["template", ...] value is found, store
     * the index of the variable & the key of the value. This is to improve
     * the effeciency of the parsing of these templates later in the process.
     */
    Object.entries(variableValues).forEach(([key, value]) => {
      if (value && Array.isArray(value) && value.length > 0 && value[0] === 'template') {
        if (templateContextVariables[String(index)]) {
          templateContextVariables[String(index)].push(key);
        } else {
          templateContextVariables[String(index)] = [key];
        }
      }
    });

    parsedVariables.push(parsedMacro);
  });

  return {
    parsedVariables,
    triggerContextVariables,
    templateContextVariables,
  };
};
