import React from 'react';
import PropTypes from 'prop-types';

import './form-error.scss';

function FormError({ message }) {
  return <span>{message}</span>;
}

FormError.propTypes = {
  message: PropTypes.string.isRequired,
};

export default FormError;
