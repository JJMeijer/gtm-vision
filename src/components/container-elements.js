import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ContainerElementContent from './container-element-content';

const useStyles = makeStyles(theme => ({
  rows: {
    height: 500,
  },
  row: {
    marginRight: 'auto',
    textAlign: 'left',
    maxWidth: '100%',
  },
  rowWrapper: {
    alignItems: 'baseline',
  },
  content: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function ContainerElements(props) {
  const classes = useStyles();
  const {
    tabContent,
    tabInd,
    tabNavigation,
    getIndexFromReference,
  } = props;
  const [rowValues, setRowValues] = useState([0, 0, 0]);

  const handleRowChange = (event, newRowValue) => {
    // eslint-disable-next-line max-len
    setRowValues(prevState => prevState.map((oldRowValue, index) => (index === tabInd ? newRowValue : oldRowValue)));
  };

  const navigation = (tab, row) => {
    tabNavigation(tab);

    const rowIndex = typeof row === 'number' ? row : getIndexFromReference(tab, row);
    // eslint-disable-next-line max-len
    setRowValues(prevState => prevState.map((oldRowValue, index) => (index === tab ? rowIndex : oldRowValue)));
  };

  const tabs = tabContent.map(item => (
    <Tab
      key={item.reference}
      className={classes.row}
      label={item.reference}
      classes={{ wrapper: classes.rowWrapper }}
    />
  ));

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper>
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
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.content}>
            {tabContent[rowValues[tabInd]] && (
              <ContainerElementContent
                data={tabContent[rowValues[tabInd]]}
                navigation={navigation}
              />
            )}
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
  tabNavigation: PropTypes.func.isRequired,
  getIndexFromReference: PropTypes.func.isRequired,
};
