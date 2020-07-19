import React from 'react';
import PropTypes from 'prop-types';

import ConnectionButtons from './connection-buttons';

export default function TriggerConnections(props) {
  const {
    tags,
    exceptions,
    navigation,
    reference,
    triggerChildren,
    triggerParent,
  } = props;

  return (
    <>
      {triggerChildren.length > 0 && (
        <ConnectionButtons
          title="Triggers"
          buttons={triggerChildren.map((x) => x.reference)}
          parentReference={reference}
          type="triggers"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {triggerParent && (
        <ConnectionButtons
          title="Used in Group"
          buttons={[triggerParent]}
          parentReference={reference}
          type="triggers"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {tags.length > 0 && (
        <ConnectionButtons
          title="Trigger for"
          buttons={tags.map((x) => x.match(/{{(.+)}}/)[1])}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {exceptions.length > 0 && (
        <ConnectionButtons
          title="Exception for"
          buttons={exceptions.map((x) => x.match(/{{(.+)}}/)[1])}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
    </>
  );
}

TriggerConnections.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  exceptions: PropTypes.arrayOf(PropTypes.string),
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
  triggerParent: PropTypes.string,
  triggerChildren: PropTypes.arrayOf(PropTypes.string),
};

TriggerConnections.defaultProps = {
  tags: [],
  exceptions: [],
  triggerParent: undefined,
  triggerChildren: [],
};
