import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { ConnectionButtons } from './connection-buttons';

import { State, TagType } from '../../../store/types';

/**
 * Element that displays tagSequencing information and generates
 * buttons to the tags that are used for the sequence.
 */
export const TagSequencing: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { tagSequencing = {}, reference } = currentElement as TagType;

  return (
    <>
      <Typography variant="h6">Tag Sequencing:</Typography>
      {Object.getOwnPropertyNames(tagSequencing).map((key) => {
        if (key === 'setup' && tagSequencing.setup) {
          const sequenceText = `Fired before ${reference} fires:`;
          const referencedTagString = tagSequencing.setup.tag as string;
          const referencedTag = referencedTagString.replace(/{|}/g, '');

          return (
            <ConnectionButtons
              key={`sequencing-${key}`}
              title={sequenceText}
              buttons={[referencedTag]}
              parentReference={reference}
              type="tags"
              buttonStyle="contained"
            />
          );
        }

        if (key === 'teardown' && tagSequencing.teardown) {
          const sequenceText = `Fired after ${reference} fires:`;
          const referencedTagString = tagSequencing.teardown.tag as string;
          const referencedTag = referencedTagString.replace(/{|}/g, '');

          return (
            <ConnectionButtons
              key={`sequencing-${key}`}
              title={sequenceText}
              buttons={[referencedTag]}
              parentReference={reference}
              type="tags"
              buttonStyle="contained"
            />
          );
        }

        return null;
      })}
    </>
  );
};
