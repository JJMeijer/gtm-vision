import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ResultTabPanel from './result-tab-panel';

export default function ResultTabs(props) {
  const { parsedData } = props;
  const contentTypes = ['tags', 'triggers', 'variables'];

  const [currentTab, setTabIndex] = useState(0);
  const [rowPosition, setRowPosition] = useState([0, 0, 0]);

  const handleTabChange = (event, newTab) => {
    setTabIndex(newTab);
  };

  const updateRowIndex = (row) => {
    const prevState = rowPosition;
    prevState[currentTab] = row;
    setRowPosition(prevState);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Tags" id="tags-tab" />
          <Tab label="Triggers" id="triggers-tab" />
          <Tab label="Variables" id="variables-tab" />
        </Tabs>
      </AppBar>
      <ResultTabPanel
        tabContent={parsedData[contentTypes[currentTab]]}
        rowInd={rowPosition[currentTab]}
        updateRowIndex={updateRowIndex}
      />
    </>
  );
}

ResultTabs.propTypes = {
  parsedData: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }),
    ),
    triggers: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }),
    ),
    variables: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};
