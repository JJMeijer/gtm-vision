import React from 'react';
import { Table } from 'element-react';
import Prism from 'prismjs';
import PropTypes from 'prop-types';

import getTableColumns from './table-columns';

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    const { dataType, data } = props;

    this.state = {
      columns: getTableColumns(dataType),
      data,
    };
  }

  componentDidMount() {
    Prism.highlightAll();
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

DataTable.propTypes = {
  dataType: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    tagCount: PropTypes.number,
    reference: PropTypes.string.isRequired,
    exceptions: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    conditions: PropTypes.arrayOf(PropTypes.shape({
      operator: PropTypes.string,
      value: PropTypes.string,
      variable: PropTypes.string,
    })),
  })).isRequired,
};

export default DataTable;
