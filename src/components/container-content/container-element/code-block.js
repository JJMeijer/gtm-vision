import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Prism from 'prismjs';
import { js, html } from 'js-beautify';
import ConnectionButtons from './connection-buttons';

const useStyles = makeStyles(() => ({
  codeBlock: {
    maxHeight: '50vh',
  },
}));

const beautifierOptions = {
  indent_size: 4,
  indent_char: ' ',
  max_preserve_newlines: 1,
};

export default function CodeBlock(props) {
  const classes = useStyles();
  const {
    codeString,
    codeType,
    navigation,
    reference,
  } = props;

  let beautifiedCode = codeString;
  if (codeType === 'html') {
    beautifiedCode = html(codeString, beautifierOptions);
  }

  if (codeType === 'javascript') {
    beautifiedCode = js(codeString, beautifierOptions);
  }

  const variableList = [];
  // Find Variable Names in Code & Create Links
  beautifiedCode.split(/({{[^{]+}})/).forEach((codePart) => {
    const variableMatch = codePart.match(/{{(.+)}}/);
    if (variableMatch && variableList.indexOf(variableMatch[1]) === -1) {
      const variableName = variableMatch[1];
      if (variableList.indexOf(variableName) === -1) {
        variableList.push(variableName);
      }
    }
  });

  useEffect(() => Prism.highlightAll());

  return (
    <>
      <Typography variant="h6">{`${codeType.toUpperCase()} (Minified):`}</Typography>
      <pre className={`line-numbers ${classes.codeBlock}`}>
        <code className={`language-${codeType}`}>
          {beautifiedCode}
        </code>
      </pre>
      {variableList.length > 0 && (
        <ConnectionButtons
          title="Variables in Code"
          buttons={variableList}
          parentReference={reference}
          type="variables"
          buttonStyle="outlined"
          navigation={navigation}
        />
      )}
    </>
  );
}

CodeBlock.propTypes = {
  codeString: PropTypes.string.isRequired,
  codeType: PropTypes.string.isRequired,
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
};
