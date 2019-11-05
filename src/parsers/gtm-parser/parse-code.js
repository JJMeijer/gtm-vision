const parseCode = function parseCodeArrays(containerElement) {
  const element = containerElement;
  const { category, type } = element;

  let code = [];
  const destination = containerElement[`${category}Values`];
  if (type === 'Custom javascript') {
    code = destination.javascript;
  }

  if (type === 'Custom HTML') {
    code = destination.html;
  }

  if (code.length > 0) {
    const resultArray = [];
    if (Array.isArray(code)) {
      const codeArray = code.filter(part => part !== 'template');
      codeArray.forEach((block) => {
        if (!Array.isArray(block)) {
          resultArray.push(block);
        } else {
          const referenceName = block.filter(part => part.toString().match(/\{\{/));
          resultArray.push(`"${referenceName}"`);
        }
      });
    } else {
      resultArray.push(code);
    }

    destination.code = resultArray.join('').replace(' type="text/gtmscript"', '');
  }

  return element;
};

export default parseCode;
