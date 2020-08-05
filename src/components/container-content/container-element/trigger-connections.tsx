import React from 'react';
import { useSelector } from 'react-redux';

import { ConnectionButtons } from './connection-buttons';

import { State, TriggerType } from '../../../store/types';

/**
 * React Element that generates the buttons that link to the
 * other items that the current item has a relationship with.
 */
export const TriggerConnections: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const {
    reference,
    triggerChildren = [],
    triggerParent,
    tags = [],
    exceptions = [],
  } = currentElement as TriggerType;

  const tagsAsString = tags as string[];
  const exceptionsAsString = exceptions as string[];

  return (
    <>
      {triggerChildren.length > 0 && (
        <ConnectionButtons
          title="Triggers"
          buttons={triggerChildren}
          parentReference={reference}
          type="triggers"
          buttonStyle="contained"
        />
      )}
      {triggerParent && (
        <ConnectionButtons
          title="Used in Group"
          buttons={[triggerParent]}
          parentReference={reference}
          type="triggers"
          buttonStyle="contained"
        />
      )}
      {tags.length > 0 && (
        <ConnectionButtons
          title="Trigger for"
          buttons={tagsAsString.map((ref) => {
            const refMatch = ref.match(/{{(.+)}}/);
            if (refMatch) {
              return refMatch[1];
            }
            return ref;
          })}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
        />
      )}
      {exceptions.length > 0 && (
        <ConnectionButtons
          title="Exception for"
          buttons={exceptionsAsString.map((ref) => {
            const refMatch = ref.match(/{{(.+)}}/);
            if (refMatch) {
              return refMatch[1];
            }
            return ref;
          })}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
        />
      )}
    </>
  );
};
