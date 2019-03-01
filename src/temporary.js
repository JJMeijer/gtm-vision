
  const { variableValues } = macro;
  if (variableValues && variableValues.javascript) {
    const resultArray = [];
    const codeArray = variableValues.javascript.filter(part => part !== 'template');
    codeArray.forEach((code) => {
      if (!Array.isArray(code)) {
        resultArray.push(code);
      } else {
        const varName = code.filter(part => part.toString().match(/\{\{/));
        resultArray.push(varName);
      }
    });
    variableValues.parsedJavascript = resultArray.join('');
  }

  return macro;
};
