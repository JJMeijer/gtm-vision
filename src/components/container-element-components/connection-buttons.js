import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const buttonOptions = {
  tag: {
    color: 'secondary',
    navigationIndex: 0,
  },
  trigger: {
    color: 'primary',
    navigationIndex: 1,
  },
  exception: {
    color: 'default',
    navigationIndex: 1,
  },
  variable: {
    color: 'default',
    navigationIndex: 2,
  },
};

export default function ConnectionButtons(props) {
  const classes = useStyles();
  const {
    title,
    buttons,
    parentReference,
    type,
    buttonStyle,
    navigation,
  } = props;

  const { color } = buttonOptions[type];
  const { navigationIndex } = buttonOptions[type];

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid item xs={2}>
        <Typography variant="button">{`${title}:`}</Typography>
      </Grid>
      <Grid item xs={10}>
        {buttons.map(buttonReference => (
          <Button
            className={classes.button}
            key={`button-${buttonReference}-${type}-${parentReference}`}
            variant={buttonStyle}
            color={color}
            onClick={() => navigation(navigationIndex, buttonReference)}
          >
            {buttonReference}
          </Button>
        ))}
      </Grid>
    </Grid>
  );
}

ConnectionButtons.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentReference: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string.isRequired,
  navigation: PropTypes.func.isRequired,
};
