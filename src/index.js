import React from 'react';
import { render } from 'react-dom';

import { i18n } from 'element-react';
import locale from 'element-react/src/locale/lang/en';

import App from './components/app';

i18n.use(locale);

function renderApp() {
  render(<App />, document.body);
}

renderApp();

module.hot.accept(renderApp);
