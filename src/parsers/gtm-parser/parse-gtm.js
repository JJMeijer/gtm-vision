import parseVariables from './parse-variables';
import parseTags from './parse-tags';
import { parseTriggers, parseTriggerNames } from './parse-triggers';
import resolveReferences from './resolve-references';
import parseCode from './parse-code';
import parseTemplate from './parse-template';
import { filterFromTriggers, filterFromTagSeqeuncing } from './filter-inner';

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
   * Parse the ['template', 'text1, {{variable name}}] format within tags to:
   * 'text1 {{variable name}}'
   */
  parsedContainer.tags = parsedContainer.tags.map(parseTemplate);

  /**
   * Filter out tags that are used by GTM internally
   * and not defined by the user in the UI.
   * This is done in 3 places.
   * - The tags array itself
   * - the list of related tags within a trigger object
   * - the tags within the tagSequencing object in a tag object
   */
  parsedContainer.tags = parsedContainer.tags.filter(item => !item.type.match('inner_'));
  parsedContainer.triggers = parsedContainer.triggers.map(filterFromTriggers);
  parsedContainer.tags = parsedContainer.tags.map(filterFromTagSeqeuncing);

  /**
   * Re-Index Tags array. This index is used during navigation of the container
   */
  parsedContainer.tags = parsedContainer.tags.map((tag, index) => {
    const tagObj = tag;
    tagObj.index = index;
    return tagObj;
  });

  return parsedContainer;
}
