import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { reducer } from './store/reducers';

import { App } from './components/app';
import { sendError } from './components/send-error';

const store = createStore(reducer);

const renderApp = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app'),
  );

  // Remove website loading spinner
  const baseLoadingSpinner = document.querySelector('.baseSpinner');
  if (baseLoadingSpinner && baseLoadingSpinner.parentNode) {
    baseLoadingSpinner.parentNode.removeChild(baseLoadingSpinner);
  }
};

window.removeEventListener('error', sendError);
window.addEventListener('error', sendError);

renderApp();

if (module.hot) {
  module.hot.accept();
}
