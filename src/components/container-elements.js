import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(theme => ({
  rows: {
    height: 500,
  },
  row: {
    marginRight: 'auto',
    textAlign: 'left',
  },
  content: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function ContainerElements(props) {
  const classes = useStyles();
  const { tabContent, tabInd } = props;
  const [rowValues, setRowValues] = useState([0, 0, 0]);

  const handleRowChange = (event, newRowValue) => {
    // eslint-disable-next-line max-len
    setRowValues(prevState => prevState.map((oldRowValue, index) => (index === tabInd ? newRowValue : oldRowValue)));
  };

  const tabs = tabContent.map(item => (
    <Tab
      className={classes.row}
      label={item.reference}
      id={item.reference}
    />
  ));

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Tabs
            className={classes.rows}
            scrollButtons="on"
            orientation="vertical"
            variant="scrollable"
            value={rowValues[tabInd]}
            onChange={handleRowChange}
          >
            {tabs}
          </Tabs>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.content}>
            <pre>{JSON.stringify(tabContent[rowValues[tabInd]], 0, 4)}</pre>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

ContainerElements.propTypes = {
  tabContent: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
    }),
  ).isRequired,
  tabInd: PropTypes.number.isRequired,
};