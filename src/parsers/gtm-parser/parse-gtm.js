import parseVariables from './parse-variables';
import parseTags from './parse-tags';
import { parseTriggers, parseTriggerNames } from './parse-triggers';
import resolveReferences from './resolve-references';
import parseCode from './parse-code';
import removeInner from './remove-inner';

export default function parseGtm(container) {
  const {
    macros,
    predicates,
    rules,
    tags,
  } = container;

  /**
   * Parse the GTM container by giving meaningful names to the elements
   * and organizing the object.
   */
  const parsedContainer = {
    variables: parseVariables(macros),
    tags: parseTags(tags),
    triggers: parseTriggers(predicates, rules),
  };

  /**
   * Use the new names in all references to tags, triggers & variables
   */
  resolveReferences(parsedContainer);

  /**
   * Use the resolved references to define meaningful trigger names
   */
  parsedContainer.triggers.map(parseTriggerNames);

  /**
   * Parse the variable references in code elements of both tags and variables
   */
  parsedContainer.tags.map(parseCode);
  parsedContainer.variables.map(parseCode);

  /**
   * Filter out tags & triggers that are used by GTM internally
   * and not defined by the user in the UI
   */
  removeInner(parsedContainer);

  return parsedContainer;
}
