import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Settings from './settings';
import TagConnections from './tag-connections';
import TagSequencing from './tag-sequencing';
import CodeBlock from './code-block';

export default function Tag(props) {
  const { data, navigation } = props;
  const {
    tagValues,
    usedIn,
    tagSequencing,
    reference,
  } = data;
  const { trigger: triggers, tag: tags } = usedIn;
  const { code } = tagValues;

  return (
    <Grid container spacing={3}>
      {code && (
        <Grid item xs={12}>
          <CodeBlock codeString={code} codeType="html" navigation={navigation} />
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
  data: PropTypes.shape({
    tagValues: PropTypes.shape({
      code: PropTypes.string,
    }),
    usedIn: PropTypes.shape({
      trigger: PropTypes.arrayOf(PropTypes.shape({
        reference: PropTypes.string.isRequired,
      })),
      tag: PropTypes.arrayOf(PropTypes.shape({
        reference: PropTypes.string.isRequired,
      })),
    }),
    tagSequencing: PropTypes.objectOf(PropTypes.shape({
      setup: PropTypes.objectOf(PropTypes.string),
      teardown: PropTypes.objectOf(PropTypes.string),
    })),
    reference: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};
