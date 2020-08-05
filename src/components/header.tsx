import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { SearchBar } from './search-bar';
import { Title } from './title';
import backGround from 'url:../images/water_1.png';

const cssBackgroundString = `-webkit-linear-gradient(rgba(25, 118, 210, 0.8), rgba(255, 70, 107, 0.8)), url(${backGround})`;

const useStyles = makeStyles(() => ({
  header: {
    background: cssBackgroundString,
    minHeight: '70vh',
  },
}));

export const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.header}
      spacing={6}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <Title />
      </Grid>
      <Grid item xs={12}>
        <SearchBar />
      </Grid>
    </Grid>
  );
};
