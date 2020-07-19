import { js, html } from 'js-beautify';

const parseCode = function parseCodeArrays(containerElement) {
  const element = containerElement;
  const { category, type } = element;

  let code = [];
  const destination = category === 'tags' ? element.tagValues : element.variableValues;
  if (type === 'Custom javascript') {
    code = destination.javascript;
    delete destination.javascript;
  }

  if (type === 'Custom HTML') {
    code = destination.html;
    delete destination.html;
  }

  if (code.length > 0) {
    const resultArray = [];
    if (Array.isArray(code)) {
      const codeArray = code.filter(part => part !== 'template');
      codeArray.forEach((block, index) => {
        if (!Array.isArray(block)) {
          resultArray.push(block);
        } else {
          const referenceName = block.filter(part => part.toString().match(/(\{\{[^{]+\}\})/));
          const previousBlock = codeArray[index - 1];
          const nextBlock = codeArray[index + 1];
          if (previousBlock && typeof previousBlock === 'string' && previousBlock.slice(-1) === '"') {
            if (nextBlock && typeof nextBlock === 'string' && nextBlock[0] === '"') {
              resultArray.push(`${referenceName}`);
            } else {
              resultArray.push(`"${referenceName}"`);
            }
          } else {
            resultArray.push(`"${referenceName}"`);
          }
        }
      });
    } else {
      resultArray.push(code);
    }

    const codeString = resultArray.join('').replace(' type="text/gtmscript"', '');

    const beautifierOptions = {
      indent_size: 4,
      indent_char: ' ',
      max_preserve_newlines: 1,
    };

    if (type === 'Custom javascript') {
      destination.code = js(codeString, beautifierOptions);
    }

    if (type === 'Custom HTML') {
      destination.code = html(codeString, beautifierOptions);
    }
  }

  return element;
};

export default parseCode;
