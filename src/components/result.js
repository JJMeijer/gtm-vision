import React from 'react';

export default function Result(props) {
  const { parsedData } = props;

  let resultElement = <div />;
  if (parsedData) {
    console.log('parsed: ', parsedData);
    resultElement = <code>{JSON.stringify(parsedData,0,4)}</code>
  }

  return resultElement;
}

