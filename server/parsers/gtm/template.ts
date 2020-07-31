import { js, html } from 'js-beautify';
import { ParsedTag, ParsedVariable, TemplateContext, Template } from './types';

const parseTemplate = (param: string, template: Template): string => {
  const [, ...templateContent] = template;

  const resultArray: string[] = [];

  templateContent.forEach((partOfTemplate) => {
    if (typeof partOfTemplate === 'string') {
      resultArray.push(partOfTemplate);
    }

    if (Array.isArray(partOfTemplate) && partOfTemplate[0] === 'escape') {
      const [, reference, type] = partOfTemplate;

      /**
       * There seems to be some logic in the additional numbers in the 'escape' array
       * to determine if a GTM {{variable_name}} is typed as "{{variable_name}}" or not.
       * I'm not 100% sure I fully understand all options here.
       */
      if (typeof reference === 'string') {
        if (type > 7) {
          resultArray.push(`"${reference}"`);
        } else {
          resultArray.push(reference);
        }
      }
    }
  });

  const resultString = resultArray.join('');

  const beautifierOptions = {
    indent_size: 4,
    indent_char: ' ',
    max_preserve_newlines: 1,
  };

  if (param === 'html') {
    return html(unescape(resultString).replace(' type="text/gtmscript"', ''), beautifierOptions);
  }

  if (param === 'javascript') {
    return js(resultString, beautifierOptions);
  }

  return resultString;
};

export const parseTemplatesAndCode = (
  parsedTags: ParsedTag[],
  parsedVariables: ParsedVariable[],
  templateContextVariables: TemplateContext,
  templateContextTags: TemplateContext,
): void => {
  Object.entries(templateContextTags).forEach(([key, templateParams]) => {
    const tagIndex = parseInt(key);
    const { tagValues } = parsedTags[tagIndex];

    templateParams.forEach((param) => {
      tagValues[param] = parseTemplate(param, tagValues[param] as Template);
    });
  });

  Object.entries(templateContextVariables).forEach(([key, templateParams]) => {
    const variableIndex = parseInt(key);
    const { variableValues } = parsedVariables[variableIndex];

    templateParams.forEach((param) => {
      variableValues[param] = parseTemplate(param, variableValues[param] as Template);
    });
  });
};
