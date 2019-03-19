const isObject = function checkIfSomethingIsObject(obj) {
  return obj === Object(obj);
};

const isEmpty = function checkIfObjectIsEmpty(obj) {
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
    return true;
  });
};

const resolveReferences = function resolveInnerReferencesInContainer(completeContainer) {
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
          referencedItem = completeContainer.variables[obj[key][1]];
        } else {
          referencedItem = completeContainer.tags[obj[key][1]];
        }

        obj[key] = `{{${referencedItem.reference}}}`;

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

  if (isObject(completeContainer) && !isEmpty(completeContainer)) {
    getMacroReferences(completeContainer);
  }
};

export default resolveReferences;
