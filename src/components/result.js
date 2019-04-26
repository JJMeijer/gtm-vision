import React from 'react';
import { Tabs } from 'element-react';

import 'element-theme-chalk';

import DataTable from './data-table';
import './result.css';
import LoadingIcon from '../images/ripple.svg';

const Result = (props) => {
  const { parsedData } = props;
  console.log(parsedData);

  let resultElement;
  if (parsedData) {
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
  } else {
    resultElement = (
      <div>
        <LoadingIcon className="loading" />
      </div>
    );
  }

  return resultElement;
};

export default Result;
