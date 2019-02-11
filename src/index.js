import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

function renderApp() {
  render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), document.getElementById('root'));
}

renderApp();

module.hot.accept(renderApp);
