import parseVariables from './parse-variables';
import parseTags from './parse-tags';
import { parseTriggers, parseTriggerNames, parseSpecialTriggers } from './parse-triggers';
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
  let parsedContainer = {
    variables: parseVariables(macros),
    tags: parseTags(tags),
    triggers: parseTriggers(predicates, rules),
  };

  /**
   * Use the new names in all references to tags, triggers & variables
   */
  parsedContainer = resolveReferences(parsedContainer);

  /**
   * Use the resolved references to define meaningful trigger names
   */
  parsedContainer.triggers = parsedContainer.triggers.map(parseTriggerNames);

  /**
   * Extend some special trigger types with information from tags.
   * for example for element visibility  & youtube video triggers
   */
  parsedContainer = parseSpecialTriggers(parsedContainer);

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
   * This is done through 3 actions
   * - filter out 'inner_' tags in the tags array itself
   * - filter out 'inner_' tags from the tags list in a trigger object
   * - filter the 'inner_' tags within the tagSequencing object in a tag object
   * - filter out the 'gtm.triggers' variable from the variable array.
   */
  parsedContainer.tags = parsedContainer.tags.filter(item => !item.type.match('inner_'));
  parsedContainer.triggers = parsedContainer.triggers.map(filterFromTriggers);
  parsedContainer.tags = parsedContainer.tags.map(filterFromTagSeqeuncing);
  parsedContainer.variables = parsedContainer.variables.filter(item => !item.reference.match('gtm.triggers'));

  /**
   * Filter out un-used triggers
   */
  parsedContainer.triggers = parsedContainer.triggers.filter((trigger) => {
    const triggerTags = trigger.tags || [];
    const triggerExceptions = trigger.exceptions || [];

    return triggerTags.length + triggerExceptions.length > 0;
  });

  return parsedContainer;
}
