import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Header from './header';
import Result from './result';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #4C8BF5 30%, #5d8fe4 90%)',
    fontFamily: ['Roboto', 'sans-serif'],
    display: 'flex',
  },
});

export default function App() {
  const classes = useStyles();
  const [parsedData, pushTagManagerData] = useState(null);

  return (
  <React.Fragment>
    <CssBaseline />
    <Container maxWidth="xl" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header resultCallback={pushTagManagerData} />
        </Grid>
        <Grid item xs={12}>
          <Result parsedData={parsedData} />
        </Grid>
      </Grid>
    </Container>
  </React.Fragment>
  );
}
