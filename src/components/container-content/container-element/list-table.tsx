import React, { useState } from 'react';
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

import { operatorDictionary } from '../../../../server/parsers/gtm/dictionaries';

import { replaceReferenceWithLink } from './settings';

import { ListOptions, StringList, MapList, ListOfZoneBoundary } from '../../../store/types';

/**
 * Styles
 */
const useStyles = makeStyles((theme) => ({
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

/**
 * Element Specific Types
 */
interface ListTableProps {
  list: ListOptions;
}

/**
 * Helper Function that translates multiple list options into
 * clear columns and rows.
 */
const createColumnsAndRows = (list: ListOptions) => {
  // Empty List => ['list']
  if (list[0] === 'list' && !list[1]) {
    return {
      columnNames: ['list'],
      rows: [['""']],
    };
  }

  // List with only 1 column => ['list', 'item1', 'item2', ...]
  if (list[0] === 'list' && typeof list[1] === 'string') {
    const stringList = list as StringList;
    return {
      columnNames: ['list'],
      rows: stringList.slice(1).map((x: string) => [x]),
    };
  }

  // Mapping table => ['list', ['map', 'colName1', 'colValue1.1', 'colName2', 'colValue2.1'],
  // ['map', 'colName1, 'colValue1.2', 'colName2', colValue2.2], ['map', ...]]
  if (list[0] === 'list' && Array.isArray(list[1]) && list[1][0] === 'map') {
    const mapList = list as MapList;
    const [, ...rows] = mapList;
    return {
      columnNames: mapList[1].filter((_item, index) => index > 0 && index % 2 !== 0),
      rows: rows.map((row) => row.filter((_item, index) => index > 0 && index % 2 === 0)),
    };
  }

  // Zone boundary mapping => ['list', ['zb', 'operator', 'variable', 'condition',
  // negative/positive boolean, uppercase sensitive boolean]]
  if (list[0] === 'list' && Array.isArray(list[1]) && list[1][0] === 'zb') {
    const zoneBoundaryList = list as ListOfZoneBoundary;
    const [, ...rows] = zoneBoundaryList;
    const operators = operatorDictionary;
    return {
      columnNames: ['Variable', 'Operator', 'Value'],
      rows: rows.map((row) => {
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

/**
 * Generates a Table from a list element in the GTM container.
 * List is hidden at first, because they can be quite long and take over
 * the screen.
 */
export const ListTable: React.FC<ListTableProps> = (props) => {
  const classes = useStyles();

  const { list } = props;

  const [listVisibility, showList] = useState(false);

  const { columnNames, rows } = createColumnsAndRows(list);
  const columnWidth = `${100 / columnNames.length}%`;

  return (
    <>
      <Typography className={classes.showButton} onClick={() => showList(!listVisibility)}>
        {listVisibility ? 'Hide List' : 'Show List'}
      </Typography>
      {listVisibility && (
        <TableContainer component={Paper} className={classes.tablePaper}>
          <Table size="medium" className={classes.table}>
            <TableHead>
              <TableRow>
                {columnNames.map((col) => (
                  <TableCell style={{ maxWidth: columnWidth }} key={col}>
                    <Typography variant="body1" className={classes.columnHeader}>
                      {col}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`row-${String(row)}`}>
                  {row.map((item) => (
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
};
