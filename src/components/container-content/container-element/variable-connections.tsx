import React from 'react';
import { useSelector } from 'react-redux';

import { ConnectionButtons } from './connection-buttons';

import { State, VariableType } from '../../../store/types';

/**
 * React Element that generates the buttons that link to the
 * other items that the current item has a relationship with.
 */
export const VariableConnections: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { reference, usedIn = {} } = currentElement as VariableType;
  const { tags = [], triggers = [], variables = [] } = usedIn;

  return (
    <>
      {tags.length > 0 && (
        <ConnectionButtons
          title="Used in Tags"
          buttons={tags}
          parentReference={reference}
          type="tags"
          buttonStyle="contained"
        />
      )}
      {triggers.length > 0 && (
        <ConnectionButtons
          title="Used in Triggers"
          buttons={triggers.map((x) => x.reference)}
          parentReference={reference}
          type="triggers"
          buttonStyle="contained"
        />
      )}
      {variables.length > 0 && (
        <ConnectionButtons
          title="Used in Variables"
          buttons={variables}
          parentReference={reference}
          type="variables"
          buttonStyle="contained"
        />
      )}
    </>
  );
};
