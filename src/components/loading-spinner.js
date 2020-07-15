import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  loadingSpace: {
    marginTop: '-10vh',
    padding: theme.spacing(0),
    color: theme.palette.background.paper,
  },
}));

export default function LoadingSpinner() {
  const classes = useStyles();

  return (
    <Grid container spacing={3} direction="column" justify="center" alignItems="center" className={classes.loadingSpace}>
      <CircularProgress size={80} color="inherit" />
    </Grid>
  );
}
