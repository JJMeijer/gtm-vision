/**
 * Convert "camelCase" -> sentencase with spaces "Camel case"
 */
export const convertToSentenceCaseWithSpaces = (str: string): string => {
  const strWithSpaces = str.replace(/([A-Z])/g, ' $1').toLowerCase();
  return strWithSpaces.charAt(0).toUpperCase() + strWithSpaces.slice(1);
};
