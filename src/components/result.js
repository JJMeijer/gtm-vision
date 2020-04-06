import React from 'react';
import ResultTabs from './result-tabs';
import parseGtm from '../parsers/gtm-parser';

export default function Result(props) {
  const { data } = props;
  let resultElement = <div />;

  if (data) {
    console.log('raw data: ', data);
    const parsedData = parseGtm(data);
    console.log('parsed data: ', parsedData);
    resultElement = <ResultTabs parsedData={parsedData} />;
  }

  return resultElement;
}
