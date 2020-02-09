import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import Header from './header';
import Result from './result';

import './app.css';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    height: '9',
  },
});

export default function App() {
  const classes = useStyles();
  const [parsedData, pushTagManagerData] = useState(null);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header resultCallback={pushTagManagerData} />
        </Grid>
        <Grid item xs={12}>
          <Result parsedData={parsedData} />
        </Grid>
      </Grid>
    </div>
  );
}
