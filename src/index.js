import React from 'react';
import { render } from 'react-dom';

import App from './components/app';
import { errorTracking } from './utility';

function renderApp() {
  render(<App />, document.getElementById('app'));
}

errorTracking();
renderApp();

if (module.hot) {
  module.hot.accept();
}
