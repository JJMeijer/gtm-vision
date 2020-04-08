import parseVariables from './parse-variables';
import parseTags from './parse-tags';
import { parseTriggers, parseTriggerNames } from './parse-triggers';
import resolveReferences from './resolve-references';
import parseCode from './parse-code';

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
  parsedContainer.triggers = parsedContainer.triggers.map(parseTriggerNames);

  /**
   * Parse the variable references in code elements of both tags and variables
   */
  parsedContainer.tags = parsedContainer.tags.map(parseCode);
  parsedContainer.variables = parsedContainer.variables.map(parseCode);

  /**
   * Filter out tags & triggers that are used by GTM internally
   * and not defined by the user in the UI
   */
  parsedContainer.tags = parsedContainer.tags.filter(item => !item.type.match('inner_'));
  parsedContainer.triggers = parsedContainer.triggers.filter(item => !item.type.match('inner_'));

  /**
   * Re-Index Tags array. This index is used during navigation of the container
   */
  parsedContainer.tags = parsedContainer.tags.map((tag, index) => {
    const _ = tag;
    _.index = index;
    return _;
  });

  return parsedContainer;
}
