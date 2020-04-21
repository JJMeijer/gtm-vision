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
  },
}));

export default function ListTable(props) {
  const classes = useStyles();
  const { list, replaceReferenceWithLink } = props;
  const [listVisibility, showList] = useState(false);

  let columnNames = ['list'];
  let rows = list.slice(1).map(x => [x]);
  if (Array.isArray(list[1])) {
    columnNames = list[1].filter((item, index) => index > 0 && index % 2 !== 0);
    rows = list.slice(1).map(row => row.filter((item, index) => index > 0 && index % 2 === 0));
  }

  return (
    <>
      <Typography className={classes.showButton} onClick={() => showList(!listVisibility)}>{listVisibility ? 'Hide List' : 'Show List'}</Typography>
      {listVisibility && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columnNames.map(col => (
                  <TableCell width={`${100 / columnNames.length}%`} key={col}>
                    <Typography variant="body1" className={classes.columnHeader}>{col}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={`row-${String(row)}`}>
                  {row.map(item => (
                    <TableCell width="50%" key={`item-${item}`}>
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
