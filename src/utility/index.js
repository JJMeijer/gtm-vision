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
    const { name, message, stack } = error.error;
    fetch(`${document.location.origin}/error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        message,
        stack,
      }),
    });
  });

  return true;
};

export {
  isObject,
  isEmpty,
  convertCamelCase,
  errorTracking,
};
