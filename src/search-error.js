import React from 'react';
import PropTypes from 'prop-types';

import './search-error.css';

const SearchError = ({ message }) => (
  <span>{message}</span>
);

SearchError.propTypes = {
  message: PropTypes.string.isRequired,
};

export default SearchError;
