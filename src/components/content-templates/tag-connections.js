import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function TagConnections(props) {
  const classes = useStyles();
  const { triggers, tags, navigation } = props;

  return (
    <>
      {triggers && (
      <>
        <Typography variant="h6">Triggers:</Typography>
        {triggers.map(item => (
          <Button
            key={`button-${item.reference}`}
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => navigation(1, item.index)}
          >
            {item.reference}
          </Button>
        ))}
      </>
      )}
      {tags && (
      <>
        <Typography variant="h6">Used for Tags:</Typography>
        {tags.map(item => (
          <Button
            key={`button-${item.reference}`}
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => navigation(0, item.index)}
          >
            {item.reference}
          </Button>
        ))}
      </>
      )}
    </>
  );
}

TagConnections.propTypes = {
  triggers: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
  })),
  tags: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
  })),
  navigation: PropTypes.func.isRequired,
};

TagConnections.defaultProps = {
  triggers: undefined,
  tags: undefined,
};
