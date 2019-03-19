import React from 'react';
import PropTypes from 'prop-types';

import stars from './images/stars.png';
import SearchBar from './search-bar';
import './header.css';

const Header = (props) => {
  const { resultCallback } = props;
  return (
    <div className="header">
      <img className="header-image" src={stars} alt="" />
      <div className="header-content">
        <h1 className="title">GTM Insight</h1>
        <SearchBar resultCallback={resultCallback} />
      </div>
    </div>
  );
};

Header.propTypes = {
  resultCallback: PropTypes.func.isRequired,
};

export default Header;
