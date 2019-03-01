import parseVariables from './parse-variables';
import parseTags from './parse-tags';
import parseTriggers from './parse-triggers';
import resolveReferences from './resolve-references';

const parseGtm = function parseGtmContainer(container) {
  const parsedContainer = {};
  const {
    macros,
    predicates,
    rules,
    tags,
  } = container;

  const startPerf = performance.now();

  parsedContainer.variables = parseVariables(macros);
  parsedContainer.tags = parseTags(tags);
  parsedContainer.triggers = parseTriggers(predicates, rules);

  resolveReferences(parsedContainer);

  console.log(`timing: ${(performance.now() - startPerf).toFixed(2)}ms`);
  console.log(parsedContainer);
};

export default parseGtm;
