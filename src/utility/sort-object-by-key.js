export default function sortObjectAlphabeticallyByKey(obj) {
  const keys = Object.keys(obj);
  const orderedObj = {};
  keys.sort().forEach((key) => {
    orderedObj[key] = obj[key];
    return null;
  });
  return orderedObj;
}
