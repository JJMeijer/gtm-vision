import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ContainerElementsList from './container-element-list';

const useStyles = makeStyles(theme => ({
  containerResult: {
    marginTop: '-10vh',
    minHeight: '90vh',
    background: theme.palette.background.default,
    borderRadius: 4,
  },
  resultTopBar: {
    borderRadius: 4,
  },
}));

export default function ContainerContent(props) {
  const classes = useStyles();
  const { parsedData } = props;
  const tabTypes = ['tags', 'triggers', 'variables'];

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (event, newTab) => {
    setCurrentTabIndex(newTab);
  };

  const getElementIndex = (tabIndex, elementReference) => {
    const items = parsedData[tabTypes[tabIndex]];
    return items.findIndex(item => item.reference === elementReference);
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
            <Tabs value={currentTabIndex} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Tags" id="tags-tab" />
              <Tab label="Triggers" id="triggers-tab" />
              <Tab label="Variables" id="variables-tab" />
            </Tabs>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          <ContainerElementsList
            tabContent={parsedData[tabTypes[currentTabIndex]]}
            currentTabIndex={currentTabIndex}
            setCurrentTabIndex={setCurrentTabIndex}
            getElementIndex={getElementIndex}
          />
        </Grid>
      </Grid>
    </>
  );
}

ContainerContent.propTypes = {
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
