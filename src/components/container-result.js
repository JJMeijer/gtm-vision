import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ContainerTabs from './container-tabs';
import parseGtm from '../parsers/gtm-parser';

const useStyles = makeStyles(theme => ({
  loadingSpace: {
    padding: theme.spacing(4),
  },
}));


export default function ContainerResult(props) {
  const classes = useStyles();
  const { data, loading } = props;
  let resultElement = <div />;

  // Loading Spinner
  if (loading) {
    resultElement = (
      <Grid container spacing={3} direction="column" justify="center" alignItems="center" className={classes.loadingSpace}>
        <CircularProgress size={80} />
      </Grid>
    );
  }

  if (data) {
    window.dataStore = {
      data,
    };

    const parsingStart = performance.now();

    const parsedData = parseGtm(data);

    const parsingTime = Math.round(performance.now() - parsingStart);
    window.dataStore = { ...window.dataStore, parsedData, parsingTime };

    resultElement = <ContainerTabs parsedData={parsedData} />;
  }

  return resultElement;
}

ContainerResult.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object,
      PropTypes.array,
    ]),
  ),
};
