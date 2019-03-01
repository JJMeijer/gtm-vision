import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from './search-bar';
import Title from './title';

import parseGtm from './parse-gtm';

class TagManagerInfo extends React.Component {
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
    const { tagManager } = this.props;
    const { tagManagerData } = this.state;

    let dataElement;
    if (tagManagerData) {
      dataElement = <div>data</div>;
      parseGtm(tagManagerData);
    }

    return (
      <div>
        <Title title={`${tagManager} Insight`} />
        <SearchBar tagManager={tagManager} callbackWithData={this.pushTagManagerData} />
        {dataElement}
      </div>
    );
  }
}

TagManagerInfo.propTypes = {
  tagManager: PropTypes.string.isRequired,
};

export default TagManagerInfo;
