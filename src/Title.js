import React from 'react';
import PropTypes from 'prop-types';

import './title.css';

const Title = ({ title }) => (
  <h1 className="title">{title}</h1>
);

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
