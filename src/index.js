import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';

import FormGtm from './form';
import './index.scss';

if (module.hot) {
  module.hot.accept();
}

function Title({ title }) {
  return <h1 className="title">{title}</h1>;
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

const App = () => (
  <div>
    <Title title="Main Title" />
    <FormGtm />
  </div>
);

render(<App />, document.getElementById('root'));
