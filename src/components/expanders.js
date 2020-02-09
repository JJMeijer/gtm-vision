import React from 'react';
import { Input } from 'element-react';

import CodeComponent from './code-component';

const tagExpander = (tagData) => {
  const { tagValues, firingOption } = tagData;
  const valueArray = [];
  Object.keys(tagValues).forEach((value) => {
    if (value === 'code') {
      valueArray.push(<CodeComponent code={tagValues[value]} type="html" key={value}/>);
    } else {
      const valueName = value.replace(/([A-Z])/g, ' $1');
      const valueContent = String(tagValues[value]);
      const settingElement = (
        <div className="tagSetting" key={valueName}>
          <p>{`${valueName}:`}</p>
          <p>{valueContent}</p>
        </div>
      );
      valueArray.push(settingElement);
    }
  });
  return (
    <div className="tagSettings">
      <div className="tagSetting">
        <p>Firing Option: </p>
        <p>{firingOption}</p>
      </div>
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
        <Input disabled value={value} />
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
