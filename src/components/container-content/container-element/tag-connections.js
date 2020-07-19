import React from 'react';
import PropTypes from 'prop-types';

import ConnectionButtons from './connection-buttons';

export default function TagConnections(props) {
  const {
    reference,
    triggers,
    tags,
    navigation,
  } = props;

  /**
   * Exceptions (reverse triggers) are originally located within the triggers array
   * So they need to be extracted first to display seperately from the triggers.
   * This is done by looking into the trigger Object and finding out if in the
   * optional exception array the current tag (reference) is mentioned.
   */
  const realTriggers = [];
  const exceptionTriggers = [];
  if (triggers) {
    triggers.forEach((trigger) => {
      if (trigger.exceptions && trigger.exceptions.indexOf(`{{${reference}}}`) !== -1) {
        exceptionTriggers.push(trigger);
      } else {
        realTriggers.push(trigger);
      }
    });
  }

  return (
    <>
      {realTriggers.length > 0 && (
        <ConnectionButtons
          title="Triggers"
          buttons={realTriggers.map((x) => x.reference)}
          parentReference={reference}
          type="triggers"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {exceptionTriggers.length > 0 && (
        <ConnectionButtons
          title="Exceptions"
          buttons={exceptionTriggers.map((x) => x.reference)}
          parentReference={reference}
          type="exceptions"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
      {tags.length > 0 && (
        <ConnectionButtons
          title="Used for Tags"
          buttons={tags}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
          navigation={navigation}
        />
      )}
    </>
  );
}

TagConnections.propTypes = {
  triggers: PropTypes.arrayOf(PropTypes.shape({
    reference: PropTypes.string.isRequired,
  })),
  tags: PropTypes.arrayOf(PropTypes.string.isRequired),
  navigation: PropTypes.func.isRequired,
  reference: PropTypes.string.isRequired,
};

TagConnections.defaultProps = {
  triggers: [],
  tags: [],
};
