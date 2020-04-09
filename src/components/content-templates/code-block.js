import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Prism from 'prismjs';
import { js, html } from 'js-beautify';

import VariableLink from './variable-link';

const beautifierOptions = {
  indent_size: 4,
  indent_char: ' ',
  max_preserve_newlines: 1,
};

export default function CodeBlock(props) {
  const { codeString, codeType, navigation } = props;
  let beautifiedCode = codeString;
  const variableLinks = [];

  // Find Variable Names in Code & Create Links
  codeString.split(/({{[^{]+}})/).forEach((codePart) => {
    const variableMatch = codePart.match(/{{(.+)}}/);
    if (variableMatch) {
      variableLinks.push(
        <VariableLink
          navigation={navigation}
          variableName={variableMatch[1]}
        />,
      );
    }
  });

  if (codeType === 'html') {
    beautifiedCode = html(codeString, beautifierOptions);
  }

  if (codeType === 'javascript') {
    beautifiedCode = js(codeString, beautifierOptions);
  }

  useEffect(() => () => Prism.highlightAll(), [props]);

  return (
    <>
      <Typography variant="h6">{`${codeType.toUpperCase()} (Minified):`}</Typography>
      <pre className="line-numbers">
        <code className={`language-${codeType}`}>
          {beautifiedCode}
        </code>
      </pre>
      {variableLinks.length > 0 && (
        <Typography variant="subtitle1">
          {'Variables in Code: '}
          {variableLinks}
        </Typography>
      )}
    </>
  );
}

CodeBlock.propTypes = {
  codeString: PropTypes.string.isRequired,
  codeType: PropTypes.string.isRequired,
  navigation: PropTypes.func.isRequired,
};
