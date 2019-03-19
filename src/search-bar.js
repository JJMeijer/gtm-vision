import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Tooltip,
  Input,
  Button,
} from 'element-react';

import 'element-theme-chalk';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      valid: true,
      errorMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  validate() {
    const { value } = this.state;

    if (value.match(/^GTM-[0-9A-Z]{6,7}$/)) {
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

  handleChange(change) {
    this.setState({
      value: change,
      valid: true,
      errorMessage: '',
    });
    const { resultCallback } = this.props;
    resultCallback(null);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validate()) {
      const { value } = this.state;
      const { resultCallback } = this.props;

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
        .then(({ resource }) => resultCallback(resource))
        .catch(error => console.log(error));
    }
  }

  render() {
    const { value, valid, errorMessage } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} className="searchbar">
        <Tooltip visible={!valid} effect="light" content={errorMessage} placement="bottom" manual>
          <Input
            onChange={this.handleChange}
            placeholder="GTM-NTQ25T"
            autoComplete="on"
            value={value}
            append={
              <Button nativeType="submit" type="primary" icon="search" size="large">Get</Button>
            }
          />
        </Tooltip>
      </Form>
    );
  }
}

SearchBar.propTypes = {
  resultCallback: PropTypes.func.isRequired,
};

export default SearchBar;
