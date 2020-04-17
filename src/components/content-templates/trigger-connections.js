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

export default function TriggerConnections(props) {
  const classes = useStyles();
  const {
    tags,
    exceptions,
    navigation,
    reference,
  } = props;

  return (
    <>
      {tags.length > 0 && (
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Typography variant="button">Trigger for:</Typography>
        {tags.map((tag) => {
          const tagReference = tag.match(/{{(.+)}}/)[1];
          return (
            <Button
              key={`button-${tagReference}-from-${reference}`}
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => navigation(0, tagReference)}
            >
              {tagReference}
            </Button>
          );
        })}
      </Grid>
      )}
      {exceptions.length > 0 && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Typography variant="button">Exception for:</Typography>
          {exceptions.map((exception) => {
            const exceptionReference = exception.match(/{{(.+)}}/)[1];
            return (
              <Button
                key={`button-${exceptionReference}-from-${reference}`}
                variant="contained"
                color="default"
                className={classes.button}
                onClick={() => navigation(0, exceptionReference)}
              >
                {exceptionReference}
              </Button>
            );
          })}
        </Grid>
      )}
    </>
  );
}

TriggerConnections.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  exceptions: PropTypes.arrayOf(PropTypes.string),
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
};

TriggerConnections.defaultProps = {
  tags: [],
  exceptions: [],
};
