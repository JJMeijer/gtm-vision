import React from 'react';
import PropTypes from 'prop-types';

import ContainerTabs from './container-content';
import parseGtm from '../parsers/gtm-parser';
import LoadingSpinner from './loading-spinner';

export default function Content(props) {
  const { response, loading } = props;

  if (response) {
    const { data, gtmId } = response;

    // Parse the Raw GTM data
    const parsedData = parseGtm(data);

    window.dataStore = {
      data,
      parsedData,
      gtmId,
    };

    // Return Container
    return <ContainerTabs parsedData={parsedData} />;
  }

  // Loading Spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (null);
}

Content.propTypes = {
  response: PropTypes.shape({
    data: PropTypes.objectOf(
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
