import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';

import { TriggerConditions } from './trigger-condition';
import { TriggerConnections } from './trigger-connections';
import { Settings } from './settings';

import { State, TriggerT } from '../../../store/types';

export const Trigger: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { triggerValues } = currentElement as TriggerT;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TriggerConditions />
      </Grid>
      {triggerValues && (
        <Grid item xs={12}>
          <Settings />
        </Grid>
      )}
      <Grid item xs={12}>
        <TriggerConnections />
      </Grid>
    </Grid>
  );
};
