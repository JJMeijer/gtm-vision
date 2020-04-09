import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles(theme => ({
  buttonLink: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 400,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    margin: 0,
    paddingRight: theme.spacing(1),
    display: 'inline',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus:': {
      textDecoration: 'underline',
    },
  },
}));

export default function VariableLink(props) {
  const classes = useStyles();
  const { navigation, variableName } = props;

  return (
    <ButtonBase
      disableElevation
      disableFocusRipple
      disableRipple
      className={classes.buttonLink}
      onClick={() => navigation(2, variableName)}
    >
      {variableName}
    </ButtonBase>
  );
}

VariableLink.propTypes = {
  navigation: PropTypes.func.isRequired,
  variableName: PropTypes.string.isRequired,
};
