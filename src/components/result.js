import React from 'react';
import { Tabs } from 'element-react';

import 'element-theme-chalk';

import DataTable from './table-main';
import './result.css';

const Result = (props) => {
  const { parsedData } = props;
  let resultElement = <div />;
  if (parsedData) {
    console.log('parsed: ', parsedData);
    resultElement = (
      <Tabs className="results">
        <Tabs.Pane label="Tags" name="1">
          <DataTable dataType="tags" data={parsedData.tags} />
        </Tabs.Pane>
        <Tabs.Pane label="Triggers" name="2">
          <DataTable dataType="triggers" data={parsedData.triggers} />
        </Tabs.Pane>
        <Tabs.Pane label="Variables" name="3">
          <DataTable dataType="variables" data={parsedData.variables} />
        </Tabs.Pane>
      </Tabs>
    );
  }

  return resultElement;
};

export default Result;
