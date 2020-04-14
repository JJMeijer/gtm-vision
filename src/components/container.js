import React from 'react';
import ContainerTabs from './container-tabs';
import parseGtm from '../parsers/gtm-parser';

export default function Container(props) {
  const { data } = props;
  let resultElement = <div />;

  if (data) {
    console.log('raw data: ', data);
    const startTime = performance.now();
    const parsedData = parseGtm(data);
    console.log(`Parsed data: (${Math.round(performance.now() - startTime)}ms)`, parsedData);

    resultElement = <ContainerTabs parsedData={parsedData} />;
  }

  return resultElement;
}
