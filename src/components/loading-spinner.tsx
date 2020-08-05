import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CircularProgress } from '@material-ui/core';

/**
 * Styling
 */
const useStyles = makeStyles((theme) => ({
  loadingSpace: {
    marginTop: '-10vh',
    padding: theme.spacing(0),
    color: theme.palette.background.paper,
  },
}));

/**
 * Loading spinner element whil the API gets the container data.
 */
export const LoadingSpinner: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.loadingSpace}
    >
      <CircularProgress size={80} color="inherit" />
    </Grid>
  );
};
