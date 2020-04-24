export default function convertCamelCaseToSentence(str) {
  const strWithSpaces = str.replace(/([A-Z])/g, ' $1').toLowerCase();
  return strWithSpaces.charAt(0).toUpperCase() + strWithSpaces.slice(1);
}
