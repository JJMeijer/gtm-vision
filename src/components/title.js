import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    color: 'white',
  },
});

export default function Title(props) {
  const { titleText } = props;

  const classes = useStyles();
  return (
    <Container className={classes.title}>
      <Typography variant="h1">
        {titleText}
      </Typography>
    </Container>
  );
}

Title.propTypes = {
  titleText: PropTypes.string.isRequired,
};
