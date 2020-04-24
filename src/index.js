import React from 'react';
import { render } from 'react-dom';

import App from './components/app';
import { sendError } from './utility';

function renderApp() {
  render(<App />, document.getElementById('app'));
}

window.removeEventListener('error', sendError);
window.addEventListener('error', sendError);

renderApp();

if (module.hot) {
  module.hot.accept();
}
