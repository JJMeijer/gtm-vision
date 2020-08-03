/**
 * Replace Empty values with a literal "" value;
 */
export const replaceEmptyValues = (stringValue: string): string => {
  if (stringValue === '') {
    return '""';
  }
  return stringValue;
};
