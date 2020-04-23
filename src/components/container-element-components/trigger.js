import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import TriggerConditions from './trigger-condition';
import TriggerConnections from './trigger-connections';
import Settings from './settings';

export default function Trigger(props) {
  const { data, navigation } = props;
  const {
    conditions,
    tags,
    exceptions,
    triggerValues,
    reference,
    triggerChildren,
    triggerParent,
  } = data;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TriggerConditions conditions={conditions} navigation={navigation} reference={reference} />
      </Grid>
      {triggerValues && (
        <Grid item xs={12}>
          <Settings reference={reference} values={triggerValues} navigation={navigation} />
        </Grid>
      )}
      <Grid item xs={12}>
        <TriggerConnections
          tags={tags}
          exceptions={exceptions}
          navigation={navigation}
          reference={reference}
          triggerParent={triggerParent}
          triggerChildren={triggerChildren}
        />
      </Grid>
    </Grid>
  );
}

Trigger.propTypes = {
  data: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    exceptions: PropTypes.arrayOf(PropTypes.string),
    triggerValues: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.array,
    ])),
    triggerParent: PropTypes.string,
    triggerChildren: PropTypes.arrayOf(PropTypes.string),
    reference: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};
