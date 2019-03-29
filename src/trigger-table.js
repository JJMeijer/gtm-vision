import React from 'react';
import { Table, Input } from 'element-react';
import PropTypes from 'prop-types';

class TriggerTable extends React.Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      columns: [
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
                  <Input value={value} disabled/>
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
          label: 'Tags',
          prop: 'tagCount',
          sortable: true,
        },
      ],
      data,
    };
  }

  render() {
    const { columns, data } = this.state;
    return (
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={data}
        stripe
        border={false}
      />
    );
  }
}

TriggerTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    tagCount: PropTypes.number,
    reference: PropTypes.string,
    exceptions: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    conditions: PropTypes.arrayOf(PropTypes.shape({
      operator: PropTypes.string,
      value: PropTypes.string,
      variable: PropTypes.string,
    })),
  })).isRequired,
};
export default TriggerTable;
