import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, CssBaseline } from '@material-ui/core';

import { ErrorBoundary } from './error-boundary';
import { Header } from './header';
import { Content } from './content';

/**
 * Styling
 */
const useStyles = makeStyles(() => ({
  root: {
    fontFamily: 'Roboto',
  },
}));

/**
 * Parent element for the whole application.
 */
export const App: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <ErrorBoundary>
              <Header />
            </ErrorBoundary>
          </Grid>
          <Grid item xs={12}>
            <ErrorBoundary>
              <Content />
            </ErrorBoundary>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
