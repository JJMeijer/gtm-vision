import React from 'react';
import PropTypes from 'prop-types';

import ConnectionButtons from './connection-buttons';

export default function VariableConnections(props) {
  const {
    tags,
    variables,
    triggers,
    navigation,
    reference,
  } = props;

  return (
    <>
      {tags.length > 0 && (
        <ConnectionButtons
          title="Used in Tags"
          buttons={tags}
          parentReference={reference}
          type="tag"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {triggers.length > 0 && (
        <ConnectionButtons
          title="Used in Triggers"
          buttons={triggers.map(x => x.reference)}
          parentReference={reference}
          type="trigger"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {variables.length > 0 && (
        <ConnectionButtons
          title="Used in Variables"
          buttons={variables}
          parentReference={reference}
          type="variable"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
    </>
  );
}

VariableConnections.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  variables: PropTypes.arrayOf(PropTypes.string),
  triggers: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
  })),
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
};

VariableConnections.defaultProps = {
  tags: [],
  triggers: [],
  variables: [],
};
