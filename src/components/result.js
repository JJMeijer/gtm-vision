import React from 'react';

const Result = (props) => {
  const { parsedData } = props;
  let resultElement = <div />;
  if (parsedData) {
    console.log('parsed: ', parsedData);
    resultElement = <div>{JSON.stringify(parsedData)}</div>

  }

  return resultElement;
};

export default Result;
