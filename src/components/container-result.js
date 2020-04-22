import React from 'react';
import PropTypes from 'prop-types';

import ContainerTabs from './container-tabs';
import parseGtm from '../parsers/gtm-parser';
import LoadingSpinner from './content-templates/loading-spinner';

export default function ContainerResult(props) {
  const { response, loading } = props;
  let resultElement = <div />;

  // Loading Spinner
  if (loading) {
    resultElement = <LoadingSpinner />;
  }

  if (response) {
    const { resource: data = {}, gtmId } = response;
    window.dataStore = {
      data,
    };

    const parsingStart = performance.now();

    const parsedData = parseGtm(data);

    const parsingTime = Math.round(performance.now() - parsingStart);
    window.dataStore = {
      ...window.dataStore,
      parsedData,
      parsingTime,
      gtmId,
    };

    resultElement = <ContainerTabs parsedData={parsedData} />;
  }

  return resultElement;
}

ContainerResult.propTypes = {
  response: PropTypes.shape({
    resource: PropTypes.objectOf(
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
};
