import { ParsedContainer, ParsedVariable, ParsedTag, ParsedTrigger } from '../../types';

const isObjectOrArray = (obj: unknown) => {
  return obj === Object(obj) && typeof obj !== 'function';
};

export const resolveReferences = (parsedContainer: ParsedContainer): void => {
  let sourceElement: ParsedTag | ParsedTrigger | ParsedVariable;
  let category: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolve = (obj: any): void => {
    if (obj.reference) {
      sourceElement = obj;
      category = obj.category;
    }

    Object.getOwnPropertyNames(obj).forEach((key) => {
      if (
        (Array.isArray(obj[key]) && obj[key].length === 2 && obj[key][0] === 'macro') ||
        obj[key][0] === 'tag'
      ) {
        /**
         * If above condition is through the current Object[key] value is an array that looks like
         * ['tag' | 'macro', number]. This is a reference to another object.
         */

        /**
         * Get index of referenced item.
         */
        const referencedIndex = obj[key][1];

        /**
         * Get the Referenced item from variables or tags
         */
        const referencedItem =
          obj[key][0] === 'macro'
            ? parsedContainer.variables[referencedIndex]
            : parsedContainer.tags[referencedIndex];

        /**
         * Replace the array reference (e.g. ["tag", 0]) with the name of the
         * referenced item, for example: {{Custom HTML (1)}}
         */
        obj[key] = `{{${referencedItem.reference}}}`;

        /**
         * Within the referenced Item a 'usedIn' array is made.
         * That array will contain the names of all items in which the item is referenced.
         * for tags & variables only the element reference is given. For triggers the whole
         * object is given for 2 reasons
         * - Later we will use the usedIn array in trigger group tags to update the trigger object
         * - Later we need to know if a trigger was referenced as an exception trigger or as a
         *   normal trigger. We need more context than just the reference name to make this decision.
         *
         * Luckily this does not generate an infitite loop as triggers don't have a usedIn component
         * themselves.
         */
        referencedItem.usedIn = referencedItem.usedIn || {};

        if (category === 'triggers') {
          referencedItem.usedIn.triggers = referencedItem.usedIn.triggers || [];
          const usedInArray = referencedItem.usedIn.triggers;

          const triggerSourceElement = sourceElement as ParsedTrigger;

          const { reference } = triggerSourceElement;

          if (usedInArray.filter((x) => x.reference === reference).length === 0) {
            usedInArray.push(triggerSourceElement);
          }
        }

        if (category === 'variables') {
          referencedItem.usedIn.variables = referencedItem.usedIn.variables || [];
          const usedInArray = referencedItem.usedIn.variables;

          if (usedInArray.filter((x) => x === sourceElement.reference).length === 0) {
            usedInArray.push(sourceElement.reference);
          }
        }

        if (category === 'tags') {
          referencedItem.usedIn.tags = referencedItem.usedIn.tags || [];
          const usedInArray = referencedItem.usedIn.tags;

          if (usedInArray.filter((x) => x === sourceElement.reference).length === 0) {
            usedInArray.push(sourceElement.reference);
          }
        }
      } else if (isObjectOrArray(obj[key])) {
        /**
         * Recursively resolve a deeper object or array.
         */
        resolve(obj[key]);
      }
    });
  };

  if (isObjectOrArray(parsedContainer)) {
    resolve(parsedContainer);
  }
};
