import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { VariableLink } from './variable-link';
import { ListTable } from './list-table';

import {
  convertToSentenceCaseWithSpaces,
  replaceEmptyValues,
  sortObjectByKey,
} from '../../../utility';

import {
  State,
  Element,
  TagT,
  TriggerT,
  VariableT,
  SettingsValues,
  ListOptions,
} from '../../../store/types';

const useStyles = makeStyles((theme) => ({
  settingKey: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  settingValue: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  settingValueText: {
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'dotted',
    borderBottomWidth: '1px',
  },
}));

const settingKeyBlacklist = [
  'code',
  'enableRecaptchaOption',
  'enableUaRlsa',
  'enableUseInternalVersion',
  'trackTypeIs',
  'trackTypeIsEvent',
  'enableFirebaseCampaignData',
  'enableEditJsMacroBehavior',
  'enableIframeMode',
];

export const replaceReferenceWithLink = (stringValue: string): (ReactElement | string)[] => {
  const stringArray = stringValue.split(/({{[^{]+}})/).filter((x) => x !== '');
  return stringArray.map((stringItem) => {
    const referenceMatch = stringItem.match(/{{.+}}/);
    if (referenceMatch) {
      const stringReference = referenceMatch[1];
      return <VariableLink key={stringReference} variableName={stringReference} />;
    }
    return stringItem;
  });
};

export const Settings: React.FC = () => {
  const classes = useStyles();

  const { currentElement } = useSelector((state: State) => state);
  const { category, reference } = currentElement as Element;

  let values: SettingsValues = {};

  if (category === 'tags') {
    const { tagValues } = currentElement as TagT;
    values = tagValues;
  }

  if (category === 'triggers') {
    const { triggerValues } = currentElement as TriggerT;
    if (triggerValues) {
      values = triggerValues;
    }
  }

  if (category === 'variables') {
    const { variableValues } = currentElement as VariableT;
    values = variableValues;
  }

  const sortedValues = sortObjectByKey(values);
  return (
    <>
      <Typography variant="h6">Settings:</Typography>
      {Object.keys(sortedValues).map((key) => {
        if (settingKeyBlacklist.indexOf(key) === -1) {
          const settingValue = values[key];

          let settingValueElement;
          if (!Array.isArray(settingValue)) {
            // Replace Empty Strings with literal empty string to make it more clear -> '""'
            const settingValueString = replaceEmptyValues(String(settingValue));

            // Replace References {{Custom Javascript(1)}} with Link Elements
            const settingValueStringWithLinks = replaceReferenceWithLink(
              String(settingValueString),
            );
            settingValueElement = (
              <Grid key={`${reference}-${key}`} item xs={7} className={classes.settingValue}>
                <Typography variant="body1" className={classes.settingValueText}>
                  {settingValueStringWithLinks}
                </Typography>
              </Grid>
            );
          } else {
            const settingValueList = settingValue as ListOptions;
            settingValueElement = (
              <Grid key={`${reference}-${key}`} item xs={7} className={classes.settingValue}>
                <ListTable list={settingValueList} />
              </Grid>
            );
          }

          return (
            <Grid container spacing={1} key={key}>
              <Grid item xs={3} className={classes.settingKey}>
                <Typography variant="subtitle1">{`${convertToSentenceCaseWithSpaces(
                  key,
                )}:`}</Typography>
              </Grid>
              {settingValueElement}
            </Grid>
          );
        }
        return null;
      })}
    </>
  );
};
