import React from 'react';
import uniqueId from 'react-html-id';
import PropTypes from 'prop-types';

import SearchError from './SearchError';

import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.formElement = React.createRef();

    this.state = {
      value: '',
      valid: true,
      errorMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);

    uniqueId.enableUniqueIds(this);
  }

  validate() {
    const { value } = this.state;

    if (value.match(/GTM-[0-9A-Z]{6}/)) {
      return true;
    }

    if (value === '') {
      this.setState({
        valid: false,
        errorMessage: 'a value is required',
      });
    } else {
      this.setState({
        valid: false,
        errorMessage: 'The ID you provided is not valid. a valid GTM container ID looks like "GTM-XXXXXX"',
      });
    }

    return false;
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      valid: true,
      errorMessage: '',
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validate()) {
      const { value } = this.state;
      const { callbackWithData } = this.props;

      fetch(`${document.location.origin}/api/gtm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response;
        })
        .then(response => response.json())
        .then(data => callbackWithData(data))
        .catch(error => console.log(error));
    }
  }

  render() {
    console.log('SearchBar state: ', this.state);
    const { value, valid, errorMessage } = this.state;

    let errorElement;
    if (!valid) {
      errorElement = <SearchError message={errorMessage} />;
    }

    return (
      <form ref={this.formElement} onSubmit={this.handleSubmit} className="searchBar">
        <label htmlFor={this.nextUniqueId()}>
          GTM Container ID:
          <input type="text" id={this.lastUniqueId()} name="gtmid" value={value} onChange={this.handleChange} placeholder="GTM-NTQ25T" />
          {errorElement}
        </label>
        <input type="submit" value="Get" />
      </form>
    );
  }
}

SearchBar.propTypes = {
  callbackWithData: PropTypes.func.isRequired,
};

export default SearchBar;
