import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from '@material-ui/core/styles/makeStyles';

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
      <Helmet>
        <title>GTM Vision</title>
        <meta charset="UTF-8" />
        <meta name="description" content="a Web App to analyze Google Tag Manager containers." />
        <link rel="canonical" href="https://www.gtm-vision.com/" />
      </Helmet>
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
