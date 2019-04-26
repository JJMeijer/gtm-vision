import React from 'react';
import { Input } from 'element-react';
import Prism from 'prismjs';
import Beautify from 'js-beautify';

import '../css/prism.css';

Prism.highlightAll();

const getTableColumns = (type) => {
  const columnDefinitions = {
    tags: [
      {
        type: 'expand',
        expandPannel: (tagData) => {
          const { tagValues, firingOption } = tagData;
          const valueArray = [];
          Object.keys(tagValues).forEach((value) => {
            const text = `${value.replace(/([A-Z])/g, ' $1')}: ${tagValues[value]}`;
            valueArray.push(<p>{text}</p>);
          });

          return (
            <div>
              <p>{`Firing Option: ${firingOption}`}</p>
              {valueArray}
            </div>
          );
        },
      },
      {
        label: 'Name',
        prop: 'reference',
        sortable: true,
      },
      {
        label: 'Type',
        prop: 'type',
        sortable: true,
      },
    ],
    triggers: [
      {
        type: 'expand',
        expandPannel: (triggerData) => {
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
        },
      },
      {
        label: 'Name',
        prop: 'reference',
        sortable: true,
      },
      {
        label: 'Type',
        prop: 'type',
        sortable: true,
      },
      {
        label: 'Occurrences',
        prop: 'occurrences',
        sortable: true,
      },
    ],
    variables: [
      {
        type: 'expand',
        expandPannel: (variableData) => {
          const { variableValues } = variableData;
          if (variableValues.code) {
            return (
              <div>
                <pre>
                  <code className="javascript">
                    {
                      Beautify(variableValues.code, {
                        indent_size: 4,
                      })
                    }
                  </code>
                </pre>
              </div>
            );
          }
          return <p>test</p>;
        },
      },
      {
        label: 'Name',
        prop: 'reference',
        sortable: true,
      },
      {
        label: 'Type',
        prop: 'type',
        sortable: true,
      },
      {
        label: 'Occurrences',
        prop: 'occurrences',
        sortable: true,
      },
    ],
  };

  return columnDefinitions[type];
};

export default getTableColumns;
