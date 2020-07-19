import React from 'react';
import PropTypes from 'prop-types';

import ContainerContent from './container-content';
import LoadingSpinner from './loading-spinner';

export default function Content(props) {
  const { response, loading } = props;

  if (response) {
    const { parsedContainer, gtmId } = response;

    window.dataStore = {
      parsedContainer,
      gtmId,
    };

    // Return Container
    return <ContainerContent parsedContainer={parsedContainer} gtmId={gtmId} />;
  }

  // Loading Spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (null);
}

Content.propTypes = {
  response: PropTypes.shape({
    parsedContainer: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number,
        PropTypes.object,
        PropTypes.array,
      ]),
    ),
    gtmId: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
};

Content.defaultProps = {
  response: null,
};
