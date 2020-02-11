import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from './search-bar';
import Title from './title';

const useStyles = makeStyles(theme => ({
  header: {
    maxHeight: '40vh',
  },
}))

export default function Header(props) {
  const classes = useStyles();

  const { resultCallback } = props;
  return (
      <Container maxWidth="sm" className={classes.header}>
        <Title titleText="GTM Insight" />
        <SearchBar resultCallback={resultCallback} />
      </Container>
  );
}
