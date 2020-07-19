import React from 'react';
import { render } from 'react-dom';

import App from './components/app';
import { sendError } from './utility';

function renderApp() {
  render(<App />, document.getElementById('app'));

  // Remove website loading spinner
  const baseLoadingSpinner = document.querySelector('.baseSpinner');
  baseLoadingSpinner.parentNode.removeChild(baseLoadingSpinner);
}

window.removeEventListener('error', sendError);
window.addEventListener('error', sendError);

renderApp();

if (module.hot) {
  module.hot.accept();
}
