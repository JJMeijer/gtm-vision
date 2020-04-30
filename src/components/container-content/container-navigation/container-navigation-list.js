import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

import ListItem from './container-navigation-list-item';

const listRef = React.createRef();

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    minHeight: 600,
  },
  list: {
    '&::-webkit-scrollbar': {
      width: theme.spacing(2),
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      borderRadius: '4px',
      outline: '1px solid slategrey',
    },
    scrollbarColor: 'rgba(0,0,0,.1) transparent',
    scrollbarWidth: 'auto',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(1.5),
    right: theme.spacing(3),
  },
}));

export default function ContainerNavigationList(props) {
  const classes = useStyles();
  const {
    listElements,
    currentElementIndex,
  } = props;

  useEffect(() => listRef.current.scrollToItem(currentElementIndex, 'smart'));

  return (
    <div className={classes.root}>
      <FixedSizeList
        className={classes.list}
        ref={listRef}
        height={600}
        itemCount={listElements.length}
        itemSize={55}
        itemData={props}
        width="100%"
        initialScrollOffset={currentElementIndex}
      >
        {ListItem}
      </FixedSizeList>
      <Fab size="small" className={classes.fab} onClick={() => listRef.current.scrollTo(0)}>
        <UpIcon />
      </Fab>
    </div>
  );
}

ContainerNavigationList.propTypes = {
  listElements: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  currentElementIndex: PropTypes.number.isRequired,
};
