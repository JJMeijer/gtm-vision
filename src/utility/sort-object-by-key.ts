export const sortObjectByKey = (obj) => {
  const keys = Object.getOwnPropertyNames(obj);
  const orderedObj = {};
  keys.sort().forEach((key) => {
    orderedObj[key] = obj[key];
    return null;
  });
  return orderedObj;
};
