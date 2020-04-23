import { isObject, isEmpty } from '../../utility';

const resolveReferences = function resolveInnerReferencesInContainer(container) {
  const result = container;
  let item = '';
  let cat = '';

  function getMacroReferences(_obj) {
    const obj = _obj;

    if (obj.reference) {
      item = obj;
      cat = obj.category;
    }

    /**
     * Within the given object a search is done for arrays that look
     * like ["tag/macro", index]. Examples:
     * - ["tag", 1]
     * - ["macro", 1]
     * When found it will be replaced by the tag/macro that is
     * referend through the digit.
     */
    Object.keys(obj).forEach((key) => {
      if (Array.isArray(obj[key]) && obj[key].length === 2 && typeof obj[key][0] === 'string' && obj[key][0].match(/^(macro|tag)$/)) {
        const referencedType = obj[key][0] === 'macro' ? 'variables' : 'tags';
        const referencedIndex = obj[key][1];
        const referencedItem = result[referencedType][referencedIndex];

        /**
         * Replace the array reference (["tag", 0]) with the name of the
         * referenced item, for example: {{Custom HTML (1)}}
         */
        obj[key] = `{{${referencedItem.reference}}}`;

        /**
         * In the referenced Item a 'usedIn' array is made.
         * That array will contain the names of all items in which the item is referenced
         */
        referencedItem.usedIn = referencedItem.usedIn || {};
        referencedItem.usedIn[cat] = referencedItem.usedIn[cat] || [];
        const usedInArray = referencedItem.usedIn[cat];

        /**
         * For Triggers we need the whole object in the usedIn array. this is
         * because later we need to be able to make the distinction if a trigger is
         * used as a real trigger or as an exception.
         */
        if (cat === 'triggers') {
          if (usedInArray.filter(x => x.reference === item.reference).length === 0) {
            usedInArray.push(item);
          }
        }

        /**
         * For Tags & Variables we only push the reference to the usedIn Array. Only
         * The reference is needed and the overall object can become huge with circular
         * references if we push the whole object.
         */
        if (cat === 'tags' || cat === 'variables') {
          if (usedInArray.filter(x => x === item.reference).length === 0) {
            usedInArray.push(item.reference);
          }
        }

      /**
       * If another object is found the search will continue
       * recursively within that deeper object.
       */
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
