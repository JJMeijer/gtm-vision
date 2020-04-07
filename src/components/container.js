import React from 'react';
import ContainerTabs from './container-tabs';
import parseGtm from '../parsers/gtm-parser';

export default function Container(props) {
  const { data } = props;
  let resultElement = <div />;

  if (data) {
    console.log('raw data: ', data);
    const parsedData = parseGtm(data);
    console.log('parsed data: ', parsedData);
    resultElement = <ContainerTabs parsedData={parsedData} />;
  }

  return resultElement;
}
