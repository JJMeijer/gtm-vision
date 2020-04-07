import React from 'react';
import PropTypes from 'prop-types';

export default function ContainerContent(props) {
  const { category } = props;

  return (
    <div>{category}</div>
  );
}

ContainerContent.propTypes = {
  category: PropTypes.string.isRequired,
};
