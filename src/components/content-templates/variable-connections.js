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

export default function VariableConnections(props) {
  const classes = useStyles();
  const {
    tags,
    variables,
    triggers,
    navigation,
  } = props;

  return (
    <>
      {tags.length > 0 && (
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item xs={1}>
          <Typography variant="h6">Tags:</Typography>
        </Grid>
        <Grid item xs={11}>
          {tags.map(tagReference => (
            <Button
              key={`button-${tagReference}`}
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => navigation(0, tagReference)}
            >
              {tagReference}
            </Button>
          ))}
        </Grid>
      </Grid>
      )}
      {triggers.length > 0 && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <Typography variant="h6">Triggers:</Typography>
          </Grid>
          <Grid item xs={11}>
            {triggers.map((trigger) => {
              const triggerReference = trigger.reference;
              return (
                <Button
                  key={`button-${triggerReference}`}
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
      {variables.length > 0 && (
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item xs={1}>
            <Typography variant="h6">Variables:</Typography>
          </Grid>
          <Grid item xs={11}>
            {variables.map(variableReference => (
              <Button
                key={`button-${variableReference}`}
                variant="contained"
                color="default"
                className={classes.button}
                onClick={() => navigation(2, variableReference)}
              >
                {variableReference}
              </Button>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
}

VariableConnections.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  variables: PropTypes.arrayOf(PropTypes.string),
  triggers: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
  })),
  navigation: PropTypes.func.isRequired,
};

VariableConnections.defaultProps = {
  tags: [],
  triggers: [],
  variables: [],
};
