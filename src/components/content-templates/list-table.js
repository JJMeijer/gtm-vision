import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function ListTable(props) {
  const { list, replaceReferenceWithLink } = props;

  const columnNames = list[1].filter((item, index) => index > 0 && index % 2 !== 0);
  const rows = list.slice(1).map(row => row.filter((item, index) => index > 0 && index % 2 === 0));

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columnNames.map(col => (
              <TableCell width="50%" key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={`row-${String(row)}`}>
              {row.map(item => (
                <TableCell width="50%" key={`item-${item}`}>
                  {replaceReferenceWithLink(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ListTable.propTypes = {
  list: PropTypes.arrayOf(PropTypes.oneOfType(
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.string).isRequired,
  )).isRequired,
  replaceReferenceWithLink: PropTypes.func.isRequired,
};
