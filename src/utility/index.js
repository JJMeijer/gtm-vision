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

export { isObject, isEmpty };
