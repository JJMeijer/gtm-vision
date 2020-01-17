import React from 'react';
import Beautify from 'js-beautify';
import { Input } from 'element-react';
import Prism from 'prismjs';

const tagExpander = (tagData) => {
  const { tagValues, firingOption } = tagData;
  const valueArray = [];
  Object.keys(tagValues).forEach((value) => {
    const text = `${value.replace(/([A-Z])/g, ' $1')}: ${tagValues[value]}`;
    if (value === 'code') {
      valueArray.push(
        <div>
          <h3>Custom HTML</h3>
          <pre>
            <code className="language-html">
              {
                Beautify(tagValues[value], {
                  indent_size: 4,
                  type: 'html',
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
          <h3>Custom Javascript</h3>
          <pre>
            <code className="language-javascript">
              {
                Prism.highlight(Beautify(variableValues.code, {
                  indent_size: 4,
                }), Prism.languages.javascript, 'javascript')
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
