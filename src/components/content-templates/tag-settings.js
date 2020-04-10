import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import VariableLink from './variable-link';
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

export default function TagSettings(props) {
  const classes = useStyles();
  const { tagValues, navigation } = props;

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
      <Typography variant="h6">Tag Settings:</Typography>
      {Object.keys(tagValues).map((key) => {
        if (key !== 'code') {
          const tagValue = tagValues[key];
          const tagValueWithLinks = replaceReferenceWithLink(String(tagValue));

          return (
            <Grid container spacing={1} key={key}>
              <Grid item xs={3} className={classes.settingKey}>
                <Typography variant="subtitle1">{`${convertCamelCase(key)}:`}</Typography>
              </Grid>
              <Grid item xs={5} className={classes.settingValue}>
                <Typography variant="body1" className={classes.settingValueText}>{tagValueWithLinks}</Typography>
              </Grid>
            </Grid>
          );
        }
        return (null);
      })}
    </>
  );
}

TagSettings.propTypes = {
  tagValues: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ])).isRequired,
  navigation: PropTypes.func.isRequired,
};
