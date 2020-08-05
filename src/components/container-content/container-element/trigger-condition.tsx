import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VariableLink } from './variable-link';

import { State, TriggerT } from '../../../store/types';

const useStyles = makeStyles((theme) => ({
  inputLike: {
    borderColor: theme.palette.divider,
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: theme.spacing(1),
    overflowWrap: 'anywhere',
  },
  operator: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  operatorBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const TriggerConditions: React.FC = () => {
  const classes = useStyles();
  const { currentElement } = useSelector((state: State) => state);
  const { conditions, reference } = currentElement as TriggerT;

  const replaceReferenceWithLink = (stringValue: string, index: number) => {
    const stringReferenceMatch = stringValue.match(/{{(.+)}}/);
    if (stringReferenceMatch) {
      const stringReference = stringReferenceMatch[1];
      return <VariableLink key={`${stringReference}-${index}`} variableName={stringReference} />;
    }

    return stringValue;
  };

  return (
    <>
      <Typography variant="h6">Conditions:</Typography>
      {conditions.map((condition, index) => {
        const { variable, operator, value } = condition;
        const variableString = variable as string;

        if (!variableString.match('gtm.triggers')) {
          return (
            <Grid
              key={`${reference}-${variableString}-${operator}-${value}`}
              container
              direction="row"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={4}>
                <Typography variant="subtitle1" className={classes.inputLike}>
                  {replaceReferenceWithLink(variableString, index)}
                </Typography>
              </Grid>
              <Grid item xs={2} className={classes.operatorBox}>
                <Typography variant="body1" className={classes.operator}>
                  {operator}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" className={classes.inputLike}>
                  {value}
                </Typography>
              </Grid>
            </Grid>
          );
        }
        return null;
      })}
    </>
  );
};
