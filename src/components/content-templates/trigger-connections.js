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
    triggerChildren,
    triggerParent,
  } = props;

  return (
    <>
      {triggerChildren.length > 0 && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <Typography variant="button">Triggers:</Typography>
          </Grid>
          <Grid item xs={11}>
            {triggerChildren.map((trigger) => {
              const { reference: triggerReference } = trigger;
              return (
                <Button
                  key={`button-${triggerReference}-from-${reference}`}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => navigation(1, triggerReference)}
                >
                  {triggerReference}
                </Button>
              );
            })}
          </Grid>
        </Grid>
      )}
      {triggerParent && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <Typography variant="button">Used in Group:</Typography>
          </Grid>
          <Grid item xs={11}>
            <Button
              key={`button-${triggerParent}-from-${reference}`}
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => navigation(1, triggerParent)}
            >
              {triggerParent}
            </Button>
          </Grid>
        </Grid>
      )}
      {tags.length > 0 && (
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={1}>
          <Typography variant="button">Trigger for:</Typography>
        </Grid>
        <Grid item xs={11}>
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
      </Grid>
      )}
      {exceptions.length > 0 && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <Typography variant="button">Exception for:</Typography>
          </Grid>
          <Grid item xs={11}>
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
  triggerParent: PropTypes.string,
  triggerChildren: PropTypes.arrayOf(PropTypes.string),
};

TriggerConnections.defaultProps = {
  tags: [],
  exceptions: [],
  triggerParent: undefined,
  triggerChildren: [],
};
