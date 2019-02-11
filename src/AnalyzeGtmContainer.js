const getVariables = function analyzeGtmVariables(macros) {

  const format = function analyzeFormatInVariable(macro) {
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

  const aev = function analyzeAutoEventVariables(macro) {
    const aevResult = {};

    aevResult.varType;
  };

  const ev = function analyzeEventVariable(macro) {

  };

  const jsm = function analyzeJavascriptVariables(macro) {

  };

  const url = function analyzeUrlVariables(macro) {

  };

  const cookie = function analyzeCookieVariables(macro) {

  };

  const datalayer = function analyzeDatalayerVariables(macro) {

  };

  const settings = function analyzeSettingsVariables(macro) {

  };

  const lookup = function analyzeLookupVariables(macro) {

  };

  const rLookup = function analyzeRegexLookupVariables(macro) {

  };

  const constant = function analyzeConstantVariables(macro) {

  };

  // auto event variables - aev
  // javascrip macros - jsm
  // url variable - u
  // cookie variable -k
  // datalayer variable - v
  // google Analytics settings - gas
  // lookup - smm
  // constant - __c
  // regex match - remm
};

const analyze = function analyzeGtmContainer(data) {
  const result = {};

  result.variables = getVariables(data.macros);
};

export default analyze;
