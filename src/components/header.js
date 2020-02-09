import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import SearchBarTwo from './search-bar2';

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'hidden',
    maxHeight: '40vh',
  },
  title: {
    textAlign: 'center',
  },
}))

const Header = (props) => {
  const classes = useStyles();

  const { resultCallback } = props;
  return (
      <Container maxWidth="sm" className={classes.root}>
        <h1 className= {classes.title} >GTM Insight</h1>
        <SearchBarTwo resultCallback={resultCallback} />
      </Container>
  );
};

Header.propTypes = {
  resultCallback: PropTypes.func.isRequired,
};

export default Header;
