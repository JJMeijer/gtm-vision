const variableNames = {
  __e: {
    fullName: 'Event',
    counter: 0,
  },
  __v: {
    fullName: 'Datalayer variable',
    counter: 0,
  },
  __aev: {
    fullName: 'Auto event variable',
    counter: 0,
  },
  __f: {
    fullName: 'HTTP referrer',
    counter: 0,
  },
  __u: {
    fullName: 'URL',
    counter: 0,
  },
  __jsm: {
    fullName: 'Custom javascript',
    counter: 0,
  },
  __k: {
    fullName: 'Cookie',
    counter: 0,
  },
  __j: {
    fullName: 'Javascript',
    counter: 0,
  },
  __c: {
    fullName: 'Constant',
    counter: 0,
  },
  __vis: {
    fullName: 'Visibility',
    counter: 0,
  },
  __d: {
    fullName: 'DOM Element',
    counter: 0,
  },
  __uv: {
    fullName: 'Undefined',
    counter: 0,
  },
  __gas: {
    fullName: 'Google Analytics settings',
    counter: 0,
  },
  __smm: {
    fullName: 'Lookup table',
    counter: 0,
  },
  __remm: {
    fullName: 'Regex lookuptable',
    counter: 0,
  },
  __dbg: {
    fullName: 'Debug mode',
    counter: 0,
  },
  __cid: {
    fullName: 'Container ID',
    counter: 0,
  },
  __ctv: {
    fullName: 'Container Version',
    counter: 0,
  },
  __r: {
    fullName: 'Random Number',
    counter: 0,
  },
};

let parseJs = function parseJavascriptArray(javascriptArray) {
  const resultArray = [];

  javascriptArray.forEach((part) => {
    if (!Array.isArray(part) && part !== 'template') {
      resultArray.push(part);
    } else if (Array.isArray(part)) {

    }
  });
};

const parseFormat = function parseFormatInVariable(macro) {
  const formatOptions = ['case', 'false', 'true', 'null', 'undefined'];
  const formatResult = {};

  formatOptions.forEach((option) => {
    if (macro[`convert_${option}_to`]) {
      if (option === 'case') {
        formatResult[option] = macro[`convert_${option}_to`] === 1 ? 'lowercase' : 'uppercase';
      } else {
        formatResult[option] = macro[`convert_${option}_to`];
      }
    }
  });

  return formatResult;
};

const parseVariables = function parseVariables(macrosArray) {
  const parsedArray = [];

  macrosArray.forEach((macro) => {
    const parsedMacro = {};
    Object.keys(macro).forEach((key) => {
      if (key === 'function') {
        const variableName = variableNames[macro[key]].fullName;
        variableNames[macro[key]].counter += 1;
        const variableCounter = variableNames[macro[key]].counter;

        parsedMacro.variable = variableName;
        parsedMacro.reference = `${variableName} - ${variableCounter}`;
      }

      if (key.match('vtp_')) {
        parsedMacro[key.replace('vtp_', '')] = macro[key];
      }

      if (key.match(/convert_.+_to/)) {
        parsedMacro.format = parseFormat(macro);
      }
    });

    parsedArray.push(parsedMacro);
  });

  return parsedArray;
};

export default parseVariables;
