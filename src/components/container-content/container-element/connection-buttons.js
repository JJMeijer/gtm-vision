import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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

const buttonOptions = {
  tags: {
    color: 'secondary',
    tabName: 'tags',
  },
  triggers: {
    color: 'primary',
    tabName: 'triggers',
  },
  exceptions: {
    color: 'default',
    tabName: 'triggers',
  },
  variables: {
    color: 'default',
    tabName: 'variables',
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

  const { color, tabName } = buttonOptions[type];

  const [showAll, changeShowAll] = useState(false);

  const buttonLimit = 30;
  const filteredButtons = showAll ? buttons : buttons.slice(0, buttonLimit);


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
        {filteredButtons.map(buttonReference => (
          <Button
            className={classes.button}
            key={`button-${buttonReference}-${type}-${parentReference}`}
            variant={buttonStyle}
            color={color}
            onClick={() => navigation(tabName, buttonReference)}
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
