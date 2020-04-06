import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
    height: 650,
  },
  row: {
    textAlign: 'left',
  },
}));

export default function ResultTabPanel(props) {
  const classes = useStyles();
  const { tabContent, rowInd, updateRowIndex } = props;
  const [rowValue, setRowValue] = useState(0);

  useEffect(() => {
    setRowValue(rowInd);
  }, [rowInd]);

  const handleRowChange = (event, newRowValue) => {
    setRowValue(newRowValue);
    updateRowIndex(newRowValue);
  };

  const tabs = tabContent.map((item, index) => <Tab className={classes.row} label={item.reference} id={`vertical-tab-${index}`} />);

  return (
    <div className={classes.root}>
      <Tabs
        className={classes.rows}
        orientation="vertical"
        variant="scrollable"
        value={rowValue}
        onChange={handleRowChange}
      >
        {tabs}
      </Tabs>
      <div>
        <pre>{JSON.stringify(tabContent[rowValue], 0, 4)}</pre>
      </div>
    </div>
  );
}

ResultTabPanel.propTypes = {
  tabContent: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rowInd: PropTypes.number.isRequired,
  updateRowIndex: PropTypes.func.isRequired,
};
