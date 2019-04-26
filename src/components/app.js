import React from 'react';
import { Layout } from 'element-react';

import parseGtm from '../operations/parse-gtm';
import Header from './header';
import Result from './result';

import 'element-theme-chalk';
import './app.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagManagerData: null,
    };

    this.pushTagManagerData = this.pushTagManagerData.bind(this);
  }

  pushTagManagerData(data) {
    this.setState({
      tagManagerData: data,
    });
  }

  render() {
    const { tagManagerData } = this.state;
    let parsedData;
    if (tagManagerData) {
      parsedData = parseGtm(tagManagerData);
    }

    return (
      <div>
        <Layout.Row>
          <Layout.Col span="24">
            <Header resultCallback={this.pushTagManagerData} />
          </Layout.Col>
        </Layout.Row>
        <Layout.Row>
          <Layout.Col span="24">
            <Result parsedData={parsedData} />
          </Layout.Col>
        </Layout.Row>
      </div>
    );
  }
}

export default App;
