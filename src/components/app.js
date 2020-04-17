import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Header from './header';
import ContainerResult from './container-result';

const useStyles = makeStyles({
  root: {
    fontFamily: ['Roboto', 'sans-serif'],
    display: 'flex',
  },
});

export default function App() {
  const classes = useStyles();
  const [data, pushTagManagerData] = useState(null);
  const [loading, setLoadingState] = useState(false);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Header resultCallback={pushTagManagerData} loadingCallback={setLoadingState} />
          </Grid>
          <Grid item xs={12}>
            <ContainerResult data={data} loading={loading} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
