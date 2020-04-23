import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ContainerElementsList from './container-elements-list';

const useStyles = makeStyles(theme => ({
  containerResult: {
    minHeight: '90vh',
    background: theme.palette.background.default,
    borderRadius: 4,
  },
  resultTopBar: {
    borderRadius: 4,
  },
}));

export default function ContainerTabs(props) {
  const classes = useStyles();
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

  // Scroll into view (only when data changes)
  const appBarId = 'container-appbar';
  useEffect(() => document.getElementById(appBarId).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }), [parsedData]);

  return (
    <>
      <Grid
        className={classes.containerResult}
        container
        direction="column"
        justify="flex-start"
        spacing={2}
      >
        <Grid item xs={12}>
          <AppBar position="static" id={appBarId} className={classes.resultTopBar}>
            <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Tags" id="tags-tab" />
              <Tab label="Triggers" id="triggers-tab" />
              <Tab label="Variables" id="variables-tab" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          <ContainerElementsList
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
