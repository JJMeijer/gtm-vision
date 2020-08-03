import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';

import { UPDATE_TAB } from '../../../store/constants';
import { State } from '../../../store/types';

const useStyles = makeStyles(() => ({
  tabBar: {
    borderRadius: '4px 4px 0px 0px',
  },
  tab: {
    minWidth: '33.333333%',
  },
}));

export const ContainerNavigationTabs: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleTabChange = (_event: React.ChangeEvent<unknown>, newTabIndex: number) => {
    dispatch({
      type: UPDATE_TAB,
      payload: newTabIndex,
    });
  };

  const { currentTab } = useSelector((state: State) => state.navigation);

  return (
    <AppBar position="static" className={classes.tabBar} elevation={0}>
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Tags" id="tags-tab" className={classes.tab} />
        <Tab label="Triggers" id="triggers-tab" className={classes.tab} />
        <Tab label="Variables" className={classes.tab} />
      </Tabs>
    </AppBar>
  );
};
