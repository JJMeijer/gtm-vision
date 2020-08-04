import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Prism from 'prismjs';
import { ConnectionButtons } from './connection-buttons';

import { State, TagType, Element, VariableType } from '../../../store/types';

/**
 * Styles
 */
const useStyles = makeStyles(() => ({
  codeBlock: {
    maxHeight: '50vh',
  },
}));

const extractReferences = (code: string): string[] => {
  const variableList: string[] = [];
  code.split(/({{[^{]+}})/).forEach((codePart) => {
    const variableMatch = codePart.match(/{{(.+)}}/);

    if (variableMatch && variableList.indexOf(variableMatch[1]) === -1) {
      const variableName = variableMatch[1];
      if (variableList.indexOf(variableName) === -1) {
        variableList.push(variableName);
      }
    }
  });

  return variableList;
};

/**
 * Take the html or javascript property from an element and display it in
 * a <pre><code> block. Prism is used for highlighting/formatting that
 * <pre><code> block.
 */
export const CodeBlock: React.FC = () => {
  const classes = useStyles();

  const { currentElement } = useSelector((state: State) => state);
  const { category, reference } = currentElement as Element;

  let code = '';
  let type = '';

  if (category === 'tags') {
    const {
      tagValues: { html },
    } = currentElement as TagType;

    code = html as string;
    type = 'html';
  }

  if (category === 'variables') {
    const {
      variableValues: { javascript },
    } = currentElement as VariableType;

    code = javascript as string;
    type = 'javascript';
  }

  const variableList = extractReferences(code);

  useEffect(() => Prism.highlightAll());

  return (
    <>
      <Typography variant="h6">{`${type.toUpperCase()} (Minified):`}</Typography>
      <pre className={`line-numbers ${classes.codeBlock}`}>
        <code className={`language-${type}`}>{code}</code>
      </pre>
      {variableList.length > 0 && (
        <ConnectionButtons
          title="Variables in Code"
          buttons={variableList}
          parentReference={reference}
          type="variables"
          buttonStyle="outlined"
        />
      )}
    </>
  );
};
