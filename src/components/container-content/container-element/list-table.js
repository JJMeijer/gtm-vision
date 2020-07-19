import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@material-ui/core';
import { operatorDictionary } from '../../../../server/parsers/gtm-parser/dictionaries';

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
  tablePaper: {
    marginBottom: theme.spacing(1),
  },
  table: {
    tableLayout: 'fixed',
    overflowWrap: 'anywhere',
  },
}));

const createColumnsAndRows = (list) => {
  // Empty List => ['list']
  if (list[0] === 'list' && !list[1]) {
    return {
      columnNames: ['list'],
      rows: ['""'],
    };
  }

  // List with only 1 column => ['list', 'item1', 'item2', ...]
  if (list[0] === 'list' && !Array.isArray(list[1])) {
    return {
      columnNames: ['list'],
      rows: list.slice(1).map(x => [x]),
    };
  }

  // Mapping table => ['list', ['map', 'colName1', 'colValue1.1', 'colName2', 'colValue2.1'],
  // ['map', 'colName1, 'colValue1.2', 'colName2', colValue2.2], ['map', ...]]
  if (list[0] === 'list' && Array.isArray(list[1]) && list[1][0] === 'map') {
    return {
      columnNames: list[1].filter((item, index) => index > 0 && index % 2 !== 0),
      rows: list.slice(1).map(row => row.filter((item, index) => index > 0 && index % 2 === 0)),
    };
  }

  // Zone boundary mapping => ['list', ['zb', 'operator', 'variable', 'condition',
  // negative/positive boolean, uppercase sensitive boolean]]
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
  const columnWidth = `${100 / columnNames.length}%`;

  return (
    <>
      <Typography className={classes.showButton} onClick={() => showList(!listVisibility)}>{listVisibility ? 'Hide List' : 'Show List'}</Typography>
      {listVisibility && (
        <TableContainer component={Paper} className={classes.tablePaper}>
          <Table size="medium" className={classes.table}>
            <TableHead>
              <TableRow>
                {columnNames.map(col => (
                  <TableCell style={{ maxWidth: columnWidth }} key={col}>
                    <Typography variant="body1" className={classes.columnHeader}>{col}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={`row-${String(row)}`}>
                  {row.map(item => (
                    <TableCell key={`item-${item}`}>
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
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ])),
  ])).isRequired,
  replaceReferenceWithLink: PropTypes.func.isRequired,
};
