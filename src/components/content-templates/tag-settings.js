import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { convertCamelCase } from '../../utility';

const useStyles = makeStyles({
  tagValueKey: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default function TagSettings(props) {
  const classes = useStyles();
  const { tagValues } = props;

  return (
    <>
      <Typography variant="h6">Tag Settings:</Typography>
      {Object.keys(tagValues).map(key => (
        <Grid container spacing={1} key={key}>
          <Grid item xs={3} className={classes.tagValueKey}>
            <Typography variant="subtitle1">{`${convertCamelCase(key)}:`}</Typography>
          </Grid>
          <Grid item xs={5}>
            <TextField fullWidth disabled value={tagValues[key]} />
          </Grid>
        </Grid>
      ))}
    </>
  );
}

TagSettings.propTypes = {
  tagValues: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ])).isRequired,
};
