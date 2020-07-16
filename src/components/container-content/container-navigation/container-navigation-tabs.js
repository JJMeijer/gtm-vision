import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(() => ({
  tabBar: {
    borderRadius: '4px 4px 0px 0px',
  },
  tab: {
    minWidth: '33.333333%',
  },
}));

export default function ContainerNavigationTabs(props) {
  const classes = useStyles();
  const { pushTabChange, tabInd } = props;

  const handleTabChange = (event, newTabIndex) => {
    pushTabChange(newTabIndex);
  };

  return (
    <AppBar position="static" className={classes.tabBar} elevation={0}>
      <Tabs value={tabInd} onChange={handleTabChange}>
        <Tab label="Tags" id="tags-tab" className={classes.tab} />
        <Tab label="Triggers" id="triggers-tab" className={classes.tab} />
        <Tab label="Variables" className={classes.tab} />
      </Tabs>
    </AppBar>
  );
}

ContainerNavigationTabs.propTypes = {
  tabInd: PropTypes.number.isRequired,
  pushTabChange: PropTypes.func.isRequired,
};
