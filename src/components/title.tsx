import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    color: 'white',
    marginTop: '-15vh',
  },
});

export const Title: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.title}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h3" align="center">
          GTM Vision
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          a web app to analyze GTM containers. Enter a GTM ID or URL below to start.
        </Typography>
      </Grid>
    </Grid>
  );
};
