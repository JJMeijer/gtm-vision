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
    paddingLeft: theme.spacing(0.75),
  },
}));

export default function TagSequencing(props) {
  const classes = useStyles();
  const { tagSequencingData, reference, navigation } = props;

  return (
    <>
      <Typography variant="h6">Tag Sequencing:</Typography>
      {Object.keys(tagSequencingData).map((key) => {
        const sequenceText = `Fired ${key === 'setup' ? 'before' : 'after'} ${reference} fires:`;
        const referencedTag = tagSequencingData[key].tag.replace(/{|}/g, '');

        return (
          <Grid key={`${key}-${reference}`} container direction="row" alignItems="center" spacing={1}>
            <Typography className={classes.sequenceText} variant="subtitle1">{sequenceText}</Typography>

            <Button
              variant="contained"
              color="secondary"
              className={classes.tagButton}
              onClick={() => navigation(0, referencedTag)}
            >
              {referencedTag}
            </Button>

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
  navigation: PropTypes.func.isRequired,
};
