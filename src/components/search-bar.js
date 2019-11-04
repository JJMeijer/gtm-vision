import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Tooltip,
  Input,
  Button,
  Select,
} from 'element-react';

import 'element-theme-chalk';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'GTM ID',
      placeholder: 'GTM-NTQ25T',
      value: '',
      valid: true,
      errorMessage: '',
      options: [{
        type: 'GTM ID',
        placeholder: 'GTM-NTQ25T',
        endpoint: '/api/gtm',
      }, {
        type: 'URL',
        placeholder: 'https://www.digital-power.com',
        endpoint: '/api/www',
      }],
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleValueChange(change) {
    this.setState({
      value: change,
      valid: true,
      errorMessage: '',
    });

    const { resultCallback } = this.props;
    resultCallback(null);
  }

  handleTypeChange(type) {
    const { options } = this.state;
    const [{ placeholder }] = options.filter(o => o.type === type);

    this.setState({
      type,
      placeholder,
      value: '',
      valid: true,
    });

    const { resultCallback } = this.props;
    resultCallback(null);
  }

  validate() {
    const { value } = this.state;

    if (value.match(/^GTM-[0-9A-Z]{4,7}$/)) {
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

  handleSubmit(event) {
    event.preventDefault();

    if (this.validate()) {
      const { value, type, options } = this.state;
      const { resultCallback } = this.props;
      const [{ endpoint }] = options.filter(x => x.type === type);
      fetch(`${document.location.origin}${endpoint}`, {
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
    const {
      value,
      type,
      placeholder,
      valid,
      errorMessage,
      options,
    } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} className="searchbar">
        <Tooltip visible={!valid} effect="light" content={errorMessage} placement="bottom" manual>
          <Input
            onChange={this.handleValueChange}
            placeholder={placeholder}
            autoComplete="on"
            value={value}
            append={
              <Button nativeType="submit" type="primary" icon="search" size="large">Get</Button>
            }
            prepend={(
              <Select className="searchtype" size="large" value={type} onChange={this.handleTypeChange}>
                {
                  options.map(option => <Select.Option key={option.type} value={option.type} />)
                }
              </Select>
            )}
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
