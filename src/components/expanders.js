import React from 'react';
import Beautify from 'js-beautify';
import { Input } from 'element-react';

const tagExpander = (tagData) => {
  const { tagValues, firingOption } = tagData;
  const valueArray = [];
  Object.keys(tagValues).forEach((value) => {
    const text = `${value.replace(/([A-Z])/g, ' $1')}: ${tagValues[value]}`;
    if (value === 'code') {
      valueArray.push(
        <div>
          <pre>
            <code className="language-javascript">
              {
                Beautify(tagValues[value], {
                  indent_size: 4,
                })
              }
            </code>
          </pre>
        </div>,
      );
    } else {
      valueArray.push(<p>{text}</p>);
    }
  });
  return (
    <div>
      <p>{`Firing Option: ${firingOption}`}</p>
      {valueArray}
    </div>
  );
};

const triggerExpander = (triggerData) => {
  const { conditions } = triggerData;
  const valueArray = [];
  conditions.forEach((condition) => {
    const { variable, value, operator } = condition;
    const conditionElement = (
      <div className="condition">
        <Input value={variable} />
        <div className="operator">{`${operator}:`}</div>
        <Input value={value} disabled />
      </div>
    );
    valueArray.push(conditionElement);
  });

  return (
    <div>
      {valueArray}
    </div>
  );
};

const variableExpander = (variableData) => {
  const { variableValues } = variableData;
  const valueArray = [];
  Object.keys(variableValues).forEach((key) => {
    if (key === 'code') {
      valueArray.push(
        <div>
          <pre>
            <code className="language-javascript">
              {
                Beautify(variableValues.code, {
                  indent_size: 4,
                })
              }
            </code>
          </pre>
        </div>,
      );
    } else {
      valueArray.push(<p>{`${key}: ${variableValues[key]}`}</p>);
    }
  });

  return (
    <div>
      {valueArray}
    </div>
  );
};

export { tagExpander, triggerExpander, variableExpander };
