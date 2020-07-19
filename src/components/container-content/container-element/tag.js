import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Settings from './settings';
import TagConnections from './tag-connections';
import TagSequencing from './tag-sequencing';
import CodeBlock from './code-block';


export default function Tag(props) {
  const { elementData, navigation } = props;
  const {
    tagValues,
    usedIn,
    tagSequencing,
    reference,
  } = elementData;
  const { triggers, tags } = usedIn;
  const { code } = tagValues;

  return (
    <Grid container spacing={3}>
      {code && (
        <Grid item xs={12}>
          <CodeBlock codeString={code} codeType="html" navigation={navigation} reference={reference} />
        </Grid>
      )}
      <Grid item xs={12}>
        <Settings reference={reference} values={tagValues} navigation={navigation} />
      </Grid>
      <Grid item xs={12}>
        <TagConnections
          reference={reference}
          triggers={triggers}
          tags={tags}
          navigation={navigation}
        />
      </Grid>
      {tagSequencing && (
        <Grid item xs={12}>
          <TagSequencing
            tagSequencingData={tagSequencing}
            reference={reference}
            navigation={navigation}
          />
        </Grid>
      )}
    </Grid>
  );
}

Tag.propTypes = {
  elementData: PropTypes.shape({
    tagValues: PropTypes.shape({
      code: PropTypes.string,
    }),
    usedIn: PropTypes.shape({
      triggers: PropTypes.arrayOf(PropTypes.shape({
        reference: PropTypes.string.isRequired,
      })),
      tags: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
    tagSequencing: PropTypes.objectOf(PropTypes.shape({
      setup: PropTypes.objectOf(PropTypes.string),
      teardown: PropTypes.objectOf(PropTypes.string),
    })),
    reference: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};
