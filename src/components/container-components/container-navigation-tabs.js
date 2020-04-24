import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(() => ({
  tabBar: {
    borderRadius: 4,
  },
  tab: {
    minWidth: '33.333333%',
  },
}));

export default function ContainerNavigationTabs(props) {
  const { pushTabChange, tabInd } = props;

  const handleTabChange = (event, newTabIndex) => {
    pushTabChange(newTabIndex);
  };

  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.tabBar}>
      <Tabs value={tabInd} onChange={handleTabChange}>
        <Tab label="Tags" id="tags-tab" className={classes.tab} />
        <Tab label="Triggers" id="triggers-tab" className={classes.tab} />
        <Tab label="Variables" id="variables-tab" className={classes.tab} />
      </Tabs>
    </AppBar>
  );
}

ContainerNavigationTabs.propTypes = {
  tabInd: PropTypes.number.isRequired,
  pushTabChange: PropTypes.func.isRequired,
};
