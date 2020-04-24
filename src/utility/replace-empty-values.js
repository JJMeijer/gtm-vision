export default function replaceEmptyValueWithVisualEmptyString(stringValue) {
  if (stringValue === '') {
    return '""';
  }
  return stringValue;
}
