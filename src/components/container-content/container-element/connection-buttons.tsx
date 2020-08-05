import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import {
  NAVIGATE,
  TAB_INDEX_TAGS,
  TAB_INDEX_TRIGGERS,
  TAB_INDEX_VARIABLES,
} from '../../../store/constants';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  showButton: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 400,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    margin: 0,
    padding: 0,
    display: 'inline',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus:': {
      textDecoration: 'underline',
    },
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'dotted',
    borderBottomWidth: '1px',
  },
}));

interface ButtonOption {
  color: 'primary' | 'secondary' | 'default';
  tabIndex: 0 | 1 | 2;
}

interface ButtonOptions {
  [key: string]: ButtonOption;
}

const buttonOptions: ButtonOptions = {
  tags: {
    color: 'secondary',
    tabIndex: TAB_INDEX_TAGS,
  },
  triggers: {
    color: 'primary',
    tabIndex: TAB_INDEX_TRIGGERS,
  },
  exceptions: {
    color: 'default',
    tabIndex: TAB_INDEX_TRIGGERS,
  },
  variables: {
    color: 'default',
    tabIndex: TAB_INDEX_VARIABLES,
  },
};

interface ConnectionButtonsProps {
  title: string;
  buttons: string[];
  parentReference: string;
  type: string;
  buttonStyle: 'text' | 'outlined' | 'contained';
}

export const ConnectionButtons: React.FC<ConnectionButtonsProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { title, buttons, parentReference, type, buttonStyle } = props;

  const { color, tabIndex } = buttonOptions[type];

  const [showAll, changeShowAll] = useState(false);

  const buttonLimit = 30;
  const filteredButtons = showAll ? buttons : buttons.slice(0, buttonLimit);

  const handleClick = (buttonReference: string) => {
    dispatch({
      type: NAVIGATE,
      payload: {
        tabIndex: tabIndex,
        reference: buttonReference,
      },
    });
  };

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid item xs={2}>
        <Typography variant="button">{`${title}:`}</Typography>
        {buttons.length > buttonLimit && (
          <Typography
            variant="subtitle1"
            className={classes.showButton}
            onClick={() => changeShowAll(!showAll)}
          >
            {` Show ${showAll ? 'Less' : 'All'}`}
          </Typography>
        )}
      </Grid>
      <Grid item xs={10}>
        {filteredButtons.map((buttonReference) => (
          <Button
            className={classes.button}
            key={`button-${buttonReference}-${type}-${parentReference}`}
            variant={buttonStyle}
            color={color}
            onClick={() => handleClick(buttonReference)}
          >
            {buttonReference}
          </Button>
        ))}
      </Grid>
    </Grid>
  );
};
