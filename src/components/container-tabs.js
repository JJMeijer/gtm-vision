import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ContainerElements from './container-elements';

export default function ContainerTabs(props) {
  const { parsedData } = props;
  const tabTypes = ['tags', 'triggers', 'variables'];

  const [currentTab, setTabIndex] = useState(0);

  const handleTabChange = (event, newTab) => {
    setTabIndex(newTab);
  };

  const getIndexFromReference = (tab, reference) => {
    const items = parsedData[tabTypes[tab]];
    return items.findIndex(item => item.reference === reference);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justify="flex-start"
        spacing={2}
      >
        <Grid item xs={12}>
          <AppBar position="static" id="container-appbar">
            <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Tags" id="tags-tab" />
              <Tab label="Triggers" id="triggers-tab" />
              <Tab label="Variables" id="variables-tab" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          <ContainerElements
            tabInd={currentTab}
            tabContent={parsedData[tabTypes[currentTab]]}
            tabNavigation={setTabIndex}
            getIndexFromReference={getIndexFromReference}
          />
        </Grid>
      </Grid>
    </>
  );
}

ContainerTabs.propTypes = {
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
