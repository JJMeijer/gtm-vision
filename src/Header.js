import React from 'react';

import stars from './images/stars.png';
import SearchBar from './search-bar';
import parseGtm from './parse-gtm';
import './header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagManagerData: null,
    };

    this.pushTagManagerData = this.pushTagManagerData.bind(this);
  }

  pushTagManagerData(data) {
    this.setState({
      tagManagerData: data,
    });
  }

  render() {
    const { tagManagerData } = this.state;

    if (tagManagerData) {
      parseGtm(tagManagerData);
    }

    return (
      <div className="header">
        <img className="header-image" src={stars} alt="" />
        <div className="header-content">
          <h1 className="title">GTM Insight</h1>
          <SearchBar callbackWithData={this.pushTagManagerData} />
        </div>
      </div>
    );
  }
}

export default Header;
