import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import ConnectionButtons from './connection-buttons';

export default function TagSequencing(props) {
  const { tagSequencingData, reference, navigation } = props;

  return (
    <>
      <Typography variant="h6">Tag Sequencing:</Typography>
      {Object.keys(tagSequencingData).map((key) => {
        const sequenceText = `Fired ${key === 'setup' ? 'before' : 'after'} ${reference} fires:`;
        const referencedTag = tagSequencingData[key].tag.replace(/{|}/g, '');

        return (
          <ConnectionButtons
            key={`sequencing-${key}`}
            title={sequenceText}
            buttons={[referencedTag]}
            parentReference={reference}
            type="tags"
            buttonStyle="contained"
            navigation={navigation}
          />
        );
      })}
    </>
  );
}

TagSequencing.propTypes = {
  tagSequencingData: PropTypes.shape({
    setup: PropTypes.shape({
      tag: PropTypes.string,
      optionText: PropTypes.string,
    }),
    teardown: PropTypes.shape({
      tag: PropTypes.string,
      optionText: PropTypes.string,
    }),
  }).isRequired,
  reference: PropTypes.string.isRequired,
  navigation: PropTypes.func.isRequired,
};
