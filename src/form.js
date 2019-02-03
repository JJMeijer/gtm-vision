import React from 'react';
import uniqueId from 'react-html-id';
import '@babel/polyfill';

import FormError from './form-error';

import './form.scss';

class FormGtm extends React.Component {
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
        errorMessage: 'a Value is required',
      });
    } else {
      this.setState({
        valid: false,
        errorMessage: 'The ID you provided is not valid. <br /> a valid GTM container ID looks like "GTM-XXXXXX"',
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
    const { value } = this.state;

    async function getContainer() {
      const location = `${document.location.origin}/api/gtm`;
      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      };

      const response = await fetch(location, settings);

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();
      return data;
    }

    if (this.validate()) {
      getContainer()
        .then(data => console.log(data))
        .catch(err => console.log(err.message));
    }
  }

  render() {
    console.log(this.state);
    const { value, valid, errorMessage } = this.state;

    let errorElement;
    if (!valid) {
      errorElement = <FormError message={errorMessage} />;
    }

    return (
      <form ref={this.formElement} onSubmit={this.handleSubmit}>
        <label htmlFor={this.nextUniqueId()}>
          GTM Container ID:
          <input type="text" id={this.lastUniqueId()} name="gtmid" value={value} onChange={this.handleChange} placeholder="GTM-NTQ25T" />
          {errorElement}
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default FormGtm;
