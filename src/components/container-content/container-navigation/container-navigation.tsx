import React from 'react';
import { Grid, Paper } from '@material-ui/core';

import { ContainerNavigationTabs } from './container-navigation-tabs';
import ContainerNavigationList from './container-navigation-list';

export const ContainerNavigation: React.FC = () => {
  return (
    <Paper elevation={4}>
      <Grid container direction="column" spacing={0}>
        <Grid item xs={12}>
          <ContainerNavigationTabs />
        </Grid>
        <Grid item xs={12}>
          <ContainerNavigationList />
        </Grid>
      </Grid>
    </Paper>
  );
};
