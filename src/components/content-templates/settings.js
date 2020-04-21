import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import VariableLink from './variable-link';
import ListTable from './list-table';
import { convertCamelCase } from '../../utility';

const useStyles = makeStyles(theme => ({
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

export default function Settings(props) {
  const classes = useStyles();
  const { values, navigation, reference } = props;

  const replaceEmptyValues = (stringValue) => {
    if (stringValue === '') {
      return '""';
    }
    return stringValue;
  };

  const replaceReferenceWithLink = (stringValue) => {
    const stringArray = stringValue.split(/({{[^{]+}})/).filter(x => x !== '');
    return stringArray.map((stringItem) => {
      if (stringItem.match(/{{.+}}/)) {
        const stringReference = stringItem.match(/{{(.+)}}/)[1];
        return (
          <VariableLink
            key={stringReference}
            navigation={navigation}
            variableName={stringReference}
          />
        );
      }
      return stringItem;
    });
  };

  return (
    <>
      <Typography variant="h6">Settings:</Typography>
      {Object.keys(values).map((key) => {
        if (key !== 'code') {
          const settingValue = values[key];

          let settingValueElement;
          if (!Array.isArray(settingValue)) {
            // Replace Empty Strings with literal empty string to make it more clear -> '""'
            let settingValueString = replaceEmptyValues(String(settingValue));

            // Replace References {{Custom Javascript(1)}} with Link Elements
            settingValueString = replaceReferenceWithLink(String(settingValueString));
            settingValueElement = (
              <Grid key={`${reference}-${key}`} item xs={6} className={classes.settingValue}>
                <Typography variant="body1" className={classes.settingValueText}>{settingValueString}</Typography>
              </Grid>
            );
          } else {
            settingValueElement = (
              <Grid key={`${reference}-${key}`} item xs={6} className={classes.settingValue}>
                <ListTable
                  list={settingValue}
                  replaceReferenceWithLink={replaceReferenceWithLink}
                />
              </Grid>
            );
          }

          return (
            <Grid container spacing={1} key={key}>
              <Grid item xs={3} className={classes.settingKey}>
                <Typography variant="subtitle1">{`${convertCamelCase(key)}:`}</Typography>
              </Grid>
              {settingValueElement}
            </Grid>
          );
        }
        return (null);
      })}
    </>
  );
}

Settings.propTypes = {
  values: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.array,
  ])).isRequired,
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
};
