import React from 'react';
import { Layout } from 'element-react';

import 'element-theme-chalk';

import Header from './header';
import './app.css';

const App = () => (
  <div>
    <Layout.Row>
      <Layout.Col span="24">
        <Header />
      </Layout.Col>
    </Layout.Row>
    <Layout.Row>
      <Layout.Col span="4">
        <div>Results Menu</div>
      </Layout.Col>
      <Layout.Col span="20">
        <div>Resuls Block</div>
      </Layout.Col>
    </Layout.Row>
  </div>
);

export default App;
