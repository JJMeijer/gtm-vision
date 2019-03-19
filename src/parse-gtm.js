import parseVariables from './parse-variables';
import parseTags from './parse-tags';
import { parseTriggers, parseTriggerNames } from './parse-triggers';
import resolveReferences from './resolve-references';

const parseGtm = function parseGtmContainer(container) {
  const parsedContainer = {};
  const {
    macros,
    predicates,
    rules,
    tags,
  } = container;

  parsedContainer.variables = parseVariables(macros);
  parsedContainer.tags = parseTags(tags);
  parsedContainer.triggers = parseTriggers(predicates, rules);

  resolveReferences(parsedContainer);

  parsedContainer.triggers.map(parseTriggerNames);

  return parsedContainer;
};

export default parseGtm;
