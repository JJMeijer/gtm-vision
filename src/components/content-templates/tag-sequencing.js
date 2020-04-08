import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  tagButton: {
    margin: theme.spacing(1),
  },
  sequenceText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

export default function TagSequencing(props) {
  const classes = useStyles();
  const { tagSequencingData, reference } = props;

  return (
    <>
      {Object.keys(tagSequencingData).map((key) => {
        const sequenceText = `Fire ${key === 'setup' ? 'before' : 'after'} ${reference} fires:`;
        return (
          <Grid container spacing={1}>
            <Grid item xs={4} className={classes.sequenceText}>
              <Typography variant="subtitle1">{sequenceText}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="secondary" className={classes.tagButton}>{tagSequencingData[key].tag}</Button>
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}

TagSequencing.propTypes = {
  tagSequencingData: PropTypes.shape({
    setup: PropTypes.shape({
      tag: PropTypes.string,
      optionText: PropTypes.string,
    }),
    teardown: PropTypes.shape({
      tag: PropTypes.string,
      optionText: PropTypes.string,
    }),
  }).isRequired,
  reference: PropTypes.string.isRequired,
};
