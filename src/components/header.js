import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import SearchBar from './search-bar';
import Title from './title';
import backGround from '../images/water_1.webp';

const cssBackgroundString = `-webkit-linear-gradient(rgba(25, 118, 210, 0.8), rgba(255, 70, 107, 0.8)), url(${backGround})`;

const useStyles = makeStyles(() => ({
  header: {
    background: cssBackgroundString,
    minHeight: '70vh',
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { pushApiResponse, setLoadingState } = props;

  return (
    <Grid container className={classes.header} spacing={6} direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        <Title />
      </Grid>
      <Grid item xs={12}>
        <SearchBar
          pushApiResponse={pushApiResponse}
          setLoadingState={setLoadingState}
        />
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  pushApiResponse: PropTypes.func.isRequired,
  setLoadingState: PropTypes.func.isRequired,
};
