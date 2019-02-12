import React from 'react';
import PropTypes from 'prop-types';

import SearchBar from './search-bar';
import Title from './title';

import parseVariables from './parse-variables';

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
    console.log('tagMangerInfo state: ', this.state);
    const { tagManager } = this.props;
    const { tagManagerData } = this.state;

    let dataElement;
    if (tagManagerData) {
      dataElement = <div>data</div>;
      console.log(parseVariables(tagManagerData.macros));
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
