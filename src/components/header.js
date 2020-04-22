import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from './search-bar';
import Title from './title';

import backGround from '../images/water_1.jpg';

const cssBackgroundString = `-webkit-linear-gradient(rgba(63, 94, 251, 0.8), rgba(255, 70, 107, 0.8)), url(${backGround})`;

const useStyles = makeStyles(() => ({
  root: {
    background: cssBackgroundString,
    minHeight: '70vh',
  },
}));

export default function Header(props) {
  const classes = useStyles();

  const { resultCallback, loadingCallback } = props;
  return (
    <Grid container className={classes.root} spacing={6} direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        <Title />
      </Grid>
      <Grid item xs={12}>
        <SearchBar
          resultCallback={resultCallback}
          loadingCallback={loadingCallback}
        />
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  resultCallback: PropTypes.func.isRequired,
  loadingCallback: PropTypes.func.isRequired,
};
