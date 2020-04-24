import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import ContainerNavigationTabs from './container-navigation-tabs';
import ContainerNavigationList from './container-navigation-list';

export default function ContainerNavigation(props) {
  const {
    parsedData,
    currentTabName,
    currentElementIndex,
    pushNewTabName,
    pushNewElementIndex,
  } = props;

  const tabs = ['tags', 'triggers', 'variables'];

  const currentTabIndex = tabs.indexOf(currentTabName);
  const listElements = parsedData[currentTabName];

  const pushTabChange = (newTabIndex) => {
    const newTabName = tabs[newTabIndex];
    pushNewTabName(newTabName);
  };

  const pushElementIndexChange = (newElementIndex) => {
    pushNewElementIndex(newElementIndex);
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item xs={12}>
        <ContainerNavigationTabs tabInd={currentTabIndex} pushTabChange={pushTabChange} />
      </Grid>
      <Grid item xs={12}>
        <ContainerNavigationList
          elementIndex={currentElementIndex}
          listElements={listElements}
          pushElementIndexChange={pushElementIndexChange}
        />
      </Grid>
    </Grid>
  );
}

ContainerNavigation.propTypes = {
  parsedData: PropTypes.objectOf(
    PropTypes.array,
  ).isRequired,
  currentTabName: PropTypes.string.isRequired,
  currentElementIndex: PropTypes.number.isRequired,
  pushNewTabName: PropTypes.func.isRequired,
  pushNewElementIndex: PropTypes.func.isRequired,
};
