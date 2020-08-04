import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase } from '@material-ui/core';

import { NAVIGATE, TAB_INDEX_VARIABLES } from '../../../store/constants';

const useStyles = makeStyles((theme) => ({
  buttonLink: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 400,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'left',
    margin: 0,
    padding: 0,
    display: 'inline',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus:': {
      textDecoration: 'underline',
    },
  },
}));

interface VariableLinkProps {
  variableName: string;
}

export const VariableLink: React.FC<VariableLinkProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { variableName } = props;

  const handleClick = (variableReference: string) => {
    dispatch({
      type: NAVIGATE,
      payload: {
        tabIndex: TAB_INDEX_VARIABLES,
        reference: variableReference,
      },
    });
  };

  return (
    <ButtonBase className={classes.buttonLink} onClick={() => handleClick(variableName)}>
      {variableName}
    </ButtonBase>
  );
};
