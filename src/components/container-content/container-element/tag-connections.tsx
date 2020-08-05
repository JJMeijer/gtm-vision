import React from 'react';
import { useSelector } from 'react-redux';

import { ConnectionButtons } from './connection-buttons';

import { State, TagType, TriggerType } from '../../../store/types';

/**
 * React Element that generates the buttons that link to the
 * other items that the current item has a relationship with.
 */
export const TagConnections: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { reference, usedIn = {} } = currentElement as TagType;

  const { triggers, tags = [] } = usedIn;
  /**
   * Exceptions (reverse triggers) are originally located within the triggers array
   * So they need to be extracted first to display seperately from the triggers.
   * This is done by looking into the trigger Object and finding out if in the
   * optional exception array the current tag (reference) is mentioned.
   */
  const realTriggers: TriggerType[] = [];
  const exceptionTriggers: TriggerType[] = [];
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
        />
      )}
      {exceptionTriggers.length > 0 && (
        <ConnectionButtons
          title="Exceptions"
          buttons={exceptionTriggers.map((x) => x.reference)}
          parentReference={reference}
          type="exceptions"
          buttonStyle="contained"
        />
      )}
      {tags.length > 0 && (
        <ConnectionButtons
          title="Used for Tags"
          buttons={tags}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
        />
      )}
    </>
  );
};
