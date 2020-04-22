import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { operatorDictionary } from '../../parsers/gtm-parser/dictionaries';

const useStyles = makeStyles(theme => ({
  columnHeader: {
    fontWeight: 'bold',
  },
  showButton: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 400,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    margin: 0,
    padding: 0,
    display: 'inline',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus:': {
      textDecoration: 'underline',
    },
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'dotted',
    borderBottomWidth: '1px',
  },
  table: {
    marginBottom: theme.spacing(1),
  },
}));

const createColumnsAndRows = (list) => {
  if (list[0] === 'list' && !Array.isArray(list[1])) {
    return {
      columnNames: ['list'],
      rows: list.slice(1).map(x => [x]),
    };
  }

  if (list[0] === 'list' && Array.isArray(list[1]) && list[1][0] === 'map') {
    return {
      columnNames: list[1].filter((item, index) => index > 0 && index % 2 !== 0),
      rows: list.slice(1).map(row => row.filter((item, index) => index > 0 && index % 2 === 0)),
    };
  }

  if (list[0] === 'list' && Array.isArray(list[1]) && list[1][0] === 'zb') {
    const operators = operatorDictionary();
    return {
      columnNames: ['Variable', 'Operator', 'Value'],
      rows: list.slice(1).map((row) => {
        const variable = row[2];
        const operator = operators[row[1]][row[4] ? 'negative' : 'positive'];
        const value = row[3];

        return [variable, operator, value];
      }),
    };
  }

  return {
    columnNames: ['Unknown List Type'],
    rows: [['Unknown List Type']],
  };
};

export default function ListTable(props) {
  const classes = useStyles();
  const { list, replaceReferenceWithLink } = props;
  const [listVisibility, showList] = useState(false);

  const { columnNames, rows } = createColumnsAndRows(list);

  return (
    <>
      <Typography className={classes.showButton} onClick={() => showList(!listVisibility)}>{listVisibility ? 'Hide List' : 'Show List'}</Typography>
      {listVisibility && (
        <TableContainer component={Paper} className={classes.table}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columnNames.map(col => (
                  // width={index === 0 ? '30%' : `${70 / (columnNames.length - 1)}%`}
                  <TableCell style={{ width: '50%' }} key={col}>
                    <Typography variant="body1" className={classes.columnHeader}>{col}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={`row-${String(row)}`}>
                  {row.map(item => (
                    <TableCell style={{ width: '50%' }} key={`item-${item}`}>
                      <Typography variant="body1">{replaceReferenceWithLink(item)}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

ListTable.propTypes = {
  list: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.arrayOf(PropTypes.string).isRequired,
  ])).isRequired,
  replaceReferenceWithLink: PropTypes.func.isRequired,
};
