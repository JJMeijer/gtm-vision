import React from 'react';
import { Table } from 'element-react';

class TagTable extends React.Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      columns: [
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
          label: 'Type',
          prop: 'type',
        },
        {
          label: 'Name',
          prop: 'reference',
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
        border
      />
    );
  }
}

export default TagTable;
