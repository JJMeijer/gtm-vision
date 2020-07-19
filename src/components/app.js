import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, CssBaseline } from '@material-ui/core';

import ErrorBoundary from './error-boundary';
import Header from './header';
import Content from './content';

const useStyles = makeStyles(() => ({
  root: {
    fontFamily: ['Roboto', 'sans-serif'],
  },
}));

export default function App() {
  const classes = useStyles();
  const [response, pushApiResponse] = useState(null);
  const [loading, setLoadingState] = useState(false);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <ErrorBoundary>
              <Header
                pushApiResponse={pushApiResponse}
                setLoadingState={setLoadingState}
              />
            </ErrorBoundary>
          </Grid>
          <Grid item xs={12}>
            <ErrorBoundary>
              <Content response={response} loading={loading} />
            </ErrorBoundary>

          </Grid>
        </Grid>
      </Container>
    </>
  );
}
