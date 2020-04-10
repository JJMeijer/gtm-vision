import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import TriggerConditions from './trigger-condition';
import TriggerConnections from './trigger-connections';

export default function Trigger(props) {
  const { data, navigation } = props;
  const { conditions, tags, exceptions } = data;
  return (
    <Grid direction="column" container spacing={3}>
      <Grid item xs={12}>
        <TriggerConditions conditions={conditions} navigation={navigation} />
      </Grid>
      <Grid item xs={12}>
        <TriggerConnections tags={tags} exceptions={exceptions} navigation={navigation} />
      </Grid>
    </Grid>
  );
}

Trigger.propTypes = {
  data: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    exceptions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};
