import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Settings } from './settings';
import { TagConnections } from './tag-connections';
import { TagSequencing } from './tag-sequencing';
import { CodeBlock } from './code-block';

import { State, TagType } from '../../../store/types';

/**
 * React element that is used to display a Tag item.
 */
export const Tag: React.FC = () => {
  const { currentElement } = useSelector((state: State) => state);
  const { tagValues, tagSequencing } = currentElement as TagType;
  const { html } = tagValues;

  return (
    <Grid container spacing={3}>
      {html && (
        <Grid item xs={12}>
          <CodeBlock />
        </Grid>
      )}
      <Grid item xs={12}>
        <Settings />
      </Grid>
      <Grid item xs={12}>
        <TagConnections />
      </Grid>
      {tagSequencing && (
        <Grid item xs={12}>
          <TagSequencing />
        </Grid>
      )}
    </Grid>
  );
};
