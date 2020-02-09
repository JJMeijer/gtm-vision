import { isObject, isEmpty } from '../../utility';

const resolveReferences = function resolveInnerReferencesInContainer(container) {
  const result = container;
  let item = '';
  let cat = '';

  function getMacroReferences(o) {
    const obj = o;

    if (obj.reference) {
      item = obj;
      cat = obj.category;
    }

    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key]) && obj[key].length === 2 && typeof obj[key][0] === 'string' && obj[key][0].match(/^(macro|tag)$/)) {
        let referencedItem = {};
        if (obj[key][0] === 'macro') {
          referencedItem = result.variables[obj[key][1]];
        } else {
          referencedItem = result.tags[obj[key][1]];
        }

        obj[key] = `{{${referencedItem.reference}}}`;

        referencedItem.occurrences = referencedItem.occurrences + 1 || 1;
        referencedItem.usedIn = referencedItem.usedIn || {};
        referencedItem.usedIn[cat] = referencedItem.usedIn[cat] || [];

        const usedInArray = referencedItem.usedIn[cat];
        if (usedInArray.filter(x => x.reference === item.reference).length === 0) {
          usedInArray.push(item);
        }
      } else if (isObject(obj[key]) && !isEmpty(obj[key])) {
        getMacroReferences(obj[key]);
      }
    });
  }

  if (isObject(result) && !isEmpty(result)) {
    getMacroReferences(result);
  }

  return result;
};

export default resolveReferences;
