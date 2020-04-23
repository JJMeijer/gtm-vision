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

const convertCamelCase = function convertCamelCaseToSentence(str) {
  const strWithSpaces = str.replace(/([A-Z])/g, ' $1').toLowerCase();
  return strWithSpaces.charAt(0).toUpperCase() + strWithSpaces.slice(1);
};

const errorTracking = function sendErrorsToServer() {
  window.addEventListener('error', (error) => {
    const { name = 'Error', message = 'default error', stack = 'Stack missing' } = error.error;
    const gtmId = window.dataStore ? window.dataStore.gtmId || 'unknown' : 'No Data';
    fetch(`${document.location.origin}/api/error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        message,
        stack,
        gtmId,
      }),
    });
  });

  return true;
};

const replaceEmptyValues = (stringValue) => {
  if (stringValue === '') {
    return '""';
  }
  return stringValue;
};

const sortObjectByKey = (obj) => {
  const keys = Object.keys(obj);
  const orderedObj = {};
  keys.sort().forEach((key) => {
    orderedObj[key] = obj[key];
    return null;
  });
  return orderedObj;
};

export {
  isObject,
  isEmpty,
  convertCamelCase,
  errorTracking,
  replaceEmptyValues,
  sortObjectByKey,
};
