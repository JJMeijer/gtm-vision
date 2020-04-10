import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function TagConnections(props) {
  const classes = useStyles();
  const {
    reference,
    triggers,
    tags,
    navigation,
  } = props;

  /**
   * Exceptions (reverse triggers) are originally located within the triggers array
   * So they need to be extracted first to display seperately from the triggers.
   * This is done by looking into the trigger Object and finding out if in the
   * optional exception array the current tag (reference) is mentioned.
   */
  const realTriggers = [];
  const exceptionTriggers = [];
  if (triggers) {
    triggers.forEach((trigger) => {
      if (trigger.exceptions && trigger.exceptions.indexOf(`{{${reference}}}`) !== -1) {
        exceptionTriggers.push(trigger);
      } else {
        realTriggers.push(trigger);
      }
    });
  }

  return (
    <>
      {realTriggers.length > 0 && (
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Typography variant="h6">Triggers:</Typography>
        {realTriggers.map(item => (
          <Button
            key={`button-${item.reference}`}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => navigation(1, item.index)}
          >
            {item.reference}
          </Button>
        ))}
      </Grid>
      )}
      {exceptionTriggers.length > 0 && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Typography variant="h6">Exceptions:</Typography>
          {exceptionTriggers.map(item => (
            <Button
              key={`button-${item.reference}`}
              variant="contained"
              color="warning"
              className={classes.button}
              onClick={() => navigation(1, item.index)}
            >
              {item.reference}
            </Button>
          ))}
        </Grid>
      )}
      {tags.length > 0 && (
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Typography variant="h6">Used for Tags:</Typography>
        {tags.map(item => (
          <Button
            key={`button-${item.reference}`}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => navigation(0, item.index)}
          >
            {item.reference}
          </Button>
        ))}
      </Grid>
      )}
    </>
  );
}

TagConnections.propTypes = {
  triggers: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  })),
  tags: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
  })),
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
};

TagConnections.defaultProps = {
  triggers: [],
  tags: [],
};
