const isObject = function checkIfVariableIsObject(obj) {
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
      item = obj.reference;
      cat = obj.category;
    }

    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key])) {
        if (obj[key].length === 2) {
          if (obj[key][0] === 'macro') {
            const referencedVariable = completeContainer.variables[obj[key][1]];
            obj[key] = `{{${referencedVariable.reference}}}`;

            referencedVariable.usedIn = referencedVariable.usedIn || {};
            referencedVariable.usedIn[cat] = referencedVariable.usedIn[cat] || [];
            const usedInArray = referencedVariable.usedIn[cat];
            if (usedInArray.filter(x => x === item).length === 0) {
              usedInArray.push(item);
            }
          }
          if (obj[key][0] === 'tag') {
            const referencedTag = completeContainer.tags[obj[key][1]];
            obj[key] = `{{${referencedTag.reference}}}`;

            referencedTag.usedIn = referencedTag.usedIn || {};
            referencedTag.usedIn[cat] = referencedTag.usedIn[cat] || [];
            const usedInArray = referencedTag.usedIn[cat];
            if (usedInArray.filter(x => x === item).length === 0) {
              usedInArray.push(item);
            }
          }
        } else {
          getMacroReferences(obj[key]);
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
