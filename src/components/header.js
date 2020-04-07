import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from './search-bar';
import Title from './title';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    maxHeight: '40vh',
  },
}));

export default function Header(props) {
  const classes = useStyles();

  const { resultCallback } = props;
  return (
    <Grid container className={classes.root} spacing={3} direction="column" alignItems="center" justify="center">
      <Grid item xs={12}>
        <Title titleText="GTM Insight" />
      </Grid>
      <Grid item xs={12}>
        <SearchBar resultCallback={resultCallback} />
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  resultCallback: PropTypes.func.isRequired,
};
