import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import { CodeBlock } from './code-block';
import { VariableConnections } from './variable-connections';
import { Settings } from './settings';

import { State, VariableType, SettingsValues } from '../../../store/types';

/**
 * Helper Function
 */
const showVariableValues = (variableValues: SettingsValues) => {
  const variableValuesKeys = Object.keys(variableValues);
  if (variableValuesKeys.length > 0) {
    if (variableValuesKeys.length === 1 && variableValuesKeys[0] === 'javascript') {
      return false;
    }
    return true;
  }

  return false;
};

/**
 * React element that is used to display a variable item.
 */
export const Variable: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { variableValues } = currentElement as VariableType;
  const { javascript } = variableValues;

  return (
    <Grid container spacing={3}>
      {javascript && (
        <Grid item xs={12}>
          <CodeBlock />
        </Grid>
      )}
      {showVariableValues(variableValues) && (
        <Grid item xs={12}>
          <Settings />
        </Grid>
      )}
      <Grid item xs={12}>
        <VariableConnections />
      </Grid>
    </Grid>
  );
};
