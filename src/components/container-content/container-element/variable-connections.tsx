import React from 'react';
import { useSelector } from 'react-redux';

import { ConnectionButtons } from './connection-buttons';

import { State, VariableT } from '../../../store/types';

export const VariableConnections: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { reference, usedIn = {} } = currentElement as VariableT;
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
